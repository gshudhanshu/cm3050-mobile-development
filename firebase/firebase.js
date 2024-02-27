import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyA7iyKaRUbo0vgVB0QvOtmpRkaU9R6jaLA',
  authDomain: 'cm3050-calm-mind.firebaseapp.com',
  projectId: 'cm3050-calm-mind',
  storageBucket: 'cm3050-calm-mind.appspot.com',
  messagingSenderId: '1050634579199',
  appId: '1:1050634579199:web:2b63974aa691f37bce30ca',
  measurementId: 'G-MSR7Y9G7RS',
}

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Initialize Firestore
const db = getFirestore(app)
const storage = getStorage(app)

// Correctly initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})

export { db, auth, storage }
