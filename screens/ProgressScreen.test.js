// ProgressScreen.test.js
import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import ProgressScreen from './ProgressScreen'
import * as useAuthStoreModule from '../store/useAuthStore'
import * as useSessionStoreModule from '../store/useSessionStore'
import * as useWellnessStoreModule from '../store/useWellnessStore'
import { useIsFocused } from '@react-navigation/native'

// Mock the external hooks and modules
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useIsFocused: jest.fn(),
}))

jest.mock('react-native-tab-view', () => ({
  SceneMap: jest.fn(),
  TabBar: jest.fn(),
  TabView: jest.fn(),
}))

jest.mock('../store/useAuthStore')
jest.mock('../store/useSessionStore')
jest.mock('../store/useWellnessStore')
jest.mock('../components/common/Loading', () => 'Loading')
jest.mock('../components/progress-tabs/DayComponent', () => 'DayComponent')
jest.mock('../components/progress-tabs/WeekComponent', () => 'WeekComponent')
jest.mock('../components/progress-tabs/MonthComponent', () => 'MonthComponent')

describe('ProgressScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useIsFocused.mockReturnValue(true)
    useAuthStoreModule.default.mockReturnValue({
      user: { uid: 'test-uid' },
      profile: {
        profilePicture: 'https://example.com/profile.jpg',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        longestStreak: 5,
        totalSessions: 20,
        totalSessionDuration: 1200,
      },
    })
    useSessionStoreModule.default.mockReturnValue({
      fetchProgressLast65DaysAndCalculateAverages: jest.fn(),
    })
    useWellnessStoreModule.default.mockReturnValue({
      fetchMoodAverages: jest.fn(),
    })
  })

  it('renders loading state when profile is null', () => {
    useAuthStoreModule.default.mockReturnValueOnce({
      user: { uid: 'test-uid' },
      profile: null,
    })

    const { getByTestId } = render(<ProgressScreen />)
    expect(getByTestId('loading-view')).toBeTruthy()
  })

  it('renders profile details and initializes data fetching', () => {
    const { getByText } = render(<ProgressScreen />)
    expect(getByText('John Doe')).toBeTruthy()
    expect(
      useSessionStoreModule.default()
        .fetchProgressLast65DaysAndCalculateAverages
    ).toHaveBeenCalledWith('test-uid', undefined)
    expect(
      useWellnessStoreModule.default().fetchMoodAverages
    ).toHaveBeenCalledWith('test-uid')
  })
})
