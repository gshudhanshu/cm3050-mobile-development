import React from 'react'
import { render } from '@testing-library/react-native'
import ForgetPasswordScreen from './ForgetPasswordScreen' // Adjust the import path as needed

describe('ForgetPasswordScreen', () => {
  it('renders the expected text', () => {
    const { getByText } = render(<ForgetPasswordScreen />)

    // Verify if the screen renders the correct text
    expect(getByText('ForgetPasswordScreen')).toBeTruthy()
  })
})
