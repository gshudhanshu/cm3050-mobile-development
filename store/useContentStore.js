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
    const sessionCollectionRef = collection(db, `progress/${userId}/sessions`)
    const newSessionData = { ...sessionData, date: Timestamp.now() } // Use Firestore Timestamp for the date

    // Add new session as a separate document
    await addDoc(sessionCollectionRef, newSessionData)
    // Step 2: Update the longest streak in the user's document
    const userRef = doc(db, 'users', userId)
    const userDoc = await getDoc(userRef)

    if (!userDoc.exists()) {
      console.log('User document does not exist!')
      return
    }

    const userData = userDoc.data()
    // Assuming the lastSessionDate is stored in the user document and sessions are daily
    const lastSessionDate = userData.lastSessionDate
      ? userData.lastSessionDate.toDate()
      : null
    let { longestStreak = 0, currentStreak = 0 } = userData
    const currentDate = new Date()

    if (lastSessionDate) {
      const differenceInDays = dayjs(currentDate).diff(
        dayjs(lastSessionDate),
        'day'
      )
      if (differenceInDays === 1) {
        // Continue the current streak
        currentStreak += 1
      } else if (differenceInDays > 1) {
        // Reset the current streak
        currentStreak = 1
      }
    } else {
      // Starting the first streak
      currentStreak = 1
    }

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak
      // Update the user document with the new longest streak
      await setDoc(
        userRef,
        {
          longestStreak,
          currentStreak,
          lastSessionDate: Timestamp.fromDate(currentDate),
        },
        { merge: true }
      )
    } else {
      // Update the current streak and last session date even if it's not the longest
      await setDoc(
        userRef,
        { currentStreak, lastSessionDate: Timestamp.fromDate(currentDate) },
        { merge: true }
      )
    }
  },

  // Method to fetch progress of the last 30 days for a user
  fetchProgressLast65DaysAndCalculateAverages: async (userId, dailyGoal) => {
    const today = dayjs().tz('Europe/London')
    const sixtyFiveDaysAgo = today.subtract(65, 'days')
    const sessionsRef = collection(db, `progress/${userId}/sessions`)

    // Query for sessions in the last 65 days
    const sessionsQuery = query(
      sessionsRef,
      where('date', '>=', Timestamp.fromDate(sixtyFiveDaysAgo.toDate())),
      orderBy('date', 'desc')
    )

    const snapshot = await getDocs(sessionsQuery)
    const sessions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
    }))

    // Filter sessions for calculating averages and differences
    const filterSessionsForPeriod = (daysAgoStart, daysAgoEnd) => {
      const endPeriod = today.subtract(daysAgoEnd, 'days')
      const startPeriod = today.subtract(daysAgoStart, 'days')
      return sessions.filter(
        (session) =>
          dayjs(session.date).isAfter(endPeriod) &&
          dayjs(session.date).isBefore(startPeriod)
      )
    }

    // Calculate averages for the specified periods
    const last7DaysSessions = filterSessionsForPeriod(7, 0)
    const previous7DaysSessions = filterSessionsForPeriod(14, 7)
    const last30DaysSessions = filterSessionsForPeriod(30, 0)
    const previous30DaysSessions = filterSessionsForPeriod(60, 30)

    const avgLast7Days = calculateAverageDuration(last7DaysSessions)
    const avgPrevious7Days = calculateAverageDuration(previous7DaysSessions)
    const avgLast30Days = calculateAverageDuration(last30DaysSessions)
    const avgPrevious30Days = calculateAverageDuration(previous30DaysSessions)

    // Calculate percentage differences
    const percentDifference7Days = avgPrevious7Days
      ? ((avgLast7Days - avgPrevious7Days) / avgPrevious7Days) * 100
      : 0
    const percentDifference30Days = avgPrevious30Days
      ? ((avgLast30Days - avgPrevious30Days) / avgPrevious30Days) * 100
      : 0

    // Calculate today's completed goal percentage
    const todaySessions = filterSessionsForPeriod(1, 0)
    const todayTotalDuration = calculateAverageDuration(todaySessions)
    const todayCompletedGoalPercentage = dailyGoal
      ? (todayTotalDuration / dailyGoal) * 100
      : 0

    // Update Zustand store
    set({
      percentageDifferences: {
        last7Days: percentDifference7Days,
        last30Days: percentDifference30Days,
        todayCompletedGoalPercentage,
      },
    })
  },
}))

export default useContentStore
