import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import theme from '../utils/theme'
import CText from './common/CText'
import GlobalStyles from '../utils/GlobalStyles'
import { RFValue } from 'react-native-responsive-fontsize'

export default function TextCard() {
  return (
    <View style={styles.quoteContainer}>
      <View style={styles.quoteSubContainer}>
        <CText weight='light' style={styles.todayQuote}>
          My daily goal
        </CText>
        <CText numberOfLines={1} weight='semiBold' style={styles.Quote}>
          10 minutes
        </CText>
      </View>
      <TouchableOpacity style={[GlobalStyles.button, styles.viewButton]}>
        <CText style={[GlobalStyles.buttonText]}>Edit</CText>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  quoteContainer: {
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

  quoteSubContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '60%',
  },
  todayQuote: {
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.primary,
  },
  Quote: {
    fontSize: theme.fonts.sizes.h6,
    color: theme.colors.primary,
  },
  viewButton: {
    color: theme.colors.primary,
    paddingVertical: RFValue(6),
    paddingHorizontal: RFValue(15),
  },
})
