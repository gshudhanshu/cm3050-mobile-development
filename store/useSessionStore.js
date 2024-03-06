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
  limit,
} from 'firebase/firestore'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.tz.setDefault('Europe/London')

const useSessionStore = create((set) => ({
  popularSessions: [],
  curatedSessions: [],

  categories: [],
  sessions: [],
  progress: [],
  todayProgressData: [],
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

  // Fetch popular sessions function
  fetchPopularSessions: async () => {
    const sessionsQuery = query(
      collection(db, 'sessions'),
      orderBy('numberOfPlays', 'desc'),
      limit(10)
    )
    const querySnapshot = await getDocs(sessionsQuery)
    const popularSessions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    set({ popularSessions })
  },

  // Fetch curated sessions function
  fetchCuratedSessions: async () => {
    const sessionsQuery = query(
      collection(db, 'sessions'),
      where('curated', '==', true),
      limit(10)
    )
    const querySnapshot = await getDocs(sessionsQuery)
    const curatedSessions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    set({ curatedSessions })
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

    // Fetch the current session to update its play count
    const currentSessionDoc = await getDoc(sessionRef)
    if (currentSessionDoc.exists()) {
      const currentSessionData = currentSessionDoc.data()
      const updatedPlays = (currentSessionData.numberOfPlays || 0) + 1

      // Update the session document with the new number of plays
      await updateDoc(sessionRef, { numberOfPlays: updatedPlays })
    } else {
      console.log('Session document does not exist!')
    }

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
    const sessionsRef = collection(db, `progress/${userId}/sessions`)

    // Query for sessions in the last 65 days
    const sessionsQuery = query(
      sessionsRef,
      where('date', '>=', Timestamp.fromDate(sixtyFiveDaysAgo.toDate())),
      orderBy('date', 'desc')
    )
    const snapshot = await getDocs(sessionsQuery)

    let sessions = snapshot.docs.map((doc) => ({
      ...doc.data(),
      date: doc.data().date.toDate(), // Convert Timestamp to Date
    }))

    let todaySessionsData = []
    let pastSessionsData = []

    for (const doc of snapshot.docs) {
      let session = { ...doc.data(), date: doc.data().date.toDate() } // Convert Timestamp to Date

      // Fetch session details for today's sessions
      if (dayjs(session.date).isSame(today, 'day') && session.sessionRef) {
        const sessionDetailSnapshot = await getDoc(session.sessionRef)
        if (sessionDetailSnapshot.exists()) {
          session.sessionDetails = sessionDetailSnapshot.data()
        }
        todaySessionsData.push(session)
      } else {
        pastSessionsData.push(session)
      }
    }

    // Assuming duration is stored in minutes in each session
    // Adjust the session date format as per your data if needed
    const formatSessionDataByDay = (sessions) => {
      return sessions.reduce((acc, curr) => {
        const dateKey = dayjs(curr.date).format('YYYY-MM-DD')
        if (!acc[dateKey]) {
          acc[dateKey] = []
        }
        acc[dateKey].push(curr)
        return acc
      }, {})
    }

    const sessionDataByDay = formatSessionDataByDay(sessions)

    // Calculate daily totals
    const dailyTotals = Object.keys(sessionDataByDay).map((date) => {
      const dailySessions = sessionDataByDay[date]
      const totalDuration = dailySessions.reduce(
        (total, session) => total + session.duration,
        0
      )
      return { date, totalDuration }
    })

    // Sort dailyTotals by date to ensure correct calculation for consecutive days
    dailyTotals.sort((a, b) => new Date(a.date) - new Date(b.date))

    // Calculate averages for the current and last 7 and 30 days
    const getAverageForPeriod = (days) => {
      const periodStart = today.subtract(days, 'day')
      const relevantSessions = dailyTotals.filter(({ date }) =>
        dayjs(date).isAfter(periodStart)
      )
      const total = relevantSessions.reduce(
        (sum, { totalDuration }) => sum + totalDuration,
        0
      )
      return relevantSessions.length > 0 ? total / relevantSessions.length : 0
    }

    const current7DaysAvg = getAverageForPeriod(7)
    const last7DaysAvg = getAverageForPeriod(14) - current7DaysAvg
    const current30DaysAvg = getAverageForPeriod(30)
    const last30DaysAvg = getAverageForPeriod(60) - current30DaysAvg
    const last7Days =
      last7DaysAvg === 0 ? 100 : (current7DaysAvg / last7DaysAvg) * 100
    const last30Days =
      last30DaysAvg === 0 ? 100 : (current30DaysAvg / last30DaysAvg) * 100
    set({
      todayProgressData: todaySessionsData,
      progress: [...todaySessionsData, ...pastSessionsData],
      percentageDifferences: {
        current7DaysAvg,
        last7DaysAvg,
        last7Days: last7Days || 0,
        current30DaysAvg,
        last30DaysAvg,
        last30Days: last30Days || 0,
        todayCompletedGoalPercentage:
          (getAverageForPeriod(1) / dailyGoal) * 100,
      },
    })
  },
}))

export default useSessionStore
