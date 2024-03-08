import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import TextCard from './TextCard' // Adjust the import path as necessary

describe('TextCard', () => {
  const mockOnButtonPress = jest.fn()
  const props = {
    title: 'Test Title',
    subTitle: 'Test SubTitle',
    buttonTitle: 'Test Button',
    onButtonPress: mockOnButtonPress,
  }

  it('renders correctly', () => {
    const { getByText } = render(<TextCard {...props} />)
    expect(getByText(props.title)).toBeTruthy()
    expect(getByText(props.subTitle)).toBeTruthy()
    // Only check for button title if it's provided
    if (props.buttonTitle) {
      expect(getByText(props.buttonTitle)).toBeTruthy()
    }
  })

  it('calls onButtonPress when button is pressed', () => {
    const { getByText } = render(<TextCard {...props} />)
    const button = getByText(props.buttonTitle)
    fireEvent.press(button)
    expect(mockOnButtonPress).toHaveBeenCalled()
  })

  it('does not render button if buttonTitle is not provided', () => {
    const { queryByText } = render(
      <TextCard
        title={props.title}
        subTitle={props.subTitle}
        // buttonTitle is intentionally left out to test its absence
        onButtonPress={props.onButtonPress}
      />
    )
    expect(queryByText(props.buttonTitle)).toBeNull()
  })
})
