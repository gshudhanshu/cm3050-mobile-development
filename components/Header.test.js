import React from 'react'
import { fireEvent, render } from '@testing-library/react-native'
import Header from './Header'
import * as useAuthStore from '../store/useAuthStore'
import * as useNavigation from '@react-navigation/native'

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}))

jest.mock('../store/useAuthStore')

describe('Header Component', () => {
  const mockGoBack = jest.fn()
  const mockNavigate = jest.fn()

  beforeEach(() => {
    // Reset mock functions before each test
    mockGoBack.mockReset()
    mockNavigate.mockReset()

    // Mock implementation for navigation
    useNavigation.useNavigation.mockImplementation(() => ({
      goBack: mockGoBack,
      navigate: mockNavigate,
    }))

    // Mock implementation for useAuthStore
    useAuthStore.default.mockImplementation(() => ({
      user: { uid: 'test-uid' },
      profile: { profilePicture: 'https://example.com/profile.jpg' },
      setUserProfile: jest.fn(),
    }))
  })

  it('renders correctly with a title and no back button', () => {
    const { getByText, queryByTestId } = render(<Header title='Test Title' />)
    expect(getByText('Test Title')).toBeTruthy()
    expect(queryByTestId('back-button')).toBeNull()
  })

  it('navigates back when back button is pressed', () => {
    const { getByTestId } = render(<Header showBack={true} />)
    fireEvent.press(getByTestId('back-button'))
    expect(mockGoBack).toHaveBeenCalled()
  })

  it('displays logo when useLogo is true', () => {
    const { getByTestId } = render(<Header useLogo={true} />)
    expect(getByTestId('logo')).toBeTruthy()
  })

  it('navigates to profile screen when avatar is pressed', () => {
    const { getByTestId } = render(<Header />)
    fireEvent.press(getByTestId('profile-avatar'))
    expect(mockNavigate).toHaveBeenCalledWith('Profile')
  })
})
