import { create } from 'zustand'
import { db, storage } from '../firebase/firebase.js'
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  Timestamp,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { uriToBlob } from '../utils/utils'

const useJournalStore = create((set, get) => ({
  journals: [],

  uploadJournalImage: async (userId, imageUri) => {
    const blob = await uriToBlob(imageUri)
    const imageName = `journal-${Date.now()}`
    // Update the storage path to be user-specific
    const storageRef = ref(storage, `journalImages/${userId}/${imageName}`)
    await uploadBytes(storageRef, blob)
    const imageUrl = await getDownloadURL(storageRef)
    return imageUrl
  },

  fetchJournals: async (userId) => {
    // Update the Firestore path to fetch from the user-specific subcollection
    const querySnapshot = await getDocs(
      collection(db, `journals/${userId}/myjournals`)
    )
    const journals = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    set({ journals })
  },

  addJournal: async (userId, journalData) => {
    if (journalData.imageUri) {
      const imageUrl = await get().uploadJournalImage(
        userId,
        journalData.imageUri
      )
      journalData.imageUrl = imageUrl // Replace the local URI with the remote URL
    }
    delete journalData.imageUri // Remove the local URI from the data
    journalData.date = Timestamp.fromDate(journalData.date)
    // Update the Firestore path to save to the user-specific subcollection
    const newJournalRef = await addDoc(
      collection(db, `journals/${userId}/myjournals`),
      journalData
    )
    get().fetchJournals(userId) // Refresh the journals after adding
    return newJournalRef
  },

  deleteJournal: async (userId, journalId) => {
    await deleteDoc(doc(db, `journals/${userId}/myjournals`, journalId))
    get().fetchJournals(userId) // Refresh the journals after deleting
  },

  editJournal: async (userId, journalId, journalData) => {
    if (journalData.imageUri) {
      const imageUrl = await get().uploadJournalImage(
        userId,
        journalData.imageUri
      )
      journalData.imageUrl = imageUrl
    }
    delete journalData.imageUri
    journalData.date = Timestamp.fromDate(journalData.date)

    const journalRef = doc(db, `journals/${userId}/myjournals`, journalId)
    await updateDoc(journalRef, journalData)
    get().fetchJournals(userId) // Refresh the journals after editing
  },

  fetchSingleJournal: async (userId, journalId) => {
    const journalRef = doc(db, `journals/${userId}/myjournals`, journalId)
    const docSnap = await getDoc(journalRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      console.log('No such document!')
      return null
    }
  },
}))

export default useJournalStore
