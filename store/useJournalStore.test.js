import useJournalStore from './useJournalStore'

const uriToBlobMock = jest.fn()

// Dummy data for journals
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

// Firestore mocks
jest.mock('firebase/firestore', () => ({
  collection: jest.fn((db, path) => path),
  addDoc: jest.fn((collectionPath, journalData) => {
    const newJournalId = `journal-${Math.random()}`
    const newJournal = { id: newJournalId, ...journalData }
    dummyJournals.push(newJournal)
    return Promise.resolve({ id: newJournalId })
  }),
  getDocs: jest.fn((collectionPath) => {
    const docs = dummyJournals.map((journal) => ({
      id: journal.id,
      data: () => journal,
    }))
    return Promise.resolve({ docs })
  }),
  doc: jest.fn((db, path, docId) => ({ path, docId })),
  deleteDoc: jest.fn((docRef) => {
    const journalIndex = dummyJournals.findIndex(
      (journal) => journal.id === docRef.docId
    )
    if (journalIndex > -1) dummyJournals.splice(journalIndex, 1)
    return Promise.resolve()
  }),
  updateDoc: jest.fn((docRef, journalData) => {
    const journalIndex = dummyJournals.findIndex(
      (journal) => journal.id === docRef.docId
    )
    if (journalIndex > -1) {
      dummyJournals[journalIndex] = {
        ...dummyJournals[journalIndex],
        ...journalData,
      }
    }
    return Promise.resolve()
  }),
  getDoc: jest.fn((docRef) => {
    const journal = dummyJournals.find((journal) => journal.id === docRef.docId)
    return Promise.resolve({
      exists: () => !!journal,
      data: () => journal,
      id: docRef.docId,
    })
  }),
  Timestamp: {
    fromDate: (date) => ({ toDate: () => date }),
  },
}))

// Firebase Storage mocks
jest.mock('firebase/storage', () => ({
  ref: jest.fn(() => ({ path: 'path/to/image' })),
  uploadBytes: jest.fn(() => Promise.resolve({})),
  getDownloadURL: jest.fn(() =>
    Promise.resolve('https://example.com/uploaded-image.jpg')
  ),
}))

// Mocking uriToBlob
jest.mock('../utils/utils', () => ({
  uriToBlob: uriToBlobMock.mockResolvedValue(new Blob()),
}))

describe('useJournalStore', () => {
  beforeEach(() => {
    // Reset mock implementations before each test
    jest.clearAllMocks()
  })

  it('adds a new journal entry to Firestore and updates local state', async () => {
    // Mock Firebase functions used in addJournal
    // For example:
    // firestore.addDoc.mockResolvedValue({ id: 'newJournalId' });
    // firestore.getDocs.mockResolvedValue({ /* mock querySnapshot */ });

    const userId = 'testUser'
    const journalData = {
      title: 'Test Journal',
      date: new Date(),
      imageUri: 'path/to/image',
    }

    // Act
    const newJournalRef = await useJournalStore
      .getState()
      .addJournal(userId, journalData)

    // Assert
    expect(newJournalRef).not.toBeNull()
    // More assertions to verify Firestore interactions and local state updates
  })

  // Additional tests for fetchJournals, uploadJournalImage, deleteJournal, editJournal, fetchSingleJournal
})
