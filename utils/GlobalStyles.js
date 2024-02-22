import { StyleSheet } from 'react-native'
import theme from './theme'

const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Poppins_400Regular',
    color: theme.colors.primary,
  },
})

export default GlobalStyles
