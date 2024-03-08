// Mock implementation for @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

const dummyUserProfile = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  profilePicture: 'mocked-url',
  dailyGoal: 3000,
  dob: '04/02/2024',
  firstName: 'John',
  lastName: 'Doe',
}

const dummyJournal = {
  title: 'My Journal',
  description: 'This is a journal entry',
  date: new Date(),
  imageUrl: 'mocked-url',
}

const dummySession = {
  artist: 'John Doe',
  audioUrl: 'mocked-url',
  category: 'Music',
  curated: true,
  description: 'This is a session',
  duration: 300,
  instructions: [
    { text: 'Instruction 1', time: 30 },
    { text: 'Instruction 2', time: 60 },
    { text: 'Instruction 3', time: 90 },
  ],
  level: 'Beginner',
  numberOfPlays: 100,
  title: 'My Session',
  type: 'Guided',
}

const mockData = {
  users: {
    testUid: dummyUserProfile,
  },
  journals: {
    newJournalId: dummyJournal,
  },
  sessions: {
    newSessionId: dummySession,
  },
}

// A helper function to deeply merge two objects
const mergeDeep = (target, source) => {
  if (typeof target === 'object' && typeof source === 'object') {
    for (const key in source) {
      if (source[key] instanceof Object) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }
  return target
}

const findOrCreateMockData = (collection, docId) => {
  if (!mockData[collection][docId]) {
    mockData[collection][docId] = {}
  }
  return mockData[collection][docId]
}

const mockFirestore = jest.fn(() => ({
  collection: jest.fn((collectionName) => ({
    doc: jest.fn((docId) => ({
      get: jest.fn(() =>
        Promise.resolve({
          exists: !!mockData[collectionName][docId],
          data: () => mockData[collectionName][docId],
        })
      ),
      set: jest.fn((data, { merge } = {}) => {
        const currentData = findOrCreateMockData(collectionName, docId)
        if (merge) {
          mergeDeep(currentData, data)
        } else {
          mockData[collectionName][docId] = data
        }
        return Promise.resolve()
      }),
      update: jest.fn((data) => {
        const currentData = findOrCreateMockData(collectionName, docId)
        if (currentData) {
          Object.assign(currentData, data)
          return Promise.resolve()
        } else {
          return Promise.reject(new Error('Document does not exist'))
        }
      }),
    })),
    add: jest.fn((data) => {
      const newId = `new${
        collectionName.charAt(0).toUpperCase() + collectionName.slice(1)
      }Id` // Generates a new ID
      mockData[collectionName][newId] = data
      return Promise.resolve({ id: newId })
    }),
  })),
}))

const mockAuth = jest.fn(() => ({
  currentUser: {
    uid: 'testUid',
    email: 'user@example.com',
  },
  signInWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({
      user: {
        uid: 'testUid',
        email: 'user@example.com',
      },
    })
  ),
  createUserWithEmailAndPassword: jest.fn(() =>
    Promise.resolve({
      user: {
        uid: 'testUid',
        email: 'user@example.com',
      },
    })
  ),
  signOut: jest.fn(() => Promise.resolve()),
  onAuthStateChanged: jest.fn((callback) =>
    callback({
      uid: 'testUid',
      email: 'user@example.com',
    })
  ),
}))

const mockStorage = jest.fn(() => ({
  ref: jest.fn(() => ({
    put: jest.fn(() =>
      Promise.resolve({
        metadata: {
          name: 'uploaded-file.jpg',
          fullPath: 'profilePictures/uploaded-file.jpg',
        },
      })
    ),
    getDownloadURL: jest.fn(() => Promise.resolve('mocked-url')),
  })),
}))

// Mocking the Firebase module
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  getApp: jest.fn(),
}))

jest.mock('firebase/auth', () => ({
  getAuth: mockAuth,
  initializeAuth: jest.fn(() => mockAuth()),
  getReactNativePersistence: jest.fn(),
}))

jest.mock('firebase/firestore', () => ({
  getFirestore: mockFirestore,
  doc: jest.fn((db, collectionName, docId) => {
    const docRef = db.collection(collectionName).doc(docId)
    return {
      set: docRef.set,
      get: docRef.get,
      update: docRef.update,
    }
  }),
  getDoc: jest.fn(async (docRef) => {
    const docSnapshot = await docRef.get()
    return {
      exists: () => docSnapshot.exists,
      data: docSnapshot.data,
    }
  }),
  setDoc: jest.fn((docRef, data, { merge } = {}) =>
    docRef.set(data, { merge })
  ),
  collection: jest.fn((db, collectionName) => db.collection(collectionName)),
  addDoc: jest.fn((collectionRef, data) => collectionRef.add(data)),
}))

jest.mock('firebase/storage', () => ({
  getStorage: mockStorage,
  ref: jest.fn(),
  uploadBytes: jest.fn(() =>
    Promise.resolve({
      metadata: { name: 'mocked-file' },
    })
  ),
  getDownloadURL: jest.fn(() => Promise.resolve('mocked-url')),
}))

// Exporting mocked Firebase services for use in tests
module.exports = {
  db: mockFirestore(),
  auth: mockAuth(),
  storage: mockStorage(),
}
