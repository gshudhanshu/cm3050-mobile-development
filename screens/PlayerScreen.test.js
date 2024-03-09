import React from 'react'
import { fireEvent, render, act } from '@testing-library/react-native'
import PlayerScreen from './PlayerScreen' // Adjust import path as necessary
import * as Audio from 'expo-av'
import * as Speech from 'expo-speech'

// Mocking external dependencies
jest.mock('expo-av', () => ({
  Audio: {
    Sound: {
      createAsync: jest.fn(),
    },
  },
}))

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
}))

const mockSession = {
  id: '1',
  audioUrl: 'https://example.com/audio.mp3',
  thumbnailUrl: 'https://example.com/thumbnail.jpg',
  title: 'Test Session',
  artist: 'Test Artist',
  instructions: [
    { time: 10, text: 'Start relaxing' },
    { time: 20, text: 'Breathe in' },
    { time: 30, text: 'Breathe out' },
  ],
}

describe('PlayerScreen', () => {
  beforeEach(() => {
    Audio.Audio.Sound.createAsync.mockResolvedValue({
      sound: {
        unloadAsync: jest.fn(),
        pauseAsync: jest.fn(),
        playAsync: jest.fn(),
        setPositionAsync: jest.fn(),
      },
      status: {},
    })
  })

  it('renders correctly', () => {
    const screen = render(
      <PlayerScreen route={{ params: { session: mockSession } }} />
    )
    expect(screen).not.toBeNull()
  })
})
