import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import LoginScreen from './LoginScreen' // Adjust the import path as needed
import * as yup from 'yup'

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}))

describe('LoginScreen', () => {
  it('renders correctly', () => {
    const screen = render(<LoginScreen />)
    expect(screen).not.toBeNull()
  })

  it('should render the LoginScreen component correctly', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />)
    expect(getByPlaceholderText('Email')).toBeTruthy()
    expect(getByPlaceholderText('Password')).toBeTruthy()
    expect(getByText('Login')).toBeTruthy()
  })
})
