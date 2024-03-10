import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import HomeScreen from './HomeScreen'
import { NavigationContainer } from '@react-navigation/native'
import useWellnessStore from '../store/useWellnessStore'

// Mock the external hooks and navigation
jest.mock('../store/useWellnessStore')
jest.mock('../store/useAuthStore')
jest.mock('../store/useSessionStore')
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  }
})

// Utility function for wrapping the component with all necessary providers
const renderHomeScreen = () =>
  render(
    <NavigationContainer>
      <HomeScreen />
    </NavigationContainer>
  )

describe('HomeScreen', () => {
  // Set up mocks for each test case
  beforeEach(() => {
    const useAuthStore = require('../store/useAuthStore').default
    const useWellnessStore = require('../store/useWellnessStore').default
    const useSessionStore = require('../store/useSessionStore').default

    useAuthStore.mockImplementation(() => ({
      user: { uid: '123', name: 'Ruby' },
    }))

    useWellnessStore.mockImplementation(() => ({
      dailyQuote: { quote: 'Life is beautiful', author: 'Anonymous' },
      fetchQuote: jest.fn(),
      setUserMood: jest.fn(),
      fetchUserMood: jest.fn(),
      userMood: 1,
    }))

    useSessionStore.mockImplementation(() => ({
      fetchPopularSessions: jest.fn(),
      fetchCuratedSessions: jest.fn(),
      popularSessions: [
        {
          id: '1',
          title: 'Session 1',
          thumbnailUrl: '',
          level: 'Easy',
          type: 'Yoga',
          duration: 30,
        },
      ],
      curatedSessions: [
        {
          id: '2',
          title: 'Session 2',
          thumbnailUrl: '',
          level: 'Medium',
          type: 'Meditation',
          duration: 45,
        },
      ],
    }))
  })

  it('renders welcome message and daily quote', () => {
    const { getByText } = renderHomeScreen()
    expect(getByText(' Welcome back, User')).toBeTruthy()
    expect(getByText('Life is beautiful')).toBeTruthy()
  })

  it('displays the correct feeling today message', () => {
    const { getByText } = render(<HomeScreen />)
    expect(getByText("How're you feeling today?")).toBeTruthy()
  })

  it('displays modal with daily quote and author upon View button press', () => {
    const { getByText, getAllByText } = renderHomeScreen()
    fireEvent.press(getByText('View'))
    expect(getAllByText('Life is beautiful')).toBeTruthy()
    expect(getByText('- Anonymous')).toBeTruthy()
  })

  it('displays popular and curated sessions', () => {
    const { getByText } = renderHomeScreen()
    expect(getByText('Popular Sessions')).toBeTruthy()
    expect(getByText('Session 1')).toBeTruthy()
    expect(getByText('Curated Sessions')).toBeTruthy()
    expect(getByText('Session 2')).toBeTruthy()
  })

  it('renders all feeling emojis', () => {
    const { getAllByTestId } = render(<HomeScreen />)
    expect(getAllByTestId(/^mood-emoji-/).length).toBe(6)
  })

  it('shows modal when "View" button is pressed', () => {
    const { getByText, getByTestId } = render(<HomeScreen />)
    fireEvent.press(getByText('View'))
    expect(getByTestId('quote-modal')).toBeTruthy()
  })

  it('closes modal on "Cancel" button press', async () => {
    const { getByText, queryByTestId } = render(<HomeScreen />)
    fireEvent.press(getByText('View'))
    fireEvent.press(getByText('Cancel'))
    await waitFor(() => expect(queryByTestId('complete-quote')).toBeNull())
  })
})
