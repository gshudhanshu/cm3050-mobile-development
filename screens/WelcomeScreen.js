import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native'
import CText from '../components/common/CText'
import { useFonts, Poppins_200ExtraLight } from '@expo-google-fonts/poppins'
import GlobalStyles from '../utils/GlobalStyles'
// import Logo from '../assets/logo.svg'
import Logo from '../assets/logo'
import Meditation from '../assets/meditation'
import theme from '../utils/theme'
import { RFValue } from 'react-native-responsive-fontsize'

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={[GlobalStyles.safeAreaContainer]}>
      <StatusBar
        barStyle='light-content'
        backgroundColor={theme.colors.primary}
      />
      <View style={[GlobalStyles.container, styles.container]}>
        {/* Logo and welcome text */}
        <View style={styles.logoContainer}>
          <Logo style={GlobalStyles.logo} />
          <View>
            <CText weight='semiBold' style={[styles.welcomeText]}>
              Welcome
            </CText>
            <CText style={styles.taglineText}>
              Find your inner peace with Calm Mind
            </CText>
          </View>
        </View>

        {/* Image */}
        <View style={styles.circles}>
          <View style={[styles.circle]} />
          <View
            style={[
              styles.circle,
              {
                width: styles.circle.width * 1.25,
                height: styles.circle.height * 1.25,
              },
            ]}
          />
          <View
            style={[
              styles.circle,
              {
                width: styles.circle.width * 1.5,
                height: styles.circle.height * 1.5,
                opacity: 0.25,
              },
            ]}
          />
          <View
            style={[
              styles.circle,
              {
                width: styles.circle.width * 1.75,
                height: styles.circle.height * 1.75,
                opacity: 0.2,
              },
            ]}
          />
          <View
            style={[
              styles.circle,
              {
                width: styles.circle.width * 2,
                height: styles.circle.height * 2,
                opacity: 0.15,
              },
            ]}
          />
          <View
            style={[
              styles.circle,
              {
                width: styles.circle.width * 2.25,
                height: styles.circle.height * 2.25,
                opacity: 0.1,
              },
            ]}
          />
          <View
            style={[
              styles.circle,
              {
                width: styles.circle.width * 2.5,
                height: styles.circle.height * 2.5,
                opacity: 0.05,
              },
            ]}
          />
          <Meditation style={styles.meditationImg} />
        </View>

        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('Login')}
        >
          <CText weight='medium' style={styles.getStartedButtonText}>
            GET STARTED
          </CText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flex: 1,
    backgroundColor: theme.colors.primary,
    gap: 100,
    paddingVertical: 50,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50,
  },

  circles: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 150,
    zIndex: -150,
  },
  circle: {
    position: 'absolute',
    width: 270,
    height: 270,
    padding: 0,
    margin: 0,
    backgroundColor: theme.colors.secondary,
    borderRadius: 1000,
    zIndex: -100,
  },
  meditationImg: {
    width: RFValue(341) * 0.8,
    height: RFValue(357) * 0.8,
    top: -RFValue(20),
  },
  welcomeText: {
    fontSize: RFValue(45),
    color: theme.colors.yellowLight,
    textAlign: 'center',
    zIndex: 50,
  },
  taglineText: {
    fontSize: theme.fonts.sizes.h6,
    color: theme.colors.grayLight,
    textAlign: 'center',
    zIndex: 50,
  },
  getStartedButton: {
    backgroundColor: theme.colors.grayLight,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 35,
  },
  getStartedButtonText: {
    color: theme.colors.primary,
    fontSize: theme.fonts.sizes.body,
  },
})

export default WelcomeScreen
