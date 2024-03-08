import useJournalStore from './useJournalStore'

jest.mock('firebase/firestore', () => {
  const dummyJournals = [
    {
      id: '1',
      title: 'Journal 1',
      description: 'This is a journal entry 1',
      date: new Date(),
      imageUrl: 'https://example.com/journal1.jpg',
    },
    {
      id: '2',
      title: 'Journal 2',
      description: 'This is a journal entry 2',
      date: new Date(),
      imageUrl: 'https://example.com/journal2.jpg',
    },
  ]

  return {
    __esModule: true, // This is required for ES module mocks
    collection: jest.fn().mockImplementation((db, path) => path),
    addDoc: jest.fn().mockImplementation((collectionPath, journalData) => {
      const newJournalId = `journal-${Math.random()}`
      const newJournal = { id: newJournalId, ...journalData }
      dummyJournals.push(newJournal)
      return Promise.resolve({ id: newJournalId })
    }),
    getDocs: jest.fn().mockImplementation((collectionPath) => {
      const docs = dummyJournals.map((journal) => ({
        id: journal.id,
        data: () => journal,
      }))
      return Promise.resolve({ docs })
    }),
    doc: jest.fn().mockImplementation((db, path, docId) => ({ path, docId })),
    deleteDoc: jest.fn().mockImplementation((docRef) => {
      const index = dummyJournals.findIndex(
        (journal) => journal.id === docRef.docId
      )
      if (index > -1) {
        dummyJournals.splice(index, 1)
      }
      return Promise.resolve()
    }),
    updateDoc: jest.fn().mockImplementation((docRef, journalData) => {
      const index = dummyJournals.findIndex(
        (journal) => journal.id === docRef.docId
      )
      if (index > -1) {
        dummyJournals[index] = { ...dummyJournals[index], ...journalData }
      }
      return Promise.resolve()
    }),
    getDoc: jest.fn().mockImplementation((docRef) => {
      const journal = dummyJournals.find(
        (journal) => journal.id === docRef.docId
      )
      return Promise.resolve({
        exists: () => !!journal,
        data: () => journal,
        id: docRef.docId,
      })
    }),
    Timestamp: {
      fromDate: jest.fn((date) => ({ toDate: () => date })),
    },
  }
})
jest.mock('firebase/storage', () => {
  return {
    __esModule: true, // This is required for ES module mocks
    ref: jest.fn().mockImplementation(() => ({ path: 'path/to/image' })),
    uploadBytes: jest.fn().mockImplementation(() => Promise.resolve({})),
    getDownloadURL: jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve('https://example.com/uploaded-image.jpg')
      ),
  }
})

// describe('useJournalStore', () => {
//   beforeEach(() => {
//     // Reset the store to its initial state before each test to avoid state leakage between tests
//     act(() => useJournalStore.setState({ journals: [] }, true))
//   })

//   it('should upload a journal image and return the URL', async () => {
//     const userId = 'user1'
//     const imageUri = 'path/to/local/image.jpg'
//     const imageUrl = await useJournalStore
//       .getState()
//       .uploadJournalImage(userId, imageUri)

//     expect(imageUrl).toEqual('https://example.com/uploaded-image.jpg')
//   })

//   it('should fetch journals for a user', async () => {
//     const userId = 'user1'
//     await act(() => useJournalStore.getState().fetchJournals(userId))

//     const journals = useJournalStore.getState().journals
//     expect(journals.length).toBeGreaterThan(0)
//     expect(journals[0].id).toBeDefined()
//     expect(journals[0].title).toBeDefined()
//   })

//   it('should add a new journal entry', async () => {
//     const userId = 'user1'
//     const newJournal = {
//       title: 'New Journal Entry',
//       description: 'Description of the new entry',
//       date: new Date(),
//       imageUri: 'path/to/new/image.jpg',
//     }

//     await act(() => useJournalStore.getState().addJournal(userId, newJournal))

//     const journals = useJournalStore.getState().journals
//     expect(journals.length).toBeGreaterThan(0)
//     expect(
//       journals.some((journal) => journal.title === newJournal.title)
//     ).toBeTruthy()
//   })

//   it('should delete a journal entry', async () => {
//     const userId = 'user1'
//     const journalIdToDelete = '1' // Assuming this ID exists from your dummy data

//     await act(() =>
//       useJournalStore.getState().deleteJournal(userId, journalIdToDelete)
//     )

//     const journals = useJournalStore.getState().journals
//     expect(
//       journals.some((journal) => journal.id === journalIdToDelete)
//     ).toBeFalsy()
//   })

//   it('should edit a journal entry', async () => {
//     const userId = 'user1'
//     const journalIdToEdit = '2' // Assuming this ID exists from your dummy data
//     const updatedJournalData = {
//       title: 'Updated Journal Title',
//       description: 'Updated description',
//       // No need to update date or imageUrl for this test
//     }

//     await act(() =>
//       useJournalStore
//         .getState()
//         .editJournal(userId, journalIdToEdit, updatedJournalData)
//     )

//     const journals = useJournalStore.getState().journals
//     const updatedJournal = journals.find(
//       (journal) => journal.id === journalIdToEdit
//     )
//     expect(updatedJournal).toBeDefined()
//     expect(updatedJournal.title).toEqual(updatedJournalData.title)
//     expect(updatedJournal.description).toEqual(updatedJournalData.description)
//   })

//   it('should fetch a single journal entry', async () => {
//     const userId = 'user1'
//     const journalId = '1' // Assuming this ID exists

//     const journal = await useJournalStore
//       .getState()
//       .fetchSingleJournal(userId, journalId)

//     expect(journal).toBeDefined()
//     expect(journal.id).toEqual(journalId)
//     expect(journal.title).toBeDefined()
//   })
// })
