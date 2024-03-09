import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { Alert } from 'react-native'
import JournalDetailScreen from './JournalDetailScreen'
import useJournalStore from '../store/useJournalStore'
import useAuthStore from '../store/useAuthStore'

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')
jest.mock('../store/useJournalStore')
jest.mock('../store/useAuthStore')
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({ navigate: jest.fn() })),
}))

describe('<JournalDetailScreen />', () => {
  beforeEach(() => {
    useJournalStore.mockReturnValue({
      deleteJournal: jest.fn(),
    })
    useAuthStore.mockReturnValue({
      user: { uid: 'testUserId' },
    })
    jest.spyOn(Alert, 'alert')
  })

  it('renders journal details correctly', () => {
    const route = {
      params: {
        imageUrl: 'image-url',
        date: { seconds: 1615237200 },
        title: 'Test Title',
        description: 'Test Description',
        id: 'journal-id',
      },
    }

    const { getByText, getByTestId } = render(
      <JournalDetailScreen route={route} />
    )

    expect(getByText('Test Title')).toBeTruthy()
    expect(getByText('March 08, 2021')).toBeTruthy() // Assuming the date is correct
    expect(getByText('Test Description')).toBeTruthy()
    expect(getByTestId('journal-detail-image')).toBeTruthy()
  })

  it('calls editJournal function when edit button is pressed', () => {
    const route = {
      params: {
        imageUrl: 'image-url',
        date: { seconds: 1615237200 },
        title: 'Test Title',
        description: 'Test Description',
        id: 'journal-id',
      },
    }

    const { getByText } = render(<JournalDetailScreen route={route} />)
    fireEvent.press(getByText('Edit Journal'))
    expect(useJournalStore().editJournal).toHaveBeenCalled()
  })

  it('calls deleteJournal function and shows confirmation alert when delete button is pressed', () => {
    const route = {
      params: {
        imageUrl: 'image-url',
        date: { seconds: 1615237200 },
        title: 'Test Title',
        description: 'Test Description',
        id: 'journal-id',
      },
    }

    const { getByText } = render(<JournalDetailScreen route={route} />)
    fireEvent.press(getByText('Delete Journal'))
    expect(Alert.alert).toHaveBeenCalled()
    expect(useJournalStore().deleteJournal).toHaveBeenCalled()
  })
})
