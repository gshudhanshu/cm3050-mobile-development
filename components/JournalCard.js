import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'
import CText from './common/CText'
import { RFValue } from 'react-native-responsive-fontsize'
import theme from '../utils/theme'

const JournalCard = ({ imageUri, date, title, description, onButtonPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onButtonPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </View>
      <View style={styles.contentContainer}>
        <CText weight='semiBold' style={styles.date}>
          {date}
        </CText>
        <CText weight='semiBold' style={styles.title} numberOfLines={1}>
          {title}
        </CText>
        <CText style={styles.description} numberOfLines={3}>
          {description}
        </CText>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    borderRadius: RFValue(10),
    overflow: 'hidden',
    gap: RFValue(20),
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    // width: '100%',
    width: RFValue(100),
    aspectRatio: 1,
    resizeMode: 'cover',
    borderRadius: RFValue(10),
  },
  contentContainer: {
    flex: 1,
  },
  date: {
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.secondary,
  },
  title: {
    fontSize: theme.fonts.sizes.h5,
    color: theme.colors.white,
  },
  description: {
    fontSize: theme.fonts.sizes.body * 1.1,
    color: theme.colors.grayMedium,
  },
})

export default JournalCard
