import React from 'react'
import { StyleSheet, View } from 'react-native'
import { BarChart, LineChart } from 'react-native-gifted-charts'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'
import GlobalStyles from '../../utils/GlobalStyles'
import theme from '../../utils/theme'
import TextCard from '../TextCard'
import CText from '../common/CText'

const barData = [
  {
    value: 250,
    label: '1',
    labelTextStyle: { color: theme.colors.grayMedium },
  },
  {
    value: 250,
  },
  { value: 500 },
  { value: 745 },
  {
    value: 320,
    label: '5',
    labelTextStyle: { color: theme.colors.grayMedium },
  },
  { value: 600 },
  { value: 256 },
  { value: 300 },
  { value: 250 },
  {
    value: 500,
    label: '10',
    labelTextStyle: { color: theme.colors.grayMedium },
  },
  { value: 745 },
  { value: 320 },
  { value: 600 },
  { value: 256 },
  {
    value: 300,
    label: '15',
    labelTextStyle: { color: theme.colors.grayMedium },
  },
  { value: 250 },
  { value: 500 },
  { value: 745 },
  { value: 320 },
  {
    value: 600,
    label: '20',
    labelTextStyle: { color: theme.colors.grayMedium },
  },
  { value: 256 },
  { value: 300 },
  { value: 250 },
  { value: 500 },
  {
    value: 745,
    label: '25',
    labelTextStyle: { color: theme.colors.grayMedium },
  },
  { value: 320 },
  { value: 600 },
  { value: 256 },
  { value: 300 },
  {
    value: 300,
    label: '30',
    labelTextStyle: { color: theme.colors.grayMedium },
  },
]

export default function MonthComponent() {
  return (
    <View style={styles.container}>
      <BarChart
        barWidth={RFValue(12)}
        noOfSections={3}
        barBorderRadius={4}
        spacing={RFValue(5.3)}
        // frontColor='lightgray'
        frontColor={theme.colors.tertiary}
        data={barData}
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisTextStyle={{ color: theme.colors.grayMedium }}
      />

      {/* Add your components for daily completed sessions and editable daily goal here */}
      <View style={[styles.tabContainer]}>
        {/* Trending sessions */}
        <View style={styles.sessionsContainer}>
          <View style={[GlobalStyles.blockContainer, styles.blockContainer]}>
            <CText
              weight='semiBold'
              style={[GlobalStyles.blockTitle, styles.blockText]}
            >
              Monthly progress
            </CText>
            <CText style={[GlobalStyles.blockSubTitle, styles.blockText]}>
              On average, you completed 5% more sessions this month
            </CText>
          </View>
        </View>
        {/* Set daily goal use a modal for edit */}
        <TextCard
          title='Longest steak this month'
          subTitle={'10 Days in a Row'}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    width: RFPercentage(46),
    marginVertical: RFValue(30),
  },

  tabContainer: {
    width: '100%',
    gap: RFValue(20),
    marginTop: RFValue(15),
  },

  blockContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  sessionsContainer: {
    width: '100%',
    flexDirection: 'column',
  },

  sessionsSubContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: RFValue(15),
  },
})
