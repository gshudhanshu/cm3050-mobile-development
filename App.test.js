import renderer from 'react-test-renderer'
import App from './App'
import React from 'react'
import { render } from '@testing-library/react-native'

import 'react-native-gifted-charts'
import SplashScreen, {
  preventAutoHideAsync,
  hideAsync,
} from 'expo-splash-screen'

// Mock dependencies for App component
jest.mock('@expo-google-fonts/poppins', () => ({
  useFonts: jest.fn().mockReturnValue([true, null]),
}))

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}))

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  NavigationContainer: ({ children }) => <>{children}</>,
}))

jest.mock('@react-navigation/stack', () => {
  const MockNavigator = ({ children }) => <div>{children}</div>
  const MockScreen = () => <div />

  return {
    createStackNavigator: jest.fn(() => ({
      Navigator: MockNavigator,
      Screen: MockScreen,
    })),
  }
})

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: jest.fn(),
}))

jest.mock('./store/useAuthStore', () => ({
  __esModule: true,
  default: () => ({
    isAuthenticated: false,
    user: null,
  }),
}))

jest.mock('react-native-gifted-charts', () => {
  return {
    PieChart: jest.fn(),
    BarChart: jest.fn(),
  }
})

describe('App', () => {
  beforeAll(() => {
    preventAutoHideAsync.mockClear()
    hideAsync.mockClear()
  })
  it('renders correctly', () => {
    renderer.create(<App />)
  })

  it('handles SplashScreen correctly', () => {
    expect(preventAutoHideAsync).toHaveBeenCalled()
    expect(hideAsync).toHaveBeenCalled()
  })
})
