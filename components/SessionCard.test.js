import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import SessionCard from './SessionCard'

describe('SessionCard', () => {
  const mockOnPress = jest.fn()
  const props = {
    imageUrl: 'https://example.com/image.jpg',
    level: 'Beginner',
    title: 'Yoga Basics',
    type: 'Yoga',
    duration: 300,
    onPress: mockOnPress,
    minCardWidth: 150,
  }

  it('renders correctly', () => {
    const { getByText } = render(<SessionCard {...props} />)
    expect(getByText(props.level)).toBeTruthy()
    expect(getByText(props.title)).toBeTruthy()
    expect(getByText(`${props.type}`)).toBeTruthy()
    expect(getByText(`${props.duration} sec`)).toBeTruthy()
  })

  it('calls onPress when pressed', () => {
    const { getByTestId } = render(
      <SessionCard {...props} testID='session-card' />
    )
    fireEvent.press(getByTestId('session-card'))
    expect(mockOnPress).toHaveBeenCalled()
  })
})
