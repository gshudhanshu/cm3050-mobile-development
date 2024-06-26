import React, { useMemo } from 'react'
import { StyleSheet, View, Dimensions } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'
import { RFValue } from 'react-native-responsive-fontsize'
import GlobalStyles from '../../utils/GlobalStyles'
import theme from '../../utils/theme'
import TextCard from '../TextCard'
import CText from '../common/CText'
import useSessionStore from '../../store/useSessionStore'
import useWellnessStore from '../../store/useWellnessStore'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.tz.setDefault('Europe/London')

export default function WeekComponent() {
  const { progress, percentageDifferences } = useSessionStore()
  const { averageMoodLast7Days, averageMoodLast30Days } = useWellnessStore()

  // Use useMemo to transform progress data only when it changes
  const barData = useMemo(() => {
    const today = dayjs()
    const startOfWeek = today.startOf('week')

    // Initialize an object to hold aggregated durations for each day of the current week
    const weekData = Array.from({ length: 7 }).map(() => ({
      value: 0,
      label: '',
      labelTextStyle: { color: theme.colors.grayMedium },
    }))

    // Populate weekData with session durations
    progress.forEach((session) => {
      const sessionDay = dayjs(session.date)
      if (sessionDay.isAfter(startOfWeek)) {
        const dayIndex = sessionDay.day() // Sunday as 0 through Saturday as 6
        weekData[dayIndex].value += session.duration / 60 // Aggregate durations
        weekData[dayIndex].label = sessionDay.format('dd').charAt(0) // Set label as first character of day name
      }
    })

    return weekData
  }, [progress])

  return (
    <View style={styles.container}>
      {/* Bar chart displaying weekly progress */}

      <BarChart
        barWidth={15}
        noOfSections={3}
        barBorderRadius={4}
        width={
          Dimensions.get('window').width - RFValue(20) * 2 - RFValue(10) * 2
        }
        frontColor={theme.colors.tertiary}
        data={barData}
        yAxisThickness={0}
        xAxisThickness={0}
        yAxisTextStyle={{ color: theme.colors.grayMedium }}
      />

      <View style={[styles.tabContainer]}>
        <View style={styles.sessionsContainer}>
          <View style={[GlobalStyles.blockContainer, styles.blockContainer]}>
            {/* Display average percentage increase in completed sessions */}
            <CText
              weight='semiBold'
              style={[GlobalStyles.blockTitle, styles.blockText]}
            >
              Weekly progress
            </CText>
            <CText style={[GlobalStyles.blockSubTitle, styles.blockText]}>
              On average, you completed {percentageDifferences?.last7Days}% more
              sessions this week
            </CText>
            {/* Display average mood for the last 7 days */}
            <CText
              weight='semiBold'
              style={[GlobalStyles.blockTitle, styles.blockText]}
            >
              Weekly mood
            </CText>
            <CText style={[GlobalStyles.blockSubTitle, styles.blockText]}>
              On average, your mood was {averageMoodLast7Days?.toFixed(2) || 0}{' '}
              with scale 1-6
            </CText>
          </View>
        </View>
        {/* Set daily goal use a modal for edit */}
        {/* <TextCard
          title='Longest steak this week'
          subTitle={'3 Days in a Row'}
        /> */}
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
