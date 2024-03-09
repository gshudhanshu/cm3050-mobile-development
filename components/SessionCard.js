import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
} from 'react-native'
import { BlurView } from 'expo-blur'
import { RFValue } from 'react-native-responsive-fontsize'
import theme from '../utils/theme'
import SpeakerIcon from '../assets/speaker-icon'
import ClockIcon from '../assets/clock-icon'
import CText from './common/CText'

const SessionCard = ({
  imageUrl,
  level,
  title,
  type,
  duration = 0,
  onPress,
  minCardWidth,
}) => {
  return (
    <TouchableOpacity
      style={[styles.cardContainer, { minWidth: minCardWidth }]}
      onPress={onPress}
      testID='session-card'
    >
      {/* Image background for the card */}
      <ImageBackground
        source={{
          uri: imageUrl,
        }}
        resizeMode='cover'
        style={styles.cardBackgroundImage}
      >
        {/* Overlay for the card */}
        <View style={styles.cardOverlay}>
          <View style={styles.cardContent}>
            {/* Blur view for the level tag */}
            <BlurView
              intensity={50}
              style={styles.levelTagBlur}
              experimentalBlurMethod={'dimezisBlurView'}
            >
              <CText style={styles.levelText}>{level}</CText>
            </BlurView>
            {/* Blur view for the session info */}
            <BlurView
              intensity={50}
              style={styles.sessionInfoBlur}
              experimentalBlurMethod={'dimezisBlurView'}
            >
              <CText
                style={styles.sessionTitleText}
                weight={'semiBold'}
                numberOfLines={1}
              >
                {title}
              </CText>
              {/* Container for session type and duration */}
              <View style={styles.sessionDetails}>
                <View style={styles.sessionTypeContainer}>
                  <SpeakerIcon stroke={theme.colors.white} width={15} />
                  <CText style={styles.sessionTypeText}>{type}</CText>
                </View>
                <View style={styles.sessionDurationContainer}>
                  <ClockIcon stroke={theme.colors.white} width={15} />
                  <CText style={styles.sessionDurationText}>
                    {duration} sec
                  </CText>
                </View>
              </View>
            </BlurView>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: RFValue(6),
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    height: RFValue(200),
  },
  cardBackgroundImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  levelTagBlur: {
    borderRadius: RFValue(6),
    overflow: 'hidden',
    alignSelf: 'flex-start',
    marginTop: RFValue(6),
    marginLeft: RFValue(6),
  },
  sessionInfoBlur: {
    overflow: 'hidden',
    flexDirection: 'column',
    padding: RFValue(12),
    gap: RFValue(4),
  },
  levelText: {
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.white,
    padding: RFValue(6),
    textAlign: 'center',
  },
  sessionTitleText: {
    fontSize: theme.fonts.sizes.h6,
    color: theme.colors.white,
  },
  sessionDetails: {
    flexDirection: 'row',
  },
  sessionTypeText: {
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.white,
    marginRight: RFValue(6),
    marginTop: RFValue(2),
  },
  sessionDurationText: {
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.white,
    marginTop: RFValue(2),
  },
  sessionTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: RFValue(3),
  },
  sessionDurationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: RFValue(3),
  },
})

export default SessionCard
