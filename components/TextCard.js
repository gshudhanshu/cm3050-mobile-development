import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native'
import React from 'react'
import theme from '../utils/theme'
import CText from './common/CText'
import GlobalStyles from '../utils/GlobalStyles'
import { RFValue } from 'react-native-responsive-fontsize'

export default function TextCard({
  title,
  subTitle,
  buttonTitle,
  onButtonPress,
}) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardSubContainer}>
        {/* Title of the card */}
        <CText weight='light' style={styles.cardTitle}>
          {title}
        </CText>
        {/* Subtitle of the card */}
        <CText numberOfLines={1} weight='semiBold' style={styles.cardSubTitle}>
          {subTitle}
        </CText>
      </View>
      {/* Button for the card */}
      {buttonTitle && (
        <TouchableOpacity
          style={[GlobalStyles.button, styles.viewButton]}
          onPress={onButtonPress}
        >
          <CText style={[GlobalStyles.buttonText]}>{buttonTitle}</CText>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(10),
    backgroundColor: theme.colors.grayLight,
    borderRadius: RFValue(10),
    gap: RFValue(20),
  },

  cardSubContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '60%',
  },
  cardTitle: {
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.primary,
  },
  cardSubTitle: {
    fontSize: theme.fonts.sizes.h6,
    color: theme.colors.primary,
  },
  viewButton: {
    color: theme.colors.primary,
    paddingVertical: RFValue(6),
    paddingHorizontal: RFValue(15),
  },
})
