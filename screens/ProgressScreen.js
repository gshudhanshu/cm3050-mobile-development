import React, { useEffect, useState } from 'react'
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SceneMap, TabBar, TabView } from 'react-native-tab-view'

import { RFValue } from 'react-native-responsive-fontsize'
import CText from '../components/common/CText'
import Header from '../components/Header'
import GlobalStyles from '../utils/GlobalStyles'
import theme from '../utils/theme'

import { useNavigation, useIsFocused } from '@react-navigation/native'
import Loading from '../components/common/Loading'
import DayComponent from '../components/progress-tabs/DayComponent'
import MonthComponent from '../components/progress-tabs/MonthComponent'
import WeekComponent from '../components/progress-tabs/WeekComponent'
import useAuthStore from '../store/useAuthStore'
import useSessionStore from '../store/useSessionStore'
import useWellnessStore from '../store/useWellnessStore'

export default function ProgressScreen() {
  const navigation = useNavigation()
  const { user, profile } = useAuthStore()
  const { fetchProgressLast65DaysAndCalculateAverages } = useSessionStore()
  const { fetchMoodAverages } = useWellnessStore()

  const isFocused = useIsFocused()

  const layout = useWindowDimensions()

  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: 'first', title: 'Day' },
    { key: 'second', title: 'Week' },
    { key: 'third', title: 'Month' },
  ])

  const [tabViewHeight, setTabViewHeight] = useState(RFValue(650))

  useEffect(() => {
    // Adjust tab view height based on the selected tab index
    switch (index) {
      case 0:
        setTabViewHeight(RFValue(650))
        break
      case 1:
        setTabViewHeight(RFValue(550))
        break
      case 2:
        setTabViewHeight(RFValue(550))
        break
      default:
        setTabViewHeight(RFValue(650))
    }
  }, [index])

  useEffect(() => {
    // Fetch user progress data when user profile and authentication are available
    if (user !== null && profile !== null) {
      fetchProgressLast65DaysAndCalculateAverages(user.uid, profile.dailyGoal)
      fetchMoodAverages(user.uid)
    }
  }, [user, profile, isFocused])

  // Render loading view while user profile is being fetched
  if (profile === null) {
    return <Loading testID='loading-view' />
  }

  const renderComponent = () => {
    switch (index) {
      case 0:
        return <DayComponent />
      case 1:
        return <WeekComponent />
      case 2:
        return <MonthComponent />
      default:
        return <DayComponent />
    }
  }

  return (
    <SafeAreaView style={GlobalStyles.safeAreaContainer}>
      <KeyboardAvoidingView style={GlobalStyles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <StatusBar
            barStyle='light-content'
            backgroundColor={theme.colors.primary}
          />
          <Header showBack={false} useLogo={false} title={'Progress'} />
          <View style={styles.progressContainer}>
            {/* Render user profile details */}
            <View
              style={styles.profileDetailsContainer}
              testID='profile-details-container'
            >
              <Image
                source={{ uri: profile?.profilePicture || '' }}
                style={styles.profilePicture}
              />
              <View style={styles.profileDetails}>
                <CText weight='semiBold' style={styles.profileName}>
                  {profile.firstName} {profile.lastName}
                </CText>
                <CText weight='regular' style={styles.profileEmail}>
                  {profile.email}
                </CText>
              </View>
              {/* Render user statistics */}
              <View style={styles.statsContainer}>
                <View style={styles.statsColumn}>
                  <CText weight='regular' style={styles.statsValue}>
                    {profile.longestStreak}
                  </CText>
                  <CText weight='semiBold' style={styles.statsTitle}>
                    Streak
                  </CText>
                </View>
                <View style={[styles.statsColumn, styles.sessionStatColumn]}>
                  <CText weight='regular' style={styles.statsValue}>
                    {profile.totalSessions}
                  </CText>
                  <CText weight='semiBold' style={styles.statsTitle}>
                    Sessions
                  </CText>
                </View>
                <View style={styles.statsColumn}>
                  <CText weight='regular' style={styles.statsValue}>
                    {Math.floor(profile.totalSessionDuration / 60)}
                  </CText>
                  <CText weight='semiBold' style={styles.statsTitle}>
                    Min
                  </CText>
                </View>
              </View>
              {/* Render tab view for daily, weekly, and monthly progress */}
              <View style={styles.tabContainer}>
                <TabView
                  navigationState={{ index, routes }}
                  // renderScene={SceneMap({
                  //   first: DayComponent,
                  //   second: WeekComponent,
                  //   third: MonthComponent,
                  // })}
                  renderScene={() => null}
                  onIndexChange={setIndex}
                  swipeEnabled={false}
                  initialLayout={{ width: layout.width }}
                  // style={[styles.tabView, { height: tabViewHeight }]}
                  renderTabBar={(props) => (
                    <TabBar
                      {...props}
                      indicatorStyle={{
                        backgroundColor: theme.colors.white,
                      }}
                      style={{
                        backgroundColor: theme.colors.tertiary,
                      }}
                      labelStyle={{
                        color: theme.colors.white,
                        fontFamily: 'Poppins_400Regular',
                        fontSize: RFValue(14),
                      }}
                      activeColor={theme.colors.white}
                      inactiveColor={theme.colors.grayLight}
                    />
                  )}
                />
                {renderComponent()}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: RFValue(80),
  },
  progressContainer: {
    marginVertical: RFValue(10),
  },
  profileDetailsContainer: {
    alignItems: 'center',
  },
  profilePicture: {
    width: RFValue(150),
    height: RFValue(150),
    borderRadius: RFValue(20),
  },
  profileDetails: {
    marginVertical: RFValue(10),
  },
  profileName: {
    fontSize: theme.fonts.sizes.h3,
    color: theme.colors.white,
    textAlign: 'center',
  },
  profileEmail: {
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.grayLight,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: RFValue(15),
  },
  statsColumn: {
    alignItems: 'center',
    width: '33%',
  },
  sessionStatColumn: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: theme.colors.grayMedium,
  },
  statsValue: {
    fontSize: theme.fonts.sizes.h3,
    color: theme.colors.white,
  },
  statsTitle: {
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.grayLight,
  },
  tabContainer: {
    width: '100%',
  },
  tabView: {
    marginTop: RFValue(10),
    height: RFValue(500),
    flex: 1,
  },

  sessionsContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: RFValue(15),
  },
})
