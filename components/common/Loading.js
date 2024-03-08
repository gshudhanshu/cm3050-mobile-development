import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import theme from '../../utils/theme'
import * as Progress from 'react-native-progress'

export default function Loading() {
  return (
    <View
      testID='loading-view'
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.primary,
        height: '100%',
      }}
    >
      <Progress.CircleSnail
        size={100}
        color={[
          theme.colors.secondary,
          theme.colors.tertiary,
          theme.colors.white,
        ]}
      />
    </View>
  )
}
