import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native'
import { TabView, SceneMap } from 'react-native-tab-view'
import { PieChart, BarChart } from 'react-native-gifted-charts'

import Header from '../components/Header'
import CText from '../components//common/CText'
import SessionCard from '../components/SessionCard'
import GlobalStyles from '../utils/GlobalStyles'
import theme from '../utils/theme'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'

import { useNavigation } from '@react-navigation/native'
import useContentStore from '../store/useContentStore'
import useAuthStore from '../store/useAuthStore'
import DayComponent from '../components/progress-tabs/DayComponent'

//

const pieData = [
  {
    value: 47,
    color: '#009FFF',
    gradientCenterColor: '#006DFF',
    focused: true,
  },
  { value: 40, color: '#93FCF8', gradientCenterColor: '#3BE9DE' },
]

const FirstRoute = () => (
  <View
    style={{
      flex: 1,
      // backgroundColor: theme.colors.grayDark,
      alignItems: 'center',
      // justifyContent: 'center',
    }}
  >
    <PieChart
      data={pieData}
      donut
      showGradient
      sectionAutoFocus
      radius={90}
      innerRadius={60}
      innerCircleColor={'#232B5D'}
      centerLabelComponent={() => {
        return (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>
              47%
            </Text>
            {/* <Text style={{ fontSize: 14, color: 'white' }}>Excellent</Text> */}
          </View>
        )
      }}
    />

    {/* Add your components for daily completed sessions and editable daily goal here */}
    <View>
      {/* Trending sessions */}
      <View style={styles.container}>
        <View style={GlobalStyles.blockContainer}>
          <CText weight='semiBold' style={GlobalStyles.blockTitle}>
            Trending
          </CText>
          <CText style={GlobalStyles.blockSubTitle}>25 sessions</CText>
        </View>
        <ScrollView directionalLockEnabled={'false'} horizontal={true}>
          <View style={styles.sessionsContainer}>
            <SessionCard
              imageUrl='https://media.istockphoto.com/id/1322220448/photo/abstract-digital-futuristic-eye.jpg?s=612x612&w=0&k=20&c=oAMmGJxyTTNW0XcttULhkp5IxfW9ZTaoVdVwI2KwK5s='
              level='Beginner'
              title='On the Beach'
              type='Guided'
              duration='25 min'
              onPress={() => {}}
            />
            <SessionCard
              imageUrl='https://media.istockphoto.com/id/1322220448/photo/abstract-digital-futuristic-eye.jpg?s=612x612&w=0&k=20&c=oAMmGJxyTTNW0XcttULhkp5IxfW9ZTaoVdVwI2KwK5s='
              level='Beginner'
              title='On the Beach'
              type='Guided'
              duration='25 min'
              onPress={() => {}}
            />
          </View>
          {/* Set daily goal use a modal for edit */}
          <View style={styles.quoteContainer}>
            <View style={styles.quoteSubContainer}>
              <CText weight='light' style={styles.todayQuote}>
                My daily goal
              </CText>
              <CText numberOfLines={1} weight='semiBold' style={styles.Quote}>
                10 minutes
              </CText>
            </View>
            <TouchableOpacity style={[GlobalStyles.button, styles.viewButton]}>
              <CText style={[GlobalStyles.buttonText]}>Edit</CText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  </View>
)

const barData = [
  { value: 250, label: 'M' },
  { value: 500, label: 'T', frontColor: '#177AD5' },
  { value: 745, label: 'W', frontColor: '#177AD5' },
  { value: 320, label: 'T' },
  { value: 600, label: 'F', frontColor: '#177AD5' },
  { value: 256, label: 'S' },
  { value: 300, label: 'S' },
]

const SecondRoute = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: '#673ab7',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <BarChart
      barWidth={15}
      noOfSections={3}
      barBorderRadius={4}
      frontColor='lightgray'
      data={barData}
      yAxisThickness={0}
      xAxisThickness={0}
    />
    {/* Add your components for weekly stats here */}
  </View>
)

const barMonthData = [
  { value: 250, label: 'M' },
  { value: 500, label: 'T', frontColor: '#177AD5' },
  { value: 745, label: 'W', frontColor: '#177AD5' },
  { value: 320, label: 'T' },
  { value: 600, label: 'F', frontColor: '#177AD5' },
  { value: 256, label: 'S' },
  { value: 300, label: 'S' },
  { value: 250, label: 'M' },
  { value: 500, label: 'T', frontColor: '#177AD5' },
  { value: 745, label: 'W', frontColor: '#177AD5' },
  { value: 320, label: 'T' },
  { value: 600, label: 'F', frontColor: '#177AD5' },
  { value: 256, label: 'S' },
  { value: 300, label: 'S' },
  { value: 250, label: 'M' },
  { value: 500, label: 'T', frontColor: '#177AD5' },
  { value: 745, label: 'W', frontColor: '#177AD5' },
  { value: 320, label: 'T' },
  { value: 600, label: 'F', frontColor: '#177AD5' },
  { value: 256, label: 'S' },
  { value: 300, label: 'S' },
  { value: 250, label: 'M' },
  { value: 500, label: 'T', frontColor: '#177AD5' },
  { value: 745, label: 'W', frontColor: '#177AD5' },
  { value: 320, label: 'T' },
  { value: 600, label: 'F', frontColor: '#177AD5' },
  { value: 256, label: 'S' },
  { value: 300, label: 'S' },
]

const ThirdRoute = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: '#673ab7',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <BarChart
      barWidth={5}
      noOfSections={3}
      barBorderRadius={4}
      frontColor='lightgray'
      data={barMonthData}
      yAxisThickness={0}
      xAxisThickness={0}
      spacing={5}
    />
    {/* Add your components for monthly stats here */}
  </View>
)

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
  third: ThirdRoute,
})

export default function ProgressScreen() {
  const navigation = useNavigation()
  const { categories, fetchCategories } = useContentStore()
  const { user, profile } = useAuthStore()

  const layout = useWindowDimensions()

  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: 'first', title: 'Day' },
    { key: 'second', title: 'Week' },
    { key: 'third', title: 'Month' },
  ])
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
            {/* profile picture */}
            {/* name and email */}
            <View style={styles.profileDetailsContainer}>
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
              {/* streak, sessions, min in three columns with a line between them */}
              <View style={styles.statsContainer}>
                <View style={styles.statsColumn}>
                  <CText weight='regular' style={styles.statsValue}>
                    3
                  </CText>
                  <CText weight='semiBold' style={styles.statsTitle}>
                    Streak
                  </CText>
                </View>
                <View style={[styles.statsColumn, styles.sessionStatColumn]}>
                  <CText weight='regular' style={styles.statsValue}>
                    3
                  </CText>
                  <CText weight='semiBold' style={styles.statsTitle}>
                    Sessions
                  </CText>
                </View>
                <View style={styles.statsColumn}>
                  <CText weight='regular' style={styles.statsValue}>
                    3
                  </CText>
                  <CText weight='semiBold' style={styles.statsTitle}>
                    Min
                  </CText>
                </View>
              </View>
              {/* tabs day, week, month */}
              <View style={styles.tabContainer}>
                <TabView
                  navigationState={{ index, routes }}
                  renderScene={() => null}
                  onIndexChange={setIndex}
                  // initialLayout={{ width: layout.width }}
                  style={styles.tabView}
                />
                {index === 0 && <DayComponent />}
                {index === 1 && <SecondRoute />}
                {index === 2 && <ThirdRoute />}
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
    height: RFValue(80),
    flex: 1,
  },
  sessionsContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: RFValue(15),
  },
})
