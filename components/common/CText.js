import React from 'react'
import { Text, StyleSheet } from 'react-native'

const CText = ({ style, children, weight = 'regular', ...props }) => {
  let fontFamily
  switch (weight) {
    case 'light':
      fontFamily = 'Poppins_300Light'
      break
    case 'regular':
      fontFamily = 'Poppins_400Regular'
      break
    case 'medium':
      fontFamily = 'Poppins_500Medium'
      break
    case 'semiBold':
      fontFamily = 'Poppins_600SemiBold'
      break
    case 'bold':
      fontFamily = 'Poppins_700Bold'
      break
    default:
      fontFamily = 'Poppins_400Regular'
  }

  return (
    <Text style={[{ fontFamily }, style]} {...props}>
      {children}
    </Text>
  )
}

export default CText
