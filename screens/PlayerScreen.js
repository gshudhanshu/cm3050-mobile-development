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
} from 'react-native'
import Slider from '@react-native-community/slider'
import React, { useState, useEffect } from 'react'
import { Audio } from 'expo-av'
// import { Speech } from 'expo-speech'

import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'
import theme from '../utils/theme'
import CText from '../components/common/CText'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import GlobalStyles from '../utils/GlobalStyles'
import Header from '../components/Header'
import useContentStore from '../store/useContentStore'

import PlayIcon from '../assets/play-icon'
import PauseIcon from '../assets/pause-icon'
import BackwardIcon from '../assets/backward-icon'
import ForwardIcon from '../assets/forward-icon'
import SpeakerMuteIcon from '../assets/speaker-mute-icon'
import SpeakerIcon from '../assets/speaker-icon'

export default function PlayerScreen({ route }) {
  const { session } = route.params
  const [sound, setSound] = useState(null)
  const [playbackStatus, setPlaybackStatus] = useState({})
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    loadAudio()
    return sound
      ? () => {
          sound.unloadAsync()
        }
      : undefined
  }, [session])

  const loadAudio = async () => {
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: session.audioUrl },
      { shouldPlay: true },
      handleAudioPlaybackStatusUpdate
    )
    setSound(newSound)
  }

  const handleAudioPlaybackStatusUpdate = (status) => {
    setPlaybackStatus(status)
    setIsPlaying(status.isPlaying)
  }

  const playPauseAudio = async () => {
    if (isPlaying) {
      await sound.pauseAsync()
    } else {
      await sound.playAsync()
    }
  }

  const seekAudio = async (value) => {
    const position = value * playbackStatus.durationMillis
    await sound.setPositionAsync(position)
  }

  const formatTime = (milliseconds) => {
    const totalSeconds = milliseconds / 1000
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const speakInstructions = () => {
    const instructionsText = session.instructions
      .map((inst) => inst.text)
      .join(', ')
    Speech.speak(instructionsText, {
      rate: 0.75,
      pitch: 1.0,
      volume: isMuted ? 0 : 1,
    })
  }

  return (
    <SafeAreaView style={GlobalStyles.safeAreaContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <StatusBar
          barStyle='light-content'
          backgroundColor={theme.colors.primary}
        />
        <Header showBack={true} useLogo={false} title={'Player'} />
        <View style={GlobalStyles.container}>
          <Image
            source={{ uri: session.thumbnailUrl }}
            style={styles.thumbnail}
          />
          <View style={styles.sessionInfoContainer}>
            <CText style={styles.artist}>{session.artist || 'unknown'}</CText>
            <CText weight='semiBold' style={styles.title}>
              {session.title}
            </CText>
          </View>

          {/* Add artist or description if needed */}
          <Slider
            style={styles.progressBar}
            minimumValue={0}
            maximumValue={1}
            value={
              playbackStatus.positionMillis / playbackStatus.durationMillis || 0
            }
            onValueChange={seekAudio}
            minimumTrackTintColor='#FFFFFF'
            maximumTrackTintColor='#000000'
          />
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {formatTime(playbackStatus.positionMillis || 0)}
            </Text>
            <Text style={styles.timeText}>
              {formatTime(playbackStatus.durationMillis || 0)}
            </Text>
          </View>
          <View style={styles.controls}>
            <TouchableOpacity
              onPress={() =>
                sound.setPositionAsync(playbackStatus.positionMillis - 10000)
              }
            >
              <BackwardIcon width={48} height={48} fill={theme.colors.white} />
            </TouchableOpacity>
            <TouchableOpacity onPress={playPauseAudio}>
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
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsText}>{'Instructions'}</Text>
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
    height: RFValue(250),
    resizeMode: 'cover',
    borderRadius: RFValue(20),
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
    width: RFPercentage(50),
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
