import React from 'react'
import { render } from '@testing-library/react-native'
import ProgressScreen from './ProgressScreen' // Adjust the import path as necessary
import useAuthStore from '../store/useAuthStore'
import useSessionStore from '../store/useSessionStore'
import useWellnessStore from '../store/useWellnessStore'

// Mock external hooks and navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useIsFocused: () => true,
}))
jest.mock('../store/useAuthStore')
jest.mock('../store/useSessionStore')
jest.mock('../store/useWellnessStore')

describe('ProgressScreen Tests', () => {
  beforeEach(() => {
    // Mock user and profile information
    useAuthStore.mockImplementation(() => ({
      user: { uid: '123' },
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        profilePicture: 'https://example.com/profile.jpg',
        longestStreak: 5,
        totalSessions: 30,
        totalSessionDuration: 1200, // e.g., in minutes
      },
    }))

    // Mock fetching functions
    useSessionStore.mockImplementation(() => ({
      fetchProgressLast65DaysAndCalculateAverages: jest.fn(),
    }))
    useWellnessStore.mockImplementation(() => ({
      fetchMoodAverages: jest.fn(),
    }))
  })

  it('should render the ProgressScreen component correctly', () => {
    const { getByText, getByTestId } = render(<ProgressScreen />)

    expect(getByText('Progress')).toBeTruthy()
    // Validate that static text, like profile name and email, are rendered
    expect(getByText('John Doe')).toBeTruthy()
    expect(getByText('john.doe@example.com')).toBeTruthy()
  })
})
