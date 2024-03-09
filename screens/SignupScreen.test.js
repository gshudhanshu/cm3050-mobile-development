import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import SignupScreen from './SignupScreen'

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  }
})

describe('Signup Screen Tests', () => {
  it('renders signup form correctly', () => {
    const { getByPlaceholderText } = render(<SignupScreen />)
    expect(getByPlaceholderText('First Name')).toBeTruthy()
    expect(getByPlaceholderText('Last Name')).toBeTruthy()
    expect(getByPlaceholderText('Email')).toBeTruthy()
    expect(getByPlaceholderText('Password')).toBeTruthy()
  })
})
