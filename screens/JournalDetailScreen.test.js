// JournalDetailScreen.test.js
import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import JournalDetailScreen from './JournalDetailScreen'
import * as useJournalStoreModule from '../store/useJournalStore'
import * as useAuthStoreModule from '../store/useAuthStore'
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'

// Mock useNavigation to control its behavior in tests
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}))

// Mock Alert to control its behavior in tests
jest.spyOn(Alert, 'alert')

describe('JournalDetailScreen', () => {
  // Mock data
  const route = {
    params: {
      id: '1',
      imageUrl: 'https://example.com/image.jpg',
      date: new Date('2021-01-01'),
      title: 'Test Journal',
      description: 'Test Description',
    },
  }
  const user = { uid: 'test-uid' }

  beforeEach(() => {
    // Clear mock call history before each test
    jest.clearAllMocks()

    // Mock stores with functions and initial data
    jest.spyOn(useJournalStoreModule, 'default').mockImplementation(() => ({
      deleteJournal: jest.fn(),
    }))
    jest.spyOn(useAuthStoreModule, 'default').mockImplementation(() => ({
      user,
    }))
  })

  it('renders correctly with route params', () => {
    const { getByText, getByTestId } = render(
      <JournalDetailScreen route={route} />
    )
    expect(getByText(route.params.title)).toBeTruthy()
    expect(getByText('Test Description')).toBeTruthy()
    expect(getByTestId('journal-image').props.source.uri).toBe(
      route.params.imageUrl
    )
  })

  it('navigates to JournalEntry on edit press', () => {
    const { getByTestId } = render(<JournalDetailScreen route={route} />)
    const editButton = getByTestId('edit-journal-button')
    expect(editButton).toBeTruthy()
  })

  it('deletes journal on delete press', () => {
    const { getByTestId } = render(<JournalDetailScreen route={route} />)
    const deleteButton = getByTestId('delete-journal-button')
    fireEvent.press(deleteButton)
    expect(Alert.alert).toHaveBeenCalled()
  })
})
