import { create } from 'zustand'
import { db, storage } from '../firebase/firebase.js'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from 'firebase/firestore'

const useContentStore = create((set) => ({
  categories: [],
  sessions: [],
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
}))

export default useContentStore
