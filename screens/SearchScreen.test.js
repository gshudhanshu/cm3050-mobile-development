import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import SearchScreen from './SearchScreen' // Adjust the import path as necessary
import useSessionStore from '../store/useSessionStore'
import { useNavigation } from '@react-navigation/native'

// Mock the external hooks and libraries
jest.mock('../store/useSessionStore')
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
  useIsFocused: () => true,
}))

const categoriesData = [
  {
    id: '1',
    imageUrl: 'https://example.com/image1.jpg',
    category: 'Meditation',
    numberOfSessions: 25,
  },
  {
    id: '2',
    imageUrl: 'https://example.com/image2.jpg',
    category: 'Nature',
    numberOfSessions: 15,
  },
  {
    id: '3',
    imageUrl: 'https://example.com/image3.jpg',
    category: 'Pilates',
    numberOfSessions: 10,
  },
]

describe('SearchScreen Tests', () => {
  beforeEach(() => {
    // Mock the initial state and implementations
    jest.mock('@react-navigation/native', () => ({
      useNavigation: jest.fn(),
      useIsFocused: () => true,
    }))

    useSessionStore.mockImplementation(() => ({
      fetchCategories: jest.fn(),
      categories: categoriesData,
    }))
  })

  it('should render the SearchScreen component correctly', () => {
    const { getByText, getByPlaceholderText } = render(<SearchScreen />)

    expect(getByText('Search')).toBeTruthy()
    expect(getByPlaceholderText('Search...')).toBeTruthy()
    expect(getByText('Browse by category')).toBeTruthy()
  })

  it('should filter categories based on search query', () => {
    const { getByPlaceholderText, queryByText } = render(<SearchScreen />)

    const searchInput = getByPlaceholderText('Search...')
    fireEvent.changeText(searchInput, 'Meditation')

    expect(queryByText('Meditation')).toBeTruthy()
    expect(queryByText('Yoga')).toBeNull()
  })

  it('should navigate to the Category screen on pressing a category card', () => {
    const mockNavigate = jest.fn()
    useNavigation.mockImplementation(() => ({ navigate: mockNavigate }))

    const { getByText } = render(<SearchScreen />)

    const categoryCard = getByText('Meditation') // Use the category title or a testID
    fireEvent.press(categoryCard)

    expect(mockNavigate).toHaveBeenCalledWith('Category', {
      category: 'Meditation',
    })
  })

  it('should call fetchCategories when the screen is focused', () => {
    const mockFetchCategories = jest.fn()
    useSessionStore.mockImplementation(() => ({
      fetchCategories: mockFetchCategories,
      categories: categoriesData,
    }))

    render(<SearchScreen />)

    expect(mockFetchCategories).toHaveBeenCalled()
  })
})
