import { create } from 'zustand'
import { db, storage } from '../firebase/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { uriToBlob } from '../utils/utils.js'

const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  user: null,
  profile: null,

  // Setter methods for updating state
  setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),
  setUser: (user) => set(() => ({ user })),
  setUserProfile: (profile) => set(() => ({ profile })),

  // upload profile picture
  uploadProfilePicture: async (userId, uri) => {
    // Convert the image URI to a Blob for upload
    const blob = await uriToBlob(uri)
    const storageRef = ref(storage, `profilePictures/${userId}`)
    // Upload the Blob to Firebase Storage
    await uploadBytes(storageRef, blob)
    const url = await getDownloadURL(storageRef)
    const profileData = { photoURL: url }
    console.log('Profile Data before saving:', profileData)
    await get().saveUserProfile(userId, profileData)
    // Update local state with the new profile URL
    set((state) => ({
      profile: { ...state.profile, ...profileData },
    }))
    console.log('Store state after update:', get().profile)
    return url
  },

  // save user profile data to Firestore
  saveUserProfile: async (userId, profileData) => {
    const userRef = doc(db, 'users', userId)
    // Merge the provided data with existing data
    await setDoc(userRef, profileData, { merge: true })
    set(() => ({
      profile: profileData,
    }))
  },

  // fetch user profile data
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

  // set a daily goal in the user's profile
  setDailyGoal: async (goalValue) => {
    const userId = get().user.uid
    const userRef = doc(db, 'users', userId)
    // Merge the goal value with existing data
    await setDoc(userRef, { dailyGoal: goalValue }, { merge: true })
    // Update local state with the new daily goal
    set((state) => ({
      profile: { ...state.profile, dailyGoal: goalValue },
    }))
  },
}))

export default useAuthStore
