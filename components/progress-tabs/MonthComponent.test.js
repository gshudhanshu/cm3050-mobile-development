import React from 'react'
import { render } from '@testing-library/react-native'
import MonthComponent from './MonthComponent' // Adjust the import path as needed
import 'react-native-gifted-charts' // Import the module to mock

jest.mock('react-native-gifted-charts', () => ({
  PieChart: () => 'PieChart',
  BarChart: () => 'BarChart',
}))

jest.mock('../../store/useSessionStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    progress: [
      // Mock some session data
    ],
    percentageDifferences: {
      last30Days: 20, // Example value
    },
  })),
}))

jest.mock('../../store/useWellnessStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    averageMoodLast30Days: 3.5, // Example value
  })),
}))

describe('MonthComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MonthComponent />)
    expect(getByText('Monthly progress')).toBeTruthy()
    expect(
      getByText('On average, you completed 20% more sessions this month')
    ).toBeTruthy()
    expect(getByText('Monthly mood')).toBeTruthy()
    expect(getByText('On average, your mood was 3.5')).toBeTruthy()
  })
})
