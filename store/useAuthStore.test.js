import useAuthStore from './useAuthStore' // Update this path

const dummyUserProfile = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  profilePicture: 'mocked-url',
  dailyGoal: 3000,
  dob: '04/02/2024',
  firstName: 'John',
  lastNmae: 'Doe',
}

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: { uid: 'user123', email: 'johndoe@example.com' },
      profile: null,
    })
  })

  it('should upload profile picture and update profile', async () => {
    const userId = 'user123'
    const uri = 'https://placehold.co/600x400.png'
    let store = useAuthStore.getState()

    const url = await store.uploadProfilePicture(userId, uri)
    store = useAuthStore.getState()
    expect(url).toEqual('mocked-url')
    expect(store.profile).toEqual({ photoURL: 'mocked-url' })
  })

  it('should save user profile data to Firestore and update profile', async () => {
    const userId = 'user123'
    const profileData = { name: 'John Doe' }
    let store = useAuthStore.getState()
    await store.saveUserProfile(userId, profileData)
    store = useAuthStore.getState()
    expect(store.profile).toEqual(profileData)
  })

  it('should fetch user profile data', async () => {
    const userId = 'user123'
    let store = useAuthStore.getState()

    const profileData = await store.getUserProfile(userId)
    store = useAuthStore.getState()
    expect(profileData).toEqual(dummyUserProfile)
    expect(store.profile).toEqual(dummyUserProfile)
  })

  it("should set a daily goal in the user's profile", async () => {
    const goalValue = 3000

    let store = useAuthStore.getState()
    await store.setDailyGoal(goalValue)
    store = useAuthStore.getState()
    expect(store.profile.dailyGoal).toEqual(goalValue)
  })
})
