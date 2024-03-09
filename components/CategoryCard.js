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
import CText from './common/CText'

const CategoryCard = ({ onPress, imageUrl, category, numberOfSessions }) => {
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress}
      testID='category-card-touchable'
    >
      {/* Background image for the category card */}
      <ImageBackground
        source={{
          uri: imageUrl,
        }}
        resizeMode='cover'
        style={styles.backgroundImage}
        testID='image-background'
      >
        {/* Overlay for the category card */}
        <View style={styles.overlay}>
          <BlurView
            intensity={50}
            style={styles.infoBlur}
            experimentalBlurMethod={'dimezisBlurView'}
          >
            {/* Category title */}
            <CText
              style={styles.titleText}
              weight={'semiBold'}
              numberOfLines={1}
            >
              {category}
            </CText>
            {/* Number of sessions in the category */}
            <CText style={styles.sessionText}>
              {numberOfSessions} sessions
            </CText>
          </BlurView>
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
    height: 200,
    width: '100%',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  infoBlur: {
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: RFValue(12),
  },
  titleText: {
    fontSize: theme.fonts.sizes.h6,
    color: theme.colors.white,
  },
  sessionText: {
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.white,
  },
})

export default CategoryCard
