import React from 'react'
import { render } from '@testing-library/react-native'
import MonthComponent from './MonthComponent'
import 'react-native-gifted-charts'

// Mock the external hooks and modules
jest.mock('react-native-gifted-charts', () => ({
  PieChart: () => 'PieChart',
  BarChart: () => 'BarChart',
}))

jest.mock('../../store/useSessionStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    progress: [],
    percentageDifferences: {
      last30Days: 20,
    },
  })),
}))

jest.mock('../../store/useWellnessStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    averageMoodLast30Days: 3.5,
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
    expect(
      getByText('On average, your mood was 3.50 with scale 1-6')
    ).toBeTruthy()
  })
})
