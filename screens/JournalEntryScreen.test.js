import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import JournalEntryScreen from './JournalEntryScreen' // Adjust the import path as needed
import * as ImagePicker from 'expo-image-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useNavigation } from '@react-navigation/native'

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}))

jest.mock('../store/useJournalStore', () => ({
  __esModule: true,
  default: () => ({
    journals: [
      {
        id: '1',
        title: 'Test Journal',
        description: 'This is a test description',
        imageUrl: 'https://placehold.it/300x300',
        createdAt: new Date('2021-01-01'),
      },
    ],
    fetchJournals: jest.fn(),
  }),
}))

jest.mock('../store/useAuthStore', () => ({
  __esModule: true,
  default: () => ({
    user: { uid: 'test-uid' },
  }),
}))

jest.mock('expo-image-picker')
jest.mock('@react-native-community/datetimepicker')

describe('JournalEntryScreen', () => {
  it('renders correctly with default initial values', () => {
    const { getByPlaceholderText } = render(<JournalEntryScreen route={{}} />)
    expect(getByPlaceholderText('Title')).toBeTruthy()
    expect(getByPlaceholderText('Description')).toBeTruthy()
  })

  it('renders correctly with passed initial values', async () => {
    const { findByText, findByDisplayValue } = render(
      <JournalEntryScreen
        route={{
          params: {
            id: '1',
            title: 'Test Title',
            description: 'Test Description',
            date: {
              toDate: () => new Date('2021-01-01'),
            },
            imageUrl: 'https://placehold.it/300x300',
          },
        }}
      />
    )
    expect(await findByDisplayValue('Test Title')).toBeTruthy()
    expect(await findByDisplayValue('Test Description')).toBeTruthy()
  })
})
