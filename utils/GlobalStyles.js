import { StyleSheet } from 'react-native'
import theme from './theme'
import { RFValue } from 'react-native-responsive-fontsize'

const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Poppins_400Regular',
    color: theme.colors.primary,
    marginHorizontal: RFValue(20),
    marginVertical: RFValue(20),
  },
  button: {
    backgroundColor: theme.colors.tertiary,
    padding: theme.spacing.m,
    borderRadius: 100,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.fonts.sizes.body,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  input: {
    backgroundColor: theme.colors.grayLight,
    padding: theme.spacing.m,
    borderRadius: RFValue(10),
    fontSize: theme.fonts.sizes.body * 1.1,
    fontFamily: 'Poppins_400Regular',
  },
  errorText: {
    color: 'red',
    fontSize: theme.fonts.sizes.body,
  },
  title: {
    fontSize: theme.fonts.sizes.h3,
    color: theme.colors.yellowLight,
    textAlign: 'center',
    marginVertical: RFValue(30),
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    overflow: 'hidden',
  },
  text: {
    color: theme.colors.primary,
    fontSize: theme.fonts.sizes.body,
  },
})

export default GlobalStyles
