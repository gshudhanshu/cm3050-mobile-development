import useAuthStore from './useAuthStore' // Update this path
import { db, storage } from '../firebase/firebase'
import { uriToBlob } from '../utils/utils'

describe('useAuthStore', () => {
  it('should upload profile picture and update profile', async () => {
    const userId = 'user123'
    const uri = 'https://placehold.co/600x400.png'
    const store = useAuthStore.getState()

    const url = await store.uploadProfilePicture(userId, uri)

    expect(url).toBe('test-url')
    expect(store.profile).toEqual({ photoURL: 'mocked-url' })
    expect(uriToBlob).toHaveBeenCalledWith(uri)
  })

  it('should save user profile data to Firestore and update profile', async () => {
    const userId = 'user123'
    const profileData = { name: 'John Doe' }
    const store = useAuthStore.getState()

    await store.saveUserProfile(userId, profileData)

    expect(store.profile).toEqual(profileData)
    // Add more assertions as needed to verify Firestore interactions
  })

  it('should fetch user profile data', async () => {
    const userId = 'user123'
    const store = useAuthStore.getState()

    const profileData = await store.getUserProfile(userId)

    expect(profileData).toEqual({})
    expect(store.profile).toEqual({})
    // Add more assertions as needed to verify Firestore interactions
  })

  it("should set a daily goal in the user's profile", async () => {
    const goalValue = '10,000 steps'
    const store = useAuthStore.createState({
      user: { uid: 'user123' },
      profile: {},
    })

    await store.setDailyGoal(goalValue)

    expect(store.profile.dailyGoal).toEqual(goalValue)
    // Add more assertions as needed to verify Firestore interactions
  })
})
