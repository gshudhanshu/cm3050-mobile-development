import React from 'react'
import { render } from '@testing-library/react-native'
import DayComponent from './DayComponent'
import 'react-native-gifted-charts'

jest.mock('react-native-gifted-charts', () => ({
  PieChart: () => 'PieChart',
  BarChart: () => 'BarChart',
}))

// Mock the external hooks and modules
jest.mock('../../store/useAuthStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    profile: {
      dailyGoal: 120,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    },
    user: { uid: 'test-uid' },
  })),
}))

jest.mock('../../store/useSessionStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    percentageDifferences: { todayCompletedGoalPercentage: 50 },
    progress: true,
    todayProgressData: [
      {
        sessionDetails: {
          thumbnailUrl: 'https://example.com/thumbnail.jpg',
          level: 'Beginner',
          title: 'Morning Yoga',
          type: 'Yoga',
          duration: 30,
        },
      },
    ],
  })),
}))

jest.mock('@react-navigation/native', () => ({
  useIsFocused: jest.fn(() => true),
}))

describe('DayComponent', () => {
  it('is mounted and displays the correct content', () => {
    const { getByText, getByPlaceholderText } = render(<DayComponent />)
    expect(getByText("Today's Sessions")).toBeTruthy()
    expect(getByText('Morning Yoga')).toBeTruthy()
    expect(getByText('30 sec')).toBeTruthy()
    expect(getByText('My daily goal')).toBeTruthy()
  })
})
