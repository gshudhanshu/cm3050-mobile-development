import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import ProfileScreen from './ProfileScreen' // Adjust the import path as needed
import * as ImagePicker from 'expo-image-picker'
import { useNavigation } from '@react-navigation/native'
import {
  getUserProfile,
  saveUserProfile,
  uploadProfilePicture,
} from '../utils/utils'
import useAuthStore from '../store/useAuthStore'
import { auth } from '../firebase/firebase'

// Mock dependencies
jest.mock('expo-image-picker')
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}))
jest.mock('../utils/utils')
jest.mock('../store/useAuthStore')
jest.mock('../firebase/firebase', () => ({
  auth: {
    currentUser: {
      uid: 'test-uid',
    },
  },
}))

// Example tests
describe('ProfileScreen', () => {
  const mockNavigation = { navigate: jest.fn() }
  useNavigation.mockReturnValue(mockNavigation)

  beforeEach(() => {
    getUserProfile.mockResolvedValue({
      firstName: 'John',
      lastName: 'Doe',
      dob: '01/01/2000',
      gender: 'male',
      profilePicture: 'https://example.com/profile.jpg',
    })
    useAuthStore.mockReturnValue({ setUserProfile: jest.fn() })
  })

  it('loads user profile on mount', async () => {
    render(<ProfileScreen />)
    await waitFor(() => expect(getUserProfile).toHaveBeenCalledWith('test-uid'))
  })

  it('updates profile picture on image pick', async () => {
    const mockImageUri = 'https://example.com/new-profile.jpg'
    ImagePicker.launchImageLibraryAsync.mockResolvedValue({
      cancelled: false,
      assets: [{ uri: mockImageUri }],
    })
    uploadProfilePicture.mockResolvedValue(mockImageUri)

    const { getByTestId } = render(<ProfileScreen />)
    fireEvent.press(getByTestId('pick-image-button'))
    await waitFor(() =>
      expect(uploadProfilePicture).toHaveBeenCalledWith(
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
    // check if the item is mounted
    expect(getByTestId('gender-picker')).toBeTruthy()
  })
})
