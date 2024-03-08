import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import JournalCard from './JournalCard' // Adjust the import path as necessary

describe('JournalCard', () => {
  const props = {
    imageUri: 'https://example.com/image.jpg',
    date: 'January 1, 2022',
    title: 'Journal Entry Title',
    description: 'This is a sample description of the journal entry.',
    onButtonPress: jest.fn(),
  }

  it('renders correctly', () => {
    const { getByText } = render(<JournalCard {...props} />)
    expect(getByText(props.date)).toBeTruthy()
    expect(getByText(props.title)).toBeTruthy()
    expect(getByText(props.description)).toBeTruthy()
  })

  it('calls onButtonPress when pressed', () => {
    const { getByTestId } = render(<JournalCard {...props} />)
    fireEvent.press(getByTestId('journal-card-button'))
    expect(props.onButtonPress).toHaveBeenCalled()
  })
})
