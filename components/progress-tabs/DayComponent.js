import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { PieChart, BarChart } from 'react-native-gifted-charts'
import theme from '../../utils/theme'
import CText from '../common/CText'
import SessionCard from '../SessionCard'
import TextCard from '../TextCard'
import GlobalStyles from '../../utils/GlobalStyles'
import { RFValue } from 'react-native-responsive-fontsize'
import useAuthStore from '../../store/useAuthStore'
import useSessionStore from '../../store/useSessionStore'
import Loading from '../common/Loading'
import { useIsFocused } from '@react-navigation/native'

export default function DayComponent() {
  const isFocused = useIsFocused()
  const { setDailyGoal, profile, user } = useAuthStore()
  // State variables for modal and goal value
  const [modalVisible, setModalVisible] = useState(false)
  const [goalValue, setGoalValue] = useState('')

  const { percentageDifferences, progress, todayProgressData } =
    useSessionStore()

  // State variable for pie chart data
  const [pieData, setPieData] = useState([
    {
      value: 100,
      color: theme.colors.tertiary,
      focused: true,
    },
    {
      value: 120,
      color: theme.colors.grayLight,
      gradientCenterColor: theme.colors.grayLight,
    },
  ])

  useEffect(() => {
    // Update pie chart data based on progress
    if (progress) {
      let completed = percentageDifferences.todayCompletedGoalPercentage
      if (percentageDifferences.todayCompletedGoalPercentage > 100) {
        completed = 100
      }
      setPieData([
        {
          value: completed,
          color: theme.colors.tertiary,
          focused: true,
        },
        {
          value: 100 - completed,
          color: theme.colors.grayLight,
          gradientCenterColor: theme.colors.grayLight,
        },
      ])
    }
  }, [progress, isFocused, user.dailyGoal])

  // Render loading screen while data is being fetched
  if (progress === null || percentageDifferences === null || profile === null) {
    return <Loading />
  }

  // Event handler for opening modal
  const handleEditPress = () => {
    setModalVisible(true)
  }

  // Event handler for updating goal value
  const handleGoalChange = (text) => {
    // Remove any non-numeric characters from the input
    const numericValue = text.replace(/[^0-9]/g, '')
    // Convert the string to a number
    setGoalValue(parseInt(numericValue, 10))
  }

  // Event handler for submitting goal
  const handleSubmit = async () => {
    try {
      await setDailyGoal(goalValue * 60)
    } catch (error) {
      Alert.alert('Error', 'Failed to set daily goal')
    }
    // Close the modal after submission
    setModalVisible(false)
  }

  return (
    <View style={[styles.container]}>
      {/* Pie chart for progress */}
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
              <CText
                style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}
              >
                {Math.round(
                  percentageDifferences.todayCompletedGoalPercentage
                ) + '%'}
              </CText>
              <CText style={{ fontSize: 14, color: 'white' }}>Completed</CText>
            </View>
          )
        }}
      />

      {/* Container for sessions and goal */}
      <View style={[styles.tabContainer]}>
        {/* Trending sessions */}
        <View style={styles.sessionsContainer}>
          <View style={GlobalStyles.blockContainer}>
            <CText weight='semiBold' style={GlobalStyles.blockTitle}>
              Today's Sessions
            </CText>
            <CText style={GlobalStyles.blockSubTitle}>
              {todayProgressData.length} sessions
            </CText>
          </View>
          <ScrollView directionalLockEnabled={'false'} horizontal={true}>
            <View style={styles.sessionsSubContainer}>
              {todayProgressData.map((session, index) => (
                <SessionCard
                  key={index}
                  imageUrl={session.sessionDetails.thumbnailUrl}
                  level={session.sessionDetails.level}
                  title={session.sessionDetails.title}
                  type={session.sessionDetails.type}
                  duration={session.sessionDetails.duration}
                />
              ))}
            </View>
          </ScrollView>
        </View>
        {/* Set daily goal */}
        <TextCard
          title='My daily goal'
          subTitle={profile.dailyGoal / 60 + ' Minutes'}
          buttonTitle='Edit'
          onButtonPress={handleEditPress}
        />
      </View>
      {/* Modal for editing daily goal */}
      <View style={styles.centeredView}>
        <Modal
          animationType='slide'
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible)
          }}
        >
          <View style={modalStyles.centeredView}>
            <View style={modalStyles.modalView}>
              <CText weight='semiBold' style={modalStyles.title}>
                Edit Daily Goal (min)
              </CText>
              <TextInput
                style={[GlobalStyles.input, modalStyles.input]}
                onChangeText={handleGoalChange}
                value={goalValue ? goalValue.toString() : ''}
                placeholder='Enter your new daily goal'
                keyboardType='numeric'
              />
              <View style={modalStyles.buttonContainer}>
                <TouchableOpacity
                  style={GlobalStyles.button}
                  onPress={handleSubmit}
                >
                  <CText style={GlobalStyles.buttonText}>Submit</CText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[GlobalStyles.button, modalStyles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <CText
                    style={[GlobalStyles.buttonText, modalStyles.buttonText]}
                  >
                    Cancel
                  </CText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: RFValue(30),

    flex: 1,
  },

  tabContainer: {
    width: '100%',
    gap: RFValue(20),
    marginTop: RFValue(15),
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

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: RFValue(20),
    padding: RFValue(20),
    alignItems: 'center',
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  title: {
    fontSize: theme.fonts.sizes.h4,
  },
  input: {
    width: '100%',
    marginVertical: RFValue(20),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: theme.colors.grayMedium,
  },
})
