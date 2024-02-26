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

const SessionCard = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <ImageBackground
        source={{
          uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1280px-Image_created_with_a_mobile_phone.png',
        }}
        resizeMode='cover'
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <BlurView intensity={50} style={styles.blurContainer}>
            <Text style={styles.level}>Beginner</Text>
          </BlurView>
          <View>
            <Text style={styles.title} numberOfLines={1}>
              On the Beach
            </Text>
            <BlurView intensity={100} style={styles.blurContainer}>
              <Text style={styles.sessionType}>Guided</Text>
              <Text style={styles.duration}>25 min</Text>
            </BlurView>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    height: RFValue(200),
    width: RFValue(170),
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  overlay: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    height: '100%',
    justifyContent: 'space-between',
  },
  blurContainer: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  blurLevel: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  blurSessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    overflow: 'hidden',
  },
  level: {
    fontSize: 14,
    color: theme.colors.white,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  title: {
    fontSize: theme.fonts.sizes.h6,
    color: theme.colors.white,
    fontWeight: 'bold',
  },

  sessionType: {
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.white,
    marginRight: 8,
  },
  duration: {
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.white,
  },
})

export default SessionCard
