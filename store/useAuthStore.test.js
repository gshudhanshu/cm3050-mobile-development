import useAuthStore from './useAuthStore' // Update this path

const dummyUserProfile = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  profilePicture: 'mocked-url',
  dailyGoal: 3000,
  dob: '04/02/2024',
  firstName: 'John',
  lastName: 'Doe',
}

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: true,
      user: { uid: 'testUid', email: 'johndoe@example.com' },
      profile: dummyUserProfile,
    })
  })

  it('should upload profile picture and update profile', async () => {
    const userId = 'testUid'
    const uri = 'https://placehold.co/600x400.png'
    let store = useAuthStore.getState()

    const url = await store.uploadProfilePicture(userId, uri)
    store = useAuthStore.getState()
    expect(url).toEqual('mocked-url')
    // expect(store.profile).toEqual({ profilePicture: 'mocked-url' })
  })

  it('should save user profile data to Firestore and update profile', async () => {
    const userId = 'testUid'
    const profileData = { name: 'John Doe' }
    let store = useAuthStore.getState()
    await store.saveUserProfile(userId, profileData)
    store = useAuthStore.getState()
    expect(store.profile).toEqual(profileData)
  })

  it('should fetch user profile data', async () => {
    const userId = 'testUid'
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
