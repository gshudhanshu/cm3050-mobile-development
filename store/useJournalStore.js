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

  // upload a journal image to Firebase Storage
  uploadJournalImage: async (userId, imageUri) => {
    const blob = await uriToBlob(imageUri)
    const imageName = `journal-${Date.now()}`
    // Update the storage path to be user-specific
    const storageRef = ref(storage, `journalImages/${userId}/${imageName}`)
    await uploadBytes(storageRef, blob)
    const imageUrl = await getDownloadURL(storageRef)
    return imageUrl
  },

  // fetch journals from Firestore
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

  // add a journal to Firestore
  addJournal: async (userId, journalData) => {
    // If the journal has an image, upload it to Firebase Storage
    if (journalData.imageUri) {
      const imageUrl = await get().uploadJournalImage(
        userId,
        journalData.imageUri
      )
      journalData.imageUrl = imageUrl
    }

    // Remove the local URI from the data
    delete journalData.imageUri
    journalData.date = Timestamp.fromDate(journalData.date)

    // Update the Firestore path to save to the user-specific subcollection
    const newJournalRef = await addDoc(
      collection(db, `journals/${userId}/myjournals`),
      journalData
    )

    // Refresh the journals after adding
    get().fetchJournals(userId)
    return newJournalRef
  },

  // delete a journal
  deleteJournal: async (userId, journalId) => {
    await deleteDoc(doc(db, `journals/${userId}/myjournals`, journalId))
    // Refresh the journals after deleting
    get().fetchJournals(userId)
  },

  // edit a journal
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

    // Refresh the journals after editing
    get().fetchJournals(userId)
  },

  // Fetch a single journal
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
