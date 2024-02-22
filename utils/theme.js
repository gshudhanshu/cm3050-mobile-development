import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'

const theme = {
  colors: {
    primary: '#03174C',
    secondary: '#8E97FD',
    tertiary: '#1DAC92',
    white: '#FFFFFF',
    black: '#000000',
    yellowLight: '#FFECCC',
    grayLight: '#EBEAEC',
    grayMedium: '#A1A4B2',
    grayDark: '#3F414E',
  },

  fonts: {
    sizes: {
      h1: RFValue(32),
      h2: RFValue(24),
      h3: RFValue(20),
      h4: RFValue(18),
      h5: RFValue(16),
      h6: RFValue(14),
      body: RFValue(12),
      caption: RFValue(10),
      small: RFValue(8),
    },
    weights: {
      light: '300',
      regular: '400',
      medium: '500',
      semiBold: '600',
      bold: '700',
    },
  },
  spacing: {
    s: RFValue(8),
    m: RFValue(16),
    l: RFValue(24),
    xl: RFValue(40),
  },
}

export default theme
