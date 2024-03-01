import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React from 'react'
import { PieChart, BarChart } from 'react-native-gifted-charts'
import theme from '../../utils/theme'
import CText from '../common/CText'
import SessionCard from '../SessionCard'
import TextCard from '../TextCard'
import GlobalStyles from '../../utils/GlobalStyles'
import { RFValue } from 'react-native-responsive-fontsize'

const pieData = [
  {
    value: 47,
    color: '#009FFF',
    gradientCenterColor: '#006DFF',
    focused: true,
  },
  { value: 40, color: '#93FCF8', gradientCenterColor: '#3BE9DE' },
]

export default function DayComponent() {
  return (
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
              <Text
                style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}
              >
                47%
              </Text>
              {/* <Text style={{ fontSize: 14, color: 'white' }}>Excellent</Text> */}
            </View>
          )
        }}
      />

      {/* Add your components for daily completed sessions and editable daily goal here */}
      <View style={styles.container}>
        {/* Trending sessions */}
        <View style={styles.container}>
          <View style={GlobalStyles.blockContainer}>
            <CText weight='semiBold' style={GlobalStyles.blockTitle}>
              Daily Sessions
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
          </ScrollView>
        </View>
        {/* Set daily goal use a modal for edit */}
        <TextCard />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    flex: 1,
  },

  sessionsContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: RFValue(15),
  },
})
