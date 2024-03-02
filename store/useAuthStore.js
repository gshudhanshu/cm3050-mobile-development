import { create } from 'zustand'
import { db, storage } from '../firebase/firebase.js'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, setDoc, getDoc } from 'firebase/firestore'

// Utility function to convert a file URI to a Blob
const uriToBlob = async (uri) => {
  const response = await fetch(uri)
  const blob = await response.blob()
  return blob
}

const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  user: null,
  profile: null,
  setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),
  setUser: (user) => set(() => ({ user })),
  setUserProfile: (profile) => set(() => ({ profile })),

  uploadProfilePicture: async (userId, uri) => {
    const blob = await uriToBlob(uri)
    const storageRef = ref(storage, `profilePictures/${userId}`)
    await uploadBytes(storageRef, blob)
    const url = await getDownloadURL(storageRef)
    // Optionally, save the URL to the user's profile in Firestore
    const profileData = { photoURL: url }
    await get().saveUserProfile(userId, profileData)
    // Update local state with the new profile URL
    set((state) => ({
      profile: { ...state.profile, ...profileData },
    }))
    return url
  },
  saveUserProfile: async (userId, profileData) => {
    const userRef = doc(db, 'users', userId)
    await setDoc(userRef, profileData, { merge: true })
    // Update local state with the new profile data
    set(() => ({
      profile: profileData,
    }))
  },
  getUserProfile: async (userId) => {
    const userRef = doc(db, 'users', userId)
    const docSnap = await getDoc(userRef)
    if (docSnap.exists()) {
      const profileData = docSnap.data()
      set(() => ({
        profile: profileData,
      }))
      return profileData
    } else {
      return null
    }
  },

  setDailyGoal: async (goalValue) => {
    const userId = get().user.uid
    const userRef = doc(db, 'users', userId)
    await setDoc(userRef, { dailyGoal: goalValue }, { merge: true })
    // Update local state with the new daily goal
    set((state) => ({
      profile: { ...state.profile, dailyGoal: goalValue },
    }))
  },
}))

export default useAuthStore
