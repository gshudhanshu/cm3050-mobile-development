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
  lastNmae: 'Doe',
}

const mockFirestore = jest.fn(() => ({
  collection: jest.fn(() => ({
    doc: jest.fn(() => ({
      get: jest.fn(() =>
        Promise.resolve({
          exists: true,
          data: () => dummyUserProfile,
        })
      ),
      set: jest.fn(() => Promise.resolve()),
      update: jest.fn(() => Promise.resolve()),
    })),
    add: jest.fn(() => Promise.resolve({ id: 'newDocId' })),
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
    getDownloadURL: jest.fn(() =>
      Promise.resolve('https://placehold.co/600x400.png')
    ),
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
  doc: jest.fn((db, collectionName, docId) => ({
    set: jest.fn(() => Promise.resolve()),
    get: jest.fn(() =>
      Promise.resolve({
        exists: true,
        data: () => dummyUserProfile,
      })
    ),
    update: jest.fn(() => Promise.resolve()),
  })),
  getDoc: jest.fn(() =>
    Promise.resolve({
      exists: () => true,
      data: () => dummyUserProfile,
    })
  ),
  setDoc: jest.fn(() => Promise.resolve()),
  collection: mockFirestore,
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
