import { useCallback, useEffect } from 'react'
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins'
import { View, StyleSheet, LogBox } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import theme from './utils/theme'
import useAuthStore from './store/useAuthStore'
import WelcomeScreen from './screens/WelcomeScreen'
import LoginScreen from './screens/LoginScreen'
import SignupScreen from './screens/SignupScreen'
import ForgetPasswordScreen from './screens/ForgetPasswordScreen'
import HomeScreen from './screens/HomeScreen'
import ProgressScreen from './screens/ProgressScreen'
import ProfileScreen from './screens/ProfileScreen'

import SearchScreen from './screens/SearchScreen'
import CategoryScreen from './screens/CategoryScreen'
import PlayerScreen from './screens/PlayerScreen'

import JournalScreen from './screens/JournalScreen'
import JournalEntryScreen from './screens/JournalEntryScreen'
import JournalDetailScreen from './screens/JournalDetailScreen'

import HomeIcon from './assets/home-icon'
import SearchIcon from './assets/search-icon'
import JournalIcon from './assets/journal-icon'
import ProgressIcon from './assets/progress-icon'
import { RFValue } from 'react-native-responsive-fontsize'

LogBox.ignoreLogs([
  '`new NativeEventEmitter()` was called with a non-null argument without the required `addListener` method.',
  '`new NativeEventEmitter()` was called with a non-null argument without the required `removeListeners` method.',
])

// Prevent auto hiding of splash screen
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
// navigation stacks and flows
const AuthStack = createStackNavigator()
const MainTab = createBottomTabNavigator()
const RootStack = createStackNavigator()
const SearchStack = createStackNavigator()
// const JournalStack = createStackNavigator()

// authentication flow
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

// search stack
const SearchStackScreen = () => (
  <SearchStack.Navigator
    initialRouteName='Search'
    screenOptions={{ headerShown: false }}
  >
    <SearchStack.Screen name='Search' component={SearchScreen} />
    <SearchStack.Screen name='Category' component={CategoryScreen} />
    <SearchStack.Screen name='Player' component={PlayerScreen} />
  </SearchStack.Navigator>
)

// const JournalStackScreen = () => (
//   <JournalStack.Navigator
//     initialRouteName='Journal'
//     screenOptions={{ headerShown: false }}
//   >
//     <JournalStack.Screen name='Journal' component={JournalScreen} />
//     {/* <JournalStack.Screen name='JournalEntry' component={JournalEntryScreen} /> */}
//     {/* <JournalStack.Screen name='JournalDetail' component={JournalDetailScreen} /> */}
//   </JournalStack.Navigator>
// )

// main app flow with bottom tab navigator
const MainAppFlow = () => (
  <MainTab.Navigator
    screenOptions={{
      tabBarLabelStyle: {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        paddingBottom: 10,
      },
      tabBarStyle: {
        backgroundColor: theme.colors.primary,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        position: 'absolute',
        borderTopWidth: 0,
        height: RFValue(70),
        paddingVertical: 5,
      },
      tabBarActiveTintColor: theme.colors.white,
      tabBarInactiveTintColor: theme.colors.grayMedium,
    }}
  >
    <MainTab.Screen
      name='Home'
      component={HomeScreen}
      options={{
        tabBarLabel: 'Home',
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => (
          <View style={focused ? styles.activeTabStyle : null}>
            <HomeIcon name='home' color={color} size={size} />
          </View>
        ),
      }}
    />
    <MainTab.Screen
      name='SearchTab'
      component={SearchStackScreen}
      options={{
        headerShown: false,
        tabBarLabel: 'Search',
        tabBarIcon: ({ color, size, focused }) => (
          <View style={focused ? styles.activeTabStyle : null}>
            <SearchIcon name='search' color={color} size={size} />
          </View>
        ),
      }}
    />
    <MainTab.Screen
      name='Journal'
      component={JournalScreen}
      options={{
        headerShown: false,
        tabBarLabel: 'Journal',
        tabBarIcon: ({ color, size, focused }) => (
          <View style={focused ? styles.activeTabStyle : null}>
            <JournalIcon name='journal' color={color} size={size} />
          </View>
        ),
      }}
    />
    <MainTab.Screen
      name='Progress'
      component={ProgressScreen}
      options={{
        headerShown: false,
        tabBarLabel: 'Progress',
        tabBarIcon: ({ color, size, focused }) => (
          <View style={focused ? styles.activeTabStyle : null}>
            <ProgressIcon name='progress' color={color} size={size} />
          </View>
        ),
      }}
    />
  </MainTab.Navigator>
)

// Main app component
export default function App() {
  // Load fonts and check authentication state
  let [fontsLoaded, fontError] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  })

  // useFirebaseAuthState()
  const { isAuthenticated, user } = useAuthStore()

  // Hide splash screen after fonts are loaded
  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync()
    }
    prepare()
  }, [])

  // Check font loading status and hide splash screen
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
          <>
            <RootStack.Screen name='MainApp' component={MainAppFlow} />
            <RootStack.Screen name='Profile' component={ProfileScreen} />
            <RootStack.Screen
              name='JournalEntry'
              component={JournalEntryScreen}
            />
            <RootStack.Screen
              name='JournalDetail'
              component={JournalDetailScreen}
            />
          </>
        ) : (
          <RootStack.Screen name='Auth' component={AuthFlow} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  activeTabStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    backgroundColor: '#8E97FD',
    // padding: 12,
    height: 40,
    width: 40,
  },
})
