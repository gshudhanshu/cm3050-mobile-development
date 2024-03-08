import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import CategoryCard from './CategoryCard' // Adjust the import path as necessary

describe('CategoryCard', () => {
  const mockOnPress = jest.fn()
  const props = {
    onPress: mockOnPress,
    imageUrl: 'http://example.com/image.jpg',
    category: 'Yoga',
    numberOfSessions: '5',
  }

  it('renders without crashing', () => {
    const { getByText } = render(<CategoryCard {...props} />)
    expect(getByText(props.category)).toBeTruthy()
    expect(getByText(`${props.numberOfSessions} sessions`)).toBeTruthy()
  })

  it('loads image with correct url', () => {
    const { getByTestId } = render(<CategoryCard {...props} />)
    const imageBackground = getByTestId('image-background')
    expect(imageBackground.props.source.uri).toBe(props.imageUrl)
  })

  it('displays the correct category and number of sessions', () => {
    const { getByText } = render(<CategoryCard {...props} />)
    expect(getByText(props.category)).toBeTruthy()
    expect(getByText(`${props.numberOfSessions} sessions`)).toBeTruthy()
  })

  it('calls onPress when pressed', () => {
    const { getByTestId } = render(<CategoryCard {...props} />)
    fireEvent.press(getByTestId('category-card-touchable'))
    expect(mockOnPress).toHaveBeenCalled()
  })
})
