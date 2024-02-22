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
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import WelcomeScreen from './screens/WelcomeScreen'

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
const Stack = createStackNavigator()

const App = () => {
  let [fontsLoaded, fontError] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  })

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
      <Stack.Navigator initialRouteName='Welcome'>
        {/* Stack.Screen components for each screen in your app */}
        <Stack.Screen
          name='Welcome'
          component={WelcomeScreen}
          options={{ headerShown: false }} // Hides the navigation bar on the welcome screen
        />
        {/* You will add more Stack.Screen entries here for other screens in your app */}
      </Stack.Navigator>
      <StatusBar style='light' />
    </NavigationContainer>
  )
}

export default App
