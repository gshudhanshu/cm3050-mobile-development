import React from 'react'
import renderer from 'react-test-renderer'
import JournalEntryScreen from './JournalEntryScreen' // Adjust the import path as needed

import useJournalStore from '../store/useJournalStore'

// Mocks for external dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}))
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
}))
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker')
jest.mock('../utils/GlobalStyles', () => ({}))
jest.mock('../utils/theme', () => ({}))
jest.mock('../components/Header', () => 'Header')
jest.mock('../store/useJournalStore', () => ({
  useJournalStore: () => ({
    addJournal: jest.fn(),
    editJournal: jest.fn(),
    deleteJournal: jest.fn(),
  }),
}))
jest.mock('../store/useAuthStore', () => ({
  useAuthStore: jest.fn(),
}))
jest.mock('dayjs', () => () => ({
  format: jest.fn().mockReturnValue('01/01/2021'),
}))

describe('JournalEntryScreen', () => {
  it('renders correctly and matches snapshot', () => {
    const route = {
      params: {
        imageUrl: '',
        date: new Date(),
        title: '',
        description: '',
        id: null,
      },
    }
    const tree = renderer.create(<JournalEntryScreen route={route} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
