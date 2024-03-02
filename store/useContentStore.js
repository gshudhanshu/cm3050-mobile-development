import { create } from 'zustand'
import { db, storage } from '../firebase/firebase'
import { arrayUnion, updateDoc } from 'firebase/firestore'

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.tz.setDefault('Europe/London')

// Helper function to calculate average duration
const calculateAverageDuration = (sessions) => {
  const totalDuration = sessions.reduce(
    (sum, session) => sum + session.duration,
    0
  )
  return sessions.length > 0 ? totalDuration / sessions.length : 0
}

const useContentStore = create((set) => ({
  categories: [],
  sessions: [],
  progress: [],
  todayProgessData: [],
  percentageDifferences: {
    last7Days: 0,
    last30Days: 0,
    todayCompletedGoalPercentage: 0,
  },

  fetchCategories: async () => {
    const categoriesSnapshot = await getDocs(collection(db, 'categories'))
    const categories = []
    for (const doc of categoriesSnapshot.docs) {
      const categoryData = doc.data()
      // Query sessions for each category
      const sessionsQuery = query(
        collection(db, 'sessions'),
        where('category', '==', doc.data().category)
      )
      const sessionsSnapshot = await getDocs(sessionsQuery)
      // Add the category along with its session count, 0 if no sessions found
      categories.push({
        id: doc.id,
        ...categoryData,
        sessionCount: sessionsSnapshot.docs.length, // Will be 0 if no sessions are found
      })
    }
    set({ categories })
  },
  fetchSessions: async (category = null) => {
    let sessionsQuery = collection(db, 'sessions')
    if (category) {
      sessionsQuery = query(sessionsQuery, where('category', '==', category))
    }
    const sessionsSnapshot = await getDocs(sessionsQuery)
    const sessions = sessionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    set({ sessions })
  },
  // fetch single session using its id
  fetchSession: async (sessionId) => {
    const sessionRef = doc(db, 'sessions', sessionId)
    const sessionDoc = await getDoc(sessionRef)
    return sessionDoc.data()
  },
  // Method to add a new finished session
  addFinishedSession: async (userId, sessionData) => {
    // Step 1: Add the session to the progress collection
    console.log('sessionRef', sessionRef)
    const sessionRef = doc(db, 'sessions', sessionData.sessionId)
    const progressRef = collection(db, `progress/${userId}/sessions`)
    const newSessionData = {
      sessionRef: sessionRef,
      ...sessionData,
      date: Timestamp.now(),
    }
    await addDoc(progressRef, newSessionData)

    // Step 2: Update user document with streak, total sessions, and total duration
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      console.log('User document does not exist!')
      return
    }

    const userData = userDoc.data()
    const lastSessionDate = userData.lastSessionDate
      ? userData.lastSessionDate.toDate()
      : null
    let {
      longestStreak = 0,
      currentStreak = 0,
      totalSessions = 0,
      totalSessionDuration = 0,
    } = userData
    const currentDate = new Date()

    if (lastSessionDate) {
      const differenceInDays = dayjs(currentDate).diff(
        dayjs(lastSessionDate),
        'day'
      )
      currentStreak = differenceInDays === 1 ? currentStreak + 1 : 1 // Continue or reset the current streak
    } else {
      currentStreak = 1 // Starting the first streak
    }

    // Update longest streak if the current streak surpasses it
    longestStreak =
      currentStreak > longestStreak ? currentStreak : longestStreak

    // Increment total sessions and total session duration
    totalSessions += 1
    totalSessionDuration += sessionData.duration // Assuming 'duration' is provided in sessionData in minutes

    // Update the user document with the new data
    await setDoc(
      userRef,
      {
        currentStreak,
        longestStreak,
        lastSessionDate: Timestamp.fromDate(currentDate),
        totalSessions,
        totalSessionDuration,
      },
      { merge: true }
    )
  },

  // Method to fetch progress of the last 30 days for a user
  fetchProgressLast65DaysAndCalculateAverages: async (userId, dailyGoal) => {
    console.log('Fetching progress for the last 65 days...')
    const today = dayjs()
    const sixtyFiveDaysAgo = today.subtract(65, 'days')
    const progressCollectionRef = collection(db, `progress/${userId}/sessions`)

    // Query for sessions in the last 65 days
    const progressQuery = query(
      progressCollectionRef,
      where('date', '>=', Timestamp.fromDate(sixtyFiveDaysAgo.toDate())),
      orderBy('date', 'desc')
    )

    const progressSnapshot = await getDocs(progressQuery)
    let progressData = []
    let todaySessionsData = []

    for (const doc of progressSnapshot.docs) {
      let data = doc.data()
      data.date = data.date.toDate() // Convert Timestamp to Date object

      // For today's sessions, fetch the detailed session data
      if (dayjs(data.date).isSame(today, 'day')) {
        const sessionSnapshot = await getDoc(data.sessionRef)
        if (sessionSnapshot.exists()) {
          todaySessionsData.push({
            ...data,
            sessionData: { ...sessionSnapshot.data() }, // Merge session details
          })
        }
      } else {
        progressData.push(data)
      }
    }

    // Now, `progressData` contains sessions for the last 65 days excluding today,
    // and `todaySessionsData` contains today's sessions with detailed data.

    // Calculate averages and percentage differences here...

    const calculatePercentageDifference = (currentPeriod, previousPeriod) => {
      if (previousPeriod.length === 0) return 0
      const currentAverage =
        currentPeriod.reduce((acc, cur) => acc + cur.duration, 0) /
        currentPeriod.length
      const previousAverage =
        previousPeriod.reduce((acc, cur) => acc + cur.duration, 0) /
        previousPeriod.length
      return ((currentAverage - previousAverage) / previousAverage) * 100
    }

    // Example calculation (adapt as necessary)
    const last7DaysSessions = progressData.filter((session) =>
      dayjs(session.date).isAfter(today.subtract(7, 'days'))
    )
    const previous7DaysSessions = progressData.filter((session) =>
      dayjs(session.date).isBetween(
        today.subtract(14, 'days'),
        today.subtract(7, 'days')
      )
    )
    const last30DaysSessions = progressData.filter((session) =>
      dayjs(session.date).isAfter(today.subtract(30, 'days'))
    )
    const previous30DaysSessions = progressData.filter((session) =>
      dayjs(session.date).isBetween(
        today.subtract(60, 'days'),
        today.subtract(30, 'days')
      )
    )

    const todayCompletedGoalPercentage =
      (todaySessionsData.reduce((acc, cur) => acc + cur.duration, 0) /
        dailyGoal) *
      100

    console.log('todaySessionsData', todaySessionsData)

    set({
      todayProgessData: todaySessionsData,
      progress: [...todaySessionsData, ...progressData], // Combine today's detailed sessions with other progress data
      percentageDifferences: {
        last7Days: calculatePercentageDifference(
          last7DaysSessions,
          previous7DaysSessions
        ),
        last30Days: calculatePercentageDifference(
          last30DaysSessions,
          previous30DaysSessions
        ),
        todayCompletedGoalPercentage,
      },
    })
  },
}))

export default useContentStore
