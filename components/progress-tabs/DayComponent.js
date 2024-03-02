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
import useContentStore from '../../store/useContentStore'
import Loading from '../common/Loading'
import { useIsFocused } from '@react-navigation/native'

export default function DayComponent({ style }) {
  const isFocused = useIsFocused()
  const { setDailyGoal, profile, user } = useAuthStore()

  const [modalVisible, setModalVisible] = useState(false)
  const [goalValue, setGoalValue] = useState('')

  const { percentageDifferences, progress, todayProgessData } =
    useContentStore()

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

  if (progress === null || percentageDifferences === null || profile === null) {
    return <Loading />
  }

  const handleEditPress = () => {
    setModalVisible(true)
  }

  const handleGoalChange = (text) => {
    // Remove any non-numeric characters from the input
    const numericValue = text.replace(/[^0-9]/g, '')
    // Convert the string to a number
    setGoalValue(parseInt(numericValue, 10))
  }

  const handleSubmit = async () => {
    try {
      await setDailyGoal(goalValue * 60)
    } catch (error) {
      Alert.alert('Error', 'Failed to set daily goal')
    }
    setModalVisible(false) // Close the modal after submission
  }

  return (
    <View style={[styles.container]}>
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

      {/* Add your components for daily completed sessions and editable daily goal here */}
      <View style={[styles.tabContainer]}>
        {/* Trending sessions */}
        <View style={styles.sessionsContainer}>
          <View style={GlobalStyles.blockContainer}>
            <CText weight='semiBold' style={GlobalStyles.blockTitle}>
              Daily Sessions
            </CText>
            <CText style={GlobalStyles.blockSubTitle}>
              {todayProgessData.length} sessions
            </CText>
          </View>
          <ScrollView directionalLockEnabled={'false'} horizontal={true}>
            <View style={styles.sessionsSubContainer}>
              {todayProgessData.map((session, index) => (
                <SessionCard
                  key={index}
                  imageUrl={session.sessionData.thumbnailUrl}
                  level={session.sessionData.level}
                  title={session.sessionData.title}
                  type={session.sessionData.type}
                  duration={session.sessionData.duration}
                />
              ))}
              {/* <SessionCard
                imageUrl='https://media.istockphoto.com/id/1322220448/photo/abstract-digital-futuristic-eye.jpg?s=612x612&w=0&k=20&c=oAMmGJxyTTNW0XcttULhkp5IxfW9ZTaoVdVwI2KwK5s='
                level='Beginner'
                title='On the Beach'
                type='Guided'
                duration='25 min'
              /> */}
            </View>
          </ScrollView>
        </View>
        {/* Set daily goal use a modal for edit */}
        <TextCard
          title='My daily goal'
          subTitle={profile.dailyGoal / 60 + ' Minutes'}
          buttonTitle='Edit'
          onButtonPress={handleEditPress}
        />
      </View>
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
