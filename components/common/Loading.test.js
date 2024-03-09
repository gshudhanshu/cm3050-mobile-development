import React from 'react'
import { render } from '@testing-library/react-native'
import Loading from './Loading'
import theme from '../../utils/theme'

describe('Loading Component', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<Loading />)
    expect(getByTestId('loading-view')).toBeTruthy()
  })
})
