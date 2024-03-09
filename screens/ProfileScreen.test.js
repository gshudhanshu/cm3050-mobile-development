import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import ProfileScreen from './ProfileScreen'
import * as ImagePicker from 'expo-image-picker'
import { useNavigation } from '@react-navigation/native'
import useAuthStore from '../store/useAuthStore'

// Mock dependencies
jest.mock('expo-image-picker')
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}))
jest.mock('../store/useAuthStore', () => ({
  __esModule: true,
  default: () => ({
    user: { uid: 'test-uid' },
    profile: { profilePicture: 'https://example.com/profile.jpg' },
    setUserProfile: jest.fn(),
    getUserProfile: jest.fn(() =>
      Promise.resolve({
        firstName: 'John',
        lastName: 'Doe',
        dob: '01/01/2000',
        gender: 'male',
        profilePicture: 'https://example.com/profile.jpg',
      })
    ),
    saveUserProfile: jest.fn(),
    uploadProfilePicture: jest.fn(() =>
      Promise.resolve('https://example.com/new-profile.jpg')
    ),
  }),
}))

jest.mock('../firebase/firebase', () => ({
  auth: {
    currentUser: {
      uid: 'test-uid',
    },
  },
}))

describe('ProfileScreen', () => {
  const mockNavigation = { navigate: jest.fn() }
  useNavigation.mockReturnValue(mockNavigation)

  // beforeEach(() => {
  //   jest.clearAllMocks()
  // })

  it('loads user profile on mount', async () => {
    render(<ProfileScreen />)
    await waitFor(() =>
      expect(useAuthStore().getUserProfile).toHaveBeenCalledWith('test-uid')
    )
  })

  it('updates profile picture on image pick', async () => {
    const mockImageUri = 'https://example.com/new-profile.jpg'
    ImagePicker.launchImageLibraryAsync.mockResolvedValue({
      cancelled: false,
      assets: [{ uri: mockImageUri }],
    })

    render(<ProfileScreen />)
    const pickImageButton = getByTestId('pick-image-button')
    fireEvent.press(pickImageButton)
    await waitFor(() =>
      expect(useAuthStore().uploadProfilePicture).toHaveBeenCalledWith(
        'test-uid',
        mockImageUri
      )
    )
  })

  it('handles date picker change', () => {
    const { getByTestId } = render(<ProfileScreen />)
    expect(getByTestId('date-picker')).toBeTruthy()
  })

  it('displays gender picker and handles selection', () => {
    const { getByTestId } = render(<ProfileScreen />)
    expect(getByTestId('gender-picker')).toBeTruthy()
  })
})
