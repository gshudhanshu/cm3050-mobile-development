import React from 'react'
import { StyleSheet, View } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'
import { RFValue } from 'react-native-responsive-fontsize'
import GlobalStyles from '../../utils/GlobalStyles'
import theme from '../../utils/theme'
import TextCard from '../TextCard'
import CText from '../common/CText'

const barData = [
  {
    value: 250,
    label: 'M',
    labelTextStyle: { color: theme.colors.grayMedium },
  },
  {
    value: 500,
    label: 'T',
    labelTextStyle: { color: theme.colors.grayMedium },
  },
  {
    value: 500,
    label: 'W',
    labelTextStyle: { color: theme.colors.grayMedium },
  },
  {
    value: 320,
    label: 'T',
    labelTextStyle: { color: theme.colors.grayMedium },
  },
  {
    value: 600,
    label: 'F',
    labelTextStyle: { color: theme.colors.grayMedium },
  },
  {
    value: 256,
    label: 'S',
    labelTextStyle: { color: theme.colors.grayMedium },
  },
  {
    value: 300,
    label: 'S',
    labelTextStyle: { color: theme.colors.grayMedium },
  },
]

export default function WeekComponent() {
  return (
    <View style={styles.container}>
      <BarChart
        barWidth={15}
        noOfSections={3}
        barBorderRadius={4}
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
              Weekly progress
            </CText>
            <CText style={[GlobalStyles.blockSubTitle, styles.blockText]}>
              On average, you completed 5% more sessions this week
            </CText>
          </View>
        </View>
        {/* Set daily goal use a modal for edit */}
        <TextCard
          title='Longest steak this week'
          subTitle={'3 Days in a Row'}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
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
