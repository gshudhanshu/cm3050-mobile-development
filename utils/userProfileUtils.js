import { db, storage } from '../firebase/firebase.js'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, setDoc } from 'firebase/firestore'

export const uploadProfilePicture = async (userId, imageBlob) => {
  const storageRef = ref(storage, `profilePictures/${userId}`)
  await uploadBytes(storageRef, imageBlob)
  return getDownloadURL(storageRef)
}

export const saveUserProfile = async (userId, profileData) => {
  const userRef = doc(db, 'users', userId)
  await setDoc(userRef, profileData, { merge: true })
}

export const getUserProfile = async (userId) => {
  const userRef = doc(db, 'users', userId)
  const docSnap = await getDoc(userRef)
  return docSnap.exists() ? docSnap.data() : null
}
