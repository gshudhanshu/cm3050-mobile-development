import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import CategoryScreen from './CategoryScreen' // Adjust the import path as needed
import { NavigationContainer } from '@react-navigation/native'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import useSessionStore from '../store/useSessionStore'

// Mock the external hooks and libraries
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: jest.fn(),
  useIsFocused: jest.fn(),
}))
jest.mock('../store/useSessionStore')

// Helper function to wrap the component with all necessary providers
const renderCategoryScreen = (routeParams) => {
  return render(
    <NavigationContainer>
      <CategoryScreen route={{ params: routeParams }} />
    </NavigationContainer>
  )
}

describe('CategoryScreen', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    useNavigation.mockReturnValue({ navigate: jest.fn() })
    useIsFocused.mockReturnValue(true)
    useSessionStore.mockReturnValue({
      fetchSessions: jest.fn(),
      sessions: [
        // Populate with minimal mock data necessary for your tests
        {
          id: '1',
          title: 'Meditation for Beginners',
          level: 'Beginner',
          type: 'Guided',
          duration: 25,
          thumbnailUrl: 'http://example.com/image1.jpg',
        },
        {
          id: '2',
          title: 'Advanced Focus',
          level: 'Advanced',
          type: 'Self-Guided',
          duration: 45,
          thumbnailUrl: 'http://example.com/image2.jpg',
        },
      ],
    })
  })

  it('renders correctly', () => {
    const { getByText } = renderCategoryScreen({ category: 'Meditation' })
    expect(getByText('Search')).toBeTruthy()
    expect(getByText('Browse by sessions')).toBeTruthy()
  })

  it('filters sessions based on search query', () => {
    const { getByPlaceholderText, queryByText } = renderCategoryScreen({
      category: 'Meditation',
    })

    fireEvent.changeText(getByPlaceholderText('Search...'), 'Advanced')

    expect(queryByText('Meditation for Beginners')).toBeNull()
    expect(queryByText('Advanced Focus')).toBeTruthy()
  })

  it('navigates to session detail when a session card is pressed', () => {
    const navigateMock = jest.fn()
    useNavigation.mockReturnValue({ navigate: navigateMock })

    const { getByText } = renderCategoryScreen({ category: 'Meditation' })

    fireEvent.press(getByText('Advanced Focus'))

    expect(navigateMock).toHaveBeenCalledWith('Player', {
      session: expect.any(Object),
    })
  })
})
