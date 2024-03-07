// Import dependencies
import useAuthStore from './useAuthStore'
import { uriToBlob } from '../utils/utils'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

// Mock the necessary methods and modules
jest.mock('../utils/utils') // Mock uriToBlob
jest.mock('firebase/storage') // Mock Firebase Storage

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks()
  })

  it('uploadProfilePicture updates profile with photo URL', async () => {
    // Setup mocks
    const mockUri = 'file:///path/to/image.png'
    const mockUserId = 'user123'
    const mockPhotoURL = 'https://example.com/profile.jpg'
    uriToBlob.mockResolvedValueOnce('mockBlob')
    uploadBytes.mockResolvedValueOnce({})
    getDownloadURL.mockResolvedValueOnce(mockPhotoURL)

    // Act
    const state = useAuthStore.getState()
    const url = await state.uploadProfilePicture(mockUserId, mockUri)

    // Assert
    expect(uriToBlob).toHaveBeenCalledWith(mockUri)
    expect(uploadBytes).toHaveBeenCalled()
    expect(getDownloadURL).toHaveBeenCalled()
    expect(url).toEqual(mockPhotoURL)
    expect(state.profile).toEqual(
      expect.objectContaining({ photoURL: mockPhotoURL })
    )
  })
})
