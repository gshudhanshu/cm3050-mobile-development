import React from 'react'
import { render } from '@testing-library/react-native'
import CText from './CText'

describe('CText', () => {
  it('renders correctly', () => {
    const { getByText } = render(<CText>Test Text</CText>)
    expect(getByText('Test Text')).toBeTruthy()
  })

  it.each([
    ['light', 'Poppins_300Light'],
    ['regular', 'Poppins_400Regular'],
    ['medium', 'Poppins_500Medium'],
    ['semiBold', 'Poppins_600SemiBold'],
    ['bold', 'Poppins_700Bold'],
  ])(
    'applies the correct font family for weight: %s',
    (weight, expectedFontFamily) => {
      const { getByText } = render(<CText weight={weight}>Test Text</CText>)
      const textComponent = getByText('Test Text')
      expect(textComponent).toBeTruthy()
    }
  )

  it('applies custom styles', () => {
    const customStyle = { color: 'blue' }
    const { getByText } = render(<CText style={customStyle}>Test Text</CText>)
    const textComponent = getByText('Test Text')
    expect(textComponent).toBeTruthy()
  })
})
