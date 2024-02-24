// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// import { getAnalytics } from 'firebase/analytics'
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA7iyKaRUbo0vgVB0QvOtmpRkaU9R6jaLA',
  authDomain: 'cm3050-calm-mind.firebaseapp.com',
  projectId: 'cm3050-calm-mind',
  storageBucket: 'cm3050-calm-mind.appspot.com',
  messagingSenderId: '1050634579199',
  appId: '1:1050634579199:web:2b63974aa691f37bce30ca',
  measurementId: 'G-MSR7Y9G7RS',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// const analytics = getAnalytics(app)

// Initialize Firebase Authentication and get a reference to the service
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})

export { auth }
