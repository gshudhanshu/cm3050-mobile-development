import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  LogBox,
  Platform,
  Alert,
  Dimensions,
} from 'react-native'
import Slider from '@react-native-community/slider'
import React, { useState, useEffect, useRef } from 'react'
import { Audio } from 'expo-av'
import * as Speech from 'expo-speech'

import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'
import theme from '../utils/theme'
import CText from '../components/common/CText'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import GlobalStyles from '../utils/GlobalStyles'
import Header from '../components/Header'
import useSessionStore from '../store/useSessionStore'
import useAuthStore from '../store/useAuthStore'

import PlayIcon from '../assets/play-icon'
import PauseIcon from '../assets/pause-icon'
import BackwardIcon from '../assets/backward-icon'
import ForwardIcon from '../assets/forward-icon'
import SpeakerMuteIcon from '../assets/speaker-mute-icon'
import SpeakerIcon from '../assets/speaker-icon'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
import Loading from '../components/common/Loading'
dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.tz.setDefault('Europe/London')

export default function PlayerScreen({ route }) {
  const { addFinishedSession } = useSessionStore()

  const { user, getUserProfile } = useAuthStore()
  const { session } = route.params
  const [sound, setSound] = useState(null)
  const [playbackStatus, setPlaybackStatus] = useState({})
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentInstruction, setCurrentInstruction] =
    useState('No Instructions')
  const [isLoading, setIsLoading] = useState(true)

  const spokenInstructionsRef = useRef(new Set())
  const isFocused = useIsFocused()

  useEffect(() => {
    // Load audio when the screen is focused
    if (isFocused) {
      loadAudio()
    } else {
      // Unload audio when the screen is unfocused
      unloadAudio()
      spokenInstructionsRef.current = new Set()
    }
    return () => {
      // Cleanup when the component unmounts
      unloadAudio()
      spokenInstructionsRef.current = new Set()
    }
  }, [session, isFocused])

  const loadAudio = async () => {
    if (sound) {
      await unloadAudio()
    }

    // Load audio from the session's audio URL
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: session.audioUrl },
      { shouldPlay: false },
      handleAudioPlaybackStatusUpdate
    )
    setSound(newSound)
    setIsLoading(false)
  }

  const unloadAudio = async () => {
    if (sound) {
      // Unload the current audio
      await sound.unloadAsync()
      setSound(null)
      setIsLoading(true)
    }
  }

  const handleAudioPlaybackStatusUpdate = async (status) => {
    // Update playback status
    setPlaybackStatus(status)
    setIsPlaying(status.isPlaying)
    if (status.isPlaying) {
      // Check and speak instructions when audio is playing
      checkAndSpeakInstructions(status.positionMillis)
    }

    if (status.didJustFinish) {
      // If audio playback just finished, mark session as completed
      const sessionData = {
        date: dayjs(),
        duration: status.durationMillis / 1000,
        completed: true,
        sessionId: session.id,
      }

      await addFinishedSession(user.uid, sessionData)
      await getUserProfile(user.uid)
      console.log('Profile', useAuthStore.getState().profile)
    }
  }

  const playPauseAudio = async () => {
    if (!sound) {
      // Show an alert if audio is not loaded
      Alert.alert('Error', 'Audio not loaded, wait few seconds and try again.')
    }
    if (playbackStatus.isPlaying) {
      // Pause audio if currently playing
      await sound.pauseAsync()
    } else {
      // Start playing audio if paused or stopped
      if (playbackStatus.didJustFinish || playbackStatus.positionMillis === 0) {
        spokenInstructionsRef.current.clear()
        await sound.setPositionAsync(0)
      }
      await sound.playAsync()
    }
  }

  const seekAudio = async (value) => {
    // Seek audio to the specified position
    const newPositionMillis = value * playbackStatus.durationMillis
    await sound.setPositionAsync(newPositionMillis)
    spokenInstructionsRef.current = new Set(
      [...spokenInstructionsRef.current].filter(
        (time) => time * 1000 < newPositionMillis
      )
    )
    // const filteredInstructions = new Set(
    //   [...spokenInstructionsRef.current].filter(
    //     (time) => time > newPositionMillis / 1000
    //   )
    // )

    // spokenInstructionsRef.current.clear()

    if (playbackStatus.isPlaying) {
      checkAndSpeakInstructions(newPositionMillis)
    }
  }

  const formatTime = (milliseconds) => {
    // Format milliseconds into minutes:seconds
    const totalSeconds = milliseconds / 1000
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const checkAndSpeakInstructions = (positionMillis) => {
    // Check if it's time to speak instructions and if they haven't been spoken yet
    const currentTimeInSeconds = positionMillis / 1000
    session.instructions.forEach((instruction) => {
      if (
        currentTimeInSeconds >= instruction.time &&
        !spokenInstructionsRef.current.has(instruction.time)
      ) {
        if (!isMuted) {
          // Speak instruction if not muted
          Speech.speak(instruction.text, {
            rate: 0.75,
            pitch: 1.0,
            volume: 1,
          })
          // Add the instruction time to the set to mark it as spoken
          spokenInstructionsRef.current.add(instruction.time)
          setCurrentInstruction(instruction.text)
        }
      }
    })
  }

  if (isLoading) {
    // Show loading screen while audio is loading
    return <Loading />
  }

  return (
    <SafeAreaView style={GlobalStyles.safeAreaContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <StatusBar
          barStyle='light-content'
          backgroundColor={theme.colors.primary}
        />
        <View style={[GlobalStyles.container, styles.container]}>
          <Header showBack={true} useLogo={false} title={'Player'} />
          {/* Display session thumbnail */}
          <Image
            source={{ uri: session.thumbnailUrl }}
            style={styles.thumbnail}
          />
          {/* Display session information */}
          <View style={styles.sessionInfoContainer}>
            <CText style={styles.artist}>{session.artist || 'unknown'}</CText>
            <CText weight='semiBold' style={styles.title}>
              {session.title}
            </CText>
          </View>

          {/* Slider for audio playback progress */}
          <Slider
            style={styles.progressBar}
            minimumValue={0}
            maximumValue={1}
            value={
              playbackStatus.positionMillis / playbackStatus.durationMillis || 0
            }
            // onValueChange={seekAudio}
            onSlidingComplete={seekAudio}
            minimumTrackTintColor='#FFFFFF'
            maximumTrackTintColor='#000000'
          />
          {/* Display current and total time of audio */}
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {formatTime(playbackStatus.positionMillis || 0)}
            </Text>
            <Text style={styles.timeText}>
              {formatTime(playbackStatus.durationMillis || 0)}
            </Text>
          </View>
          {/* Audio playback controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              onPress={() =>
                sound.setPositionAsync(playbackStatus.positionMillis - 10000)
              }
            >
              <BackwardIcon width={48} height={48} fill={theme.colors.white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={playPauseAudio} testID='play-button'>
              {isPlaying ? (
                <PauseIcon width={48} height={48} fill={theme.colors.white} />
              ) : (
                <PlayIcon width={48} height={48} fill={theme.colors.white} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                sound.setPositionAsync(playbackStatus.positionMillis + 10000)
              }
            >
              <ForwardIcon width={48} height={48} fill={theme.colors.white} />
            </TouchableOpacity>
          </View>
          {/* Display current spoken instruction */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>{currentInstruction}</Text>
            <TouchableOpacity
              onPress={() => setIsMuted(!isMuted)}
              style={styles.muteButton}
            >
              {isMuted ? (
                <SpeakerMuteIcon width={20} stroke={theme.colors.white} />
              ) : (
                <SpeakerIcon width={20} stroke={theme.colors.white} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: RFValue(80),
  },
  thumbnail: {
    width: '100%',
    height: RFValue(225),
    resizeMode: 'cover',
    borderRadius: RFValue(20),
    marginTop: RFValue(20),
  },

  sessionInfoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginTop: RFValue(20),
  },
  title: {
    fontSize: theme.fonts.sizes.h3,
    color: theme.colors.white,
  },
  artist: {
    fontSize: theme.fonts.sizes.h5,
    color: theme.colors.grayMedium,
  },

  progressBar: {
    width: Dimensions.get('window').width - RFValue(20),
    // width: RFPercentage(50),
    height: RFValue(40),
  },
  timeContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    color: theme.colors.white,
  },
  controls: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: RFValue(25),
  },
  instructionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: RFValue(20),
    borderRadius: RFValue(15),
  },
  instructionsText: {
    color: theme.colors.white,
  },
  muteButton: {},
})
