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
import { PieChart, BarChart, ProgressChart } from 'react-native-chart-kit'

import Header from '../components/Header'
import CText from '../components//common/CText'
import GlobalStyles from '../utils/GlobalStyles'
import theme from '../utils/theme'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'

import { useNavigation } from '@react-navigation/native'
import useContentStore from '../store/useContentStore'
import useAuthStore from '../store/useAuthStore'

//
// Dummy data for charts
const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
}

const data = [
  {
    name: 'Min',
    goal: 60,
    color: 'rgba(131, 167, 234, 1)',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Min',
    goal: 40,
    color: '#F00',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
]

const barData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43, 50],
    },
  ],
}

const FirstRoute = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: theme.colors.grayDark,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <PieChart
      data={data}
      width={300}
      height={200}
      chartConfig={chartConfig}
      accessor={'goal'}
      backgroundColor={'transparent'}
      paddingLeft={'15'}
      center={[10, 10]}
      absolute
    />

    {/* Add your components for daily completed sessions and editable daily goal here */}
  </View>
)

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
      data={barData}
      width={300}
      height={220}
      yAxisLabel=''
      chartConfig={chartConfig}
      verticalLabelRotation={30}
    />
    {/* Add your components for weekly stats here */}
  </View>
)
const ThirdRoute = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {/* Monthly chart similar to weekly */}
    <BarChart
      data={barData}
      width={300}
      height={220}
      yAxisLabel=''
      chartConfig={chartConfig}
      verticalLabelRotation={30}
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
                  renderScene={renderScene}
                  onIndexChange={setIndex}
                  // initialLayout={{ width: layout.width }}
                  style={styles.tabView}
                />
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
    height: RFValue(300),
    flex: 1,
  },
})
