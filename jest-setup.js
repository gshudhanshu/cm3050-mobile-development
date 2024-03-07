// Mock implementation for @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

// Mock implementations for Firebase services
const mockFirestore = jest.fn(() => ({
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      get: jest.fn(() => Promise.resolve({ data: () => ({}) })),
      set: jest.fn(() => Promise.resolve()),
      update: jest.fn(() => Promise.resolve()),
    })),
    add: jest.fn(() => Promise.resolve()),
  })),
}))

const mockAuth = jest.fn(() => ({
  currentUser: {
    uid: 'testUid',
  },
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve(true)),
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve(true)),
  signOut: jest.fn(() => Promise.resolve(true)),
  onAuthStateChanged: jest.fn(),
}))

const mockStorage = jest.fn(() => ({
  ref: jest.fn(() => ({
    put: jest.fn(() => Promise.resolve(true)),
    getDownloadURL: jest.fn(() => Promise.resolve('test-url')),
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
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(() => Promise.resolve({ data: () => ({}) })),
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      set: jest.fn(() => Promise.resolve()),
      get: jest.fn(() => Promise.resolve({ data: () => ({}) })),
    })),
    add: jest.fn(() => Promise.resolve()),
  })),
}))

jest.mock('firebase/storage', () => ({
  getStorage: mockStorage,
  ref: jest.fn(),
  uploadBytes: jest.fn(() =>
    Promise.resolve({
      metadata: { name: 'test-file' },
    })
  ),
  getDownloadURL: jest.fn(() => Promise.resolve('test-url')),
}))

// Exporting mocked Firebase services for use in tests
module.exports = {
  db: mockFirestore(),
  auth: mockAuth(),
  storage: mockStorage(),
}
