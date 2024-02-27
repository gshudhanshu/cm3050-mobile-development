import React from 'react'
import { db, storage } from '../firebase/firebase.js'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, setDoc, getDoc } from 'firebase/firestore'

const uriToBlob = async (uri) => {
  const response = await fetch(uri)
  const blob = await response.blob()
  return blob
}

export const uploadProfilePicture = async (userId, uri) => {
  const blob = await uriToBlob(uri)
  const storageRef = ref(storage, `profilePictures/${userId}`)
  await uploadBytes(storageRef, blob)
  const url = await getDownloadURL(storageRef)
  return url
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
