// PlayerScreen.test.js
import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import PlayerScreen from './PlayerScreen'
import { Audio } from 'expo-av'
import * as Speech from 'expo-speech'

// Mock dependencies
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

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
  useIsFocused: jest.fn().mockReturnValue(true),
}))

jest.mock('../store/useSessionStore', () => ({
  __esModule: true,
  default: () => ({
    addFinishedSession: jest.fn(),
  }),
}))

jest.mock('../store/useAuthStore', () => ({
  __esModule: true,
  default: () => ({
    user: { uid: 'test-uid' },
    getUserProfile: jest.fn(),
  }),
}))

// Mock assets to simplify testing
jest.mock('../assets/play-icon', () => 'PlayIcon')
jest.mock('../assets/pause-icon', () => 'PauseIcon')
jest.mock('../assets/backward-icon', () => 'BackwardIcon')
jest.mock('../assets/forward-icon', () => 'ForwardIcon')
jest.mock('../assets/speaker-mute-icon', () => 'SpeakerMuteIcon')
jest.mock('../assets/speaker-icon', () => 'SpeakerIcon')

const mockRoute = {
  params: {
    session: {
      id: '1',
      audioUrl: 'https://example.com/audio.mp3',
      thumbnailUrl: 'https://example.com/thumbnail.jpg',
      title: 'Test Session',
      artist: 'Test Artist',
      instructions: [{ time: 10, text: 'Relax your shoulders' }],
    },
  },
}

describe('PlayerScreen', () => {
  const mockUnloadAsync = jest.fn()
  const mockPlayAsync = jest.fn()
  const mockPauseAsync = jest.fn()
  const mockSetPositionAsync = jest.fn()

  beforeEach(() => {
    Audio.Sound.createAsync.mockClear()
    Speech.speak.mockClear()
    mockUnloadAsync.mockClear()
    mockPlayAsync.mockClear()
    mockPauseAsync.mockClear()
    mockSetPositionAsync.mockClear()

    Audio.Sound.createAsync.mockResolvedValue({
      sound: {
        playAsync: mockPlayAsync,
        pauseAsync: mockPauseAsync,
        unloadAsync: mockUnloadAsync,
        setPositionAsync: mockSetPositionAsync,
      },
      status: {},
    })
  })

  it('loads and plays audio on focus', async () => {
    Audio.Sound.createAsync.mockResolvedValue({
      sound: { playAsync: jest.fn(), unloadAsync: jest.fn() },
      status: {},
    })

    const { findByText } = render(<PlayerScreen route={mockRoute} />)

    expect(Audio.Sound.createAsync).toHaveBeenCalledWith(
      { uri: mockRoute.params.session.audioUrl },
      { shouldPlay: false },
      expect.any(Function)
    )

    const titleElement = await findByText(mockRoute.params.session.title)
    expect(titleElement).toBeTruthy()
  })

  it('speaks instructions at the correct time', async () => {
    const fakeStatusUpdate = {
      isPlaying: true,
      positionMillis: 10000, // Simulate audio played for 10 seconds
      didJustFinish: false,
    }

    Audio.Sound.createAsync.mockImplementation(async (_, __, callback) => {
      callback(fakeStatusUpdate)
      return {
        sound: { playAsync: jest.fn(), unloadAsync: jest.fn() },
        status: fakeStatusUpdate,
      }
    })

    render(<PlayerScreen route={mockRoute} />)

    expect(Speech.speak).toHaveBeenCalledWith('Relax your shoulders', {
      rate: 0.75,
      pitch: 1.0,
      volume: 1,
    })
  })

  it('renders loading component when audio is not loaded', () => {
    const { getByTestId } = render(<PlayerScreen route={mockRoute} />)
    expect(getByTestId('loading-view')).toBeTruthy()
  })

  it('render player components', async () => {
    Audio.Sound.createAsync.mockResolvedValue({
      sound: { playAsync: jest.fn(), unloadAsync: jest.fn() },
      status: {},
    })
    const { findByText, queryByTestId, getByTestId } = render(
      <PlayerScreen route={mockRoute} />
    )
    await waitFor(() => {
      expect(queryByTestId('loading-view')).toBeNull()
    })
    const playButton = await getByTestId('play-button')
    expect(playButton).toBeTruthy()
  })
})
