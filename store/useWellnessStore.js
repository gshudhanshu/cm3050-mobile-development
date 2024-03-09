import { create } from 'zustand'
import { db } from '../firebase/firebase'
import {
  doc,
  getDoc,
  setDoc,
  query,
  where,
  collection,
  getDocs,
  Timestamp,
} from 'firebase/firestore'
import { fetch as fetchPolyfill } from 'whatwg-fetch'

// Day.js plugins for date manipulation and timezone handling
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.tz.setDefault('Europe/London')

const useWellnessStore = create((set, get) => ({
  dailyQuote: {
    quote: '',
    author: '',
  },
  userMood: null,
  averageMoodLast7Days: null,
  averageMoodLast30Days: null,

  // Fetch a quote of the day from Firestore or the Quotable API
  fetchQuote: async () => {
    const today = dayjs().format('YYYY-MM-DD')
    const quoteRef = doc(db, 'quotes', today)

    try {
      const docSnap = await getDoc(quoteRef)
      if (docSnap.exists()) {
        // If today's quote already exists in Firestore, use it
        const { quote, author } = docSnap.data()
        set({ dailyQuote: { quote, author } })
      } else {
        // Fetch new quote and save it to Firestore
        const response = await fetchPolyfill('https://api.quotable.io/random')
        const { content, author } = await response.json()

        // Save the fetched quote to Firestore for today
        await setDoc(quoteRef, { quote: content, author: author })

        // Update the store's state with the new quote
        set({ dailyQuote: { quote: content, author: author } })
      }
    } catch (error) {
      console.error('Error fetching or saving quote:', error)
    }
  },

  // Fetch the user's mood for today
  fetchUserMood: async (userId) => {
    const today = dayjs().format('YYYY-MM-DD')
    const userMoodRef = doc(db, 'mood', userId, 'dailyMood', today)

    try {
      const docSnap = await getDoc(userMoodRef)
      if (docSnap.exists()) {
        set({ userMood: docSnap.data().mood })
      } else {
        console.log('No mood data for today.')
      }
    } catch (error) {
      console.error('Failed to fetch user mood:', error)
    }
  },

  // Set the user's mood for today
  setUserMood: async (userId, mood) => {
    const today = dayjs().startOf('day').toDate()
    const userMoodDocRef = doc(
      db,
      `mood/${userId}/dailyMood`,
      dayjs().format('YYYY-MM-DD')
    )
    try {
      await setDoc(
        userMoodDocRef,
        { mood: mood, date: Timestamp.fromDate(today) },
        { merge: true }
      )
      set({ userMood: mood })
    } catch (error) {
      console.error('Failed to save user mood:', error)
    }
  },

  // Fetch the user's mood averages for the last 7 and 30 days
  fetchMoodAverages: async (userId) => {
    const now = dayjs()
    const sevenDaysAgo = now.subtract(7, 'days').startOf('day').toDate()
    const thirtyDaysAgo = now.subtract(30, 'days').startOf('day').toDate()

    const moodsRef = collection(db, `mood/${userId}/dailyMood`)
    // Query for mood data in the last 7
    const last7DaysQuery = query(
      moodsRef,
      where('date', '>=', Timestamp.fromDate(sevenDaysAgo)),
      where('date', '<=', Timestamp.fromDate(now.toDate()))
    )
    // Query for mood data in the last 30 days
    const last30DaysQuery = query(
      moodsRef,
      where('date', '>=', Timestamp.fromDate(thirtyDaysAgo)),
      where('date', '<=', Timestamp.fromDate(now.toDate()))
    )

    // Calculate the average mood for a given query
    const calculateAverageMood = async (query) => {
      let totalMood = 0
      let count = 0
      const snapshot = await getDocs(query)
      snapshot.forEach((doc) => {
        totalMood += doc.data().mood
        count++
      })
      return count > 0 ? totalMood / count : null
    }

    // Calculate the average mood for the last 7 and 30 days
    const averageMoodLast7Days = await calculateAverageMood(last7DaysQuery)
    const averageMoodLast30Days = await calculateAverageMood(last30DaysQuery)

    set({ averageMoodLast7Days, averageMoodLast30Days })
  },
}))

export default useWellnessStore
