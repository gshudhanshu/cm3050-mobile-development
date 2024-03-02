import { create } from 'zustand'
import { db, storage } from '../firebase/firebase'
import { arrayUnion, updateDoc } from 'firebase/firestore'

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import {
  doc,
  setDoc,
  getDoc,
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
    const userProgressRef = doc(db, 'progress', userId)
    const newSessionData = { ...sessionData, date: Timestamp.now() } // Use Firestore Timestamp for the date

    // Fetch the current progress document to check the size of the sessions array
    const docSnap = await getDoc(userProgressRef)
    console.log(docSnap.data())
    if (docSnap.exists()) {
      let sessions = docSnap.data().sessions || []

      // Check if the sessions array size exceeds 100
      if (sessions.length >= 200) {
        // Sort sessions by date to ensure we're removing the oldest ones
        sessions.sort((a, b) => a.date.toMillis() - b.date.toMillis())

        // Remove the oldest 135 entries to keep the last 65
        sessions = sessions.slice(135)

        // Update the sessions array in Firestore, including the new session
        await setDoc(userProgressRef, {
          sessions: [...sessions, newSessionData],
        })
      } else {
        // If the array size does not exceed 100, simply append the new session
        console.log('Adding new session')
        await updateDoc(userProgressRef, {
          sessions: arrayUnion(newSessionData),
        })
      }
    } else {
      // If the document does not exist, create it with the new session as the first entry
      await setDoc(userProgressRef, { sessions: [newSessionData] })
    }
  },
  // Method to fetch progress of the last 30 days for a user
  fetchProgressLast65DaysAndCalculateAverages: async (userId, dailyGoal) => {
    const userProgressRef = doc(db, 'progress', userId)

    // Fetch the user's progress document
    const docSnap = await getDoc(userProgressRef)
    if (!docSnap.exists()) {
      console.log('No such document!')
      return
    }

    // Filter sessions from the last 65 days
    const cutoffDate = dayjs().tz('Europe/London').subtract(65, 'days')
    let sessions = docSnap.data().sessions || []
    sessions = sessions.filter((session) =>
      dayjs(session.date.toDate()).isAfter(cutoffDate)
    )

    // Helper function for filtering sessions within a specific period
    const filterSessionsForPeriod = (startDaysAgo, endDaysAgo) => {
      const endDate = dayjs().tz('Europe/London').subtract(endDaysAgo, 'days')
      const startDate = dayjs()
        .tz('Europe/London')
        .subtract(startDaysAgo, 'days')
      return sessions.filter(({ date }) =>
        dayjs(date.toDate()).isBetween(startDate, endDate, null, '[]')
      )
    }

    // Calculate average durations
    const last7Days = filterSessionsForPeriod(0, 7)
    const previous7Days = filterSessionsForPeriod(7, 14)
    const last30Days = filterSessionsForPeriod(0, 30)
    const previous30Days = filterSessionsForPeriod(30, 60)

    // Calculate average session durations
    const avgLast7Days = calculateAverageDuration(last7Days)
    const avgPrevious7Days = calculateAverageDuration(previous7Days)
    const avgLast30Days = calculateAverageDuration(last30Days)
    const avgPrevious30Days = calculateAverageDuration(previous30Days)

    // Calculate percentage differences
    const percentDifference7Days =
      avgPrevious7Days > 0
        ? ((avgLast7Days - avgPrevious7Days) / avgPrevious7Days) * 100
        : 0
    const percentDifference30Days =
      avgPrevious30Days > 0
        ? ((avgLast30Days - avgPrevious30Days) / avgPrevious30Days) * 100
        : 0

    // Today's completed goal percentage (assuming `dailyGoal` is defined elsewhere)
    const todaySessions = filterSessionsForPeriod(0, 1)
    const todayTotalDuration = calculateAverageDuration(todaySessions)
    const todayCompletedGoalPercentage = dailyGoal
      ? (todayTotalDuration / dailyGoal) * 100
      : 0

    // Update the store with calculated data
    set({
      progress: sessions,
      percentageDifferences: {
        last7Days: percentDifference7Days,
        last30Days: percentDifference30Days,
        todayCompletedGoalPercentage,
      },
    })
  },
}))

export default useContentStore
