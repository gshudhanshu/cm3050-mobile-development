import { useCallback, useEffect } from 'react'
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import theme from './utils/theme'
import WelcomeScreen from './screens/WelcomeScreen'
import LoginScreen from './screens/LoginScreen'
import SignupScreen from './screens/SignupScreen'
import ForgetPasswordScreen from './screens/ForgetPasswordScreen'
import HomeScreen from './screens/HomeScreen'
import SearchScreen from './screens/SearchScreen'
import JournalScreen from './screens/JournalScreen'
import ProgressScreen from './screens/ProgressScreen'

SplashScreen.preventAutoHideAsync()

// Configure screen transition animation
const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
}

const AuthStack = createStackNavigator()
const MainTab = createBottomTabNavigator()
const RootStack = createStackNavigator()

const AuthFlow = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name='Welcome'
      component={WelcomeScreen}
      options={{ headerShown: false }}
    />
    <AuthStack.Screen name='Login' component={LoginScreen} />
    <AuthStack.Screen name='Signup' component={SignupScreen} />
    <AuthStack.Screen name='ForgetPassword' component={ForgetPasswordScreen} />
  </AuthStack.Navigator>
)

const MainAppFlow = () => (
  <MainTab.Navigator>
    <MainTab.Screen name='Home' component={HomeScreen} />
    <MainTab.Screen name='Search' component={SearchScreen} />
    <MainTab.Screen name='Journal' component={JournalScreen} />
    <MainTab.Screen name='Progress' component={ProgressScreen} />
  </MainTab.Navigator>
)

export default function App() {
  let [fontsLoaded, fontError] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  })

  const isAuthenticated = false

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync()
    }
    prepare()
  }, [])

  if (!fontsLoaded && !fontError) {
    return undefined
  } else {
    console.log('Fonts loaded')
    SplashScreen.hideAsync()
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <RootStack.Screen name='MainApp' component={MainAppFlow} />
        ) : (
          <RootStack.Screen name='Auth' component={AuthFlow} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  )
}
