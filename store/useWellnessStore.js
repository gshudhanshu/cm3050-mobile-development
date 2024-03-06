import { create } from 'zustand'
import { db } from '../firebase/firebase' // Adjust according to your project structure
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { fetch as fetchPolyfill } from 'whatwg-fetch'

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

  fetchQuote: async () => {
    try {
      const response = await fetch('https://api.quotable.io/random')
      const { content, author } = await response.json()
      set({ dailyQuote: { quote: content, author: author } })
    } catch (error) {
      console.error('Failed to fetch quote:', error)
    }
  },

  fetchUserMood: async (userId) => {
    const today = dayjs().format('DD-MM-YYYY')
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

  setUserMood: async (userId, mood) => {
    const today = dayjs().format('DD-MM-YYYY')
    const userMoodRef = doc(db, 'mood', userId, 'dailyMood', today)
    try {
      await setDoc(userMoodRef, { mood: mood, date: today }, { merge: true })
      set({ userMood: mood })
    } catch (error) {
      console.error('Failed to save user mood:', error)
    }
  },
}))

export default useWellnessStore
