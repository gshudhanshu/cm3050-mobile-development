// // JournalScreen.test.js

// import React from 'react'
// import { render } from '@testing-library/react-native'
// import JournalScreen from './JournalScreen' // Adjust the import path as needed.
// import '../store/useJournalStore'

// // Continue to mock necessary dependencies as previously shown
// jest.mock('@react-navigation/native', () => ({
//   useNavigation: () => ({
//     navigate: jest.fn(),
//   }),
// }))

// jest.mock('../store/useJournalStore', () => ({
//   __esModule: true,
//   default: jest.fn(() => ({
//     journals: [],
//     fetchJournals: jest.fn(),
//   })),
// }))

// jest.mock('../store/useAuthStore', () => ({
//   __esModule: true,
//   default: jest.fn(() => ({
//     user: { uid: 'test-uid' },
//   })),
// }))

// jest.mock('../components/JournalCard', () => 'JournalCard')

// describe('JournalScreen', () => {
//   it('component is mounted and visible to the user', () => {
//     const { getByText } = render(<JournalScreen />)
//     expect(getByText('Browse by Journals')).toBeTruthy()
//     // Assuming 'Browse by Journals' is a text visible when component mounts
//   })
// })

import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import JournalScreen from './JournalScreen' // Adjust the import path as needed.
import { useNavigation } from '@react-navigation/native'

// Mocks setup
const mockNavigate = jest.fn()
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'), // Import and spread the actual library
  useNavigation: () => ({
    navigate: mockNavigate,
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

jest.mock('../components/JournalCard', () => 'JournalCard')

describe('JournalScreen', () => {
  it('renders correctly and matches snapshot', () => {
    const tree = render(<JournalScreen />)
    expect(tree).toMatchSnapshot()
  })

  it('component is mounted and visible to the user', () => {
    const { getByText } = render(<JournalScreen />)
    expect(getByText('Browse by Journals')).toBeTruthy()
  })

  it('shows the search input', () => {
    const { getByPlaceholderText } = render(<JournalScreen />)
    expect(getByPlaceholderText('Search...')).toBeTruthy()
  })

  it('navigates to JournalEntry on "Add Journal" button press', () => {
    const { getByText } = render(<JournalScreen />)
    fireEvent.press(getByText('Add Journal'))
    expect(mockNavigate).toHaveBeenCalledWith('JournalEntry')
  })
})
