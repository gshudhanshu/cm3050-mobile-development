import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import WelcomeScreen from './WelcomeScreen'

describe('<WelcomeScreen />', () => {
  it('renders welcome text correctly', () => {
    const { getByText } = render(<WelcomeScreen />)
    expect(getByText('Welcome')).toBeTruthy()
    expect(getByText('Find your inner peace with Calm Mind')).toBeTruthy()
  })

  it('navigates to the Login screen when "GET STARTED" button is pressed', () => {
    const navigationMock = { navigate: jest.fn() }
    const { getByText } = render(<WelcomeScreen navigation={navigationMock} />)

    fireEvent.press(getByText('GET STARTED'))
    expect(navigationMock.navigate).toHaveBeenCalledWith('Login')
  })
})
