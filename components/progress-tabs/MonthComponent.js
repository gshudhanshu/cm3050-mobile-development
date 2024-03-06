import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { BarChart, LineChart } from 'react-native-gifted-charts'
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize'
import GlobalStyles from '../../utils/GlobalStyles'
import theme from '../../utils/theme'
import TextCard from '../TextCard'
import CText from '../common/CText'
import useSessionStore from '../../store/useSessionStore'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.tz.setDefault('Europe/London')

export default function MonthComponent() {
  const { progress, percentageDifferences } = useSessionStore()
  // Aggregate and prepare data for the past 30 days
  const barData = useMemo(() => {
    const today = dayjs()
    const dateLabels = {}
    const aggregatedData = new Array(30).fill(0).map((_, index) => {
      const date = today.subtract(30 - index - 1, 'days')
      dateLabels[date.format('YYYY-MM-DD')] = index
      return {
        value: 0,
        label: date.format('D'),
        labelTextStyle: { color: theme.colors.grayMedium },
      }
    })

    progress.forEach((session) => {
      const sessionDate = dayjs(session.date).format('YYYY-MM-DD')
      if (dateLabels.hasOwnProperty(sessionDate)) {
        aggregatedData[dateLabels[sessionDate]].value += session.duration / 60 // Sum durations for the day
      }
    })

    return aggregatedData
  }, [progress])

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
              On average, you completed {percentageDifferences.last30Days}% more
              sessions this month
            </CText>
          </View>
        </View>
        {/* Set daily goal use a modal for edit */}
        {/* <TextCard
          title='Longest steak this month'
          subTitle={'10 Days in a Row'}
        /> */}
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
