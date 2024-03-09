import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native'

import React, { useEffect, useState } from 'react'
import GlobalStyles from '../utils/GlobalStyles'
import theme from '../utils/theme'
import { RFValue } from 'react-native-responsive-fontsize'
import Header from '../components/Header'
import CText from '../components/common/CText'
import FeelingEmoji1 from '../assets/feelings/feeling-emoji-1'
import FeelingEmoji2 from '../assets/feelings/feeling-emoji-2'
import FeelingEmoji3 from '../assets/feelings/feeling-emoji-3'
import FeelingEmoji4 from '../assets/feelings/feeling-emoji-4'
import FeelingEmoji5 from '../assets/feelings/feeling-emoji-5'
import FeelingEmoji6 from '../assets/feelings/feeling-emoji-6'
import SessionCard from '../components/SessionCard'

import useSessionStore from '../store/useSessionStore'
import useWellnessStore from '../store/useWellnessStore'
import useAuthStore from '../store/useAuthStore'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import Loading from '../components/common/Loading'

const FeelingEmojis = [
  FeelingEmoji1,
  FeelingEmoji2,
  FeelingEmoji3,
  FeelingEmoji4,
  FeelingEmoji5,
  FeelingEmoji6,
]

export default function HomeScreen() {
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false)
  // const [selectedMood, setSelectedMood] = useState(null)

  const { dailyQuote, fetchQuote, setUserMood, fetchUserMood, userMood } =
    useWellnessStore()
  const { user } = useAuthStore()

  const {
    fetchPopularSessions,
    fetchCuratedSessions,
    popularSessions,
    curatedSessions,
  } = useSessionStore()
  // const isFocused = useIsFocused()

  useEffect(() => {
    fetchPopularSessions()
    fetchCuratedSessions()
    fetchQuote()
  }, [])

  useEffect(() => {
    if (user && user.uid) fetchUserMood(user.uid)
  }, [user?.uid])

  const handleSelectMood = (moodIndex) => {
    setUserMood(user.uid, moodIndex)
  }

  if (!user) return <Loading />

  return (
    <SafeAreaView style={GlobalStyles.safeAreaContainer}>
      <ScrollView style={{ marginBottom: RFValue(80) }}>
        <StatusBar
          barStyle='light-content'
          backgroundColor={theme.colors.primary}
        />
        <View style={[GlobalStyles.container, styles.container]}>
          {/* Header */}
          <Header
            showBack={false}
            useLogo={true}
            onAvatarPress={() => setIsSettingsModalVisible(true)}
          />
          {/* Welcome */}
          <View style={styles.welcomeContainer}>
            <CText weight='semiBold' style={styles.welcomeText}>
              Welcome back, Ruby
            </CText>
            <CText style={styles.welcomeSubText}>
              How're you feeling today?
            </CText>
            <View style={styles.feelingsContainer}>
              {FeelingEmojis.map((EmojiComponent, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelectMood(index + 1)}
                  testID={`mood-emoji-${index + 1}`}
                >
                  <EmojiComponent
                    width={RFValue(40)}
                    gray={userMood !== index + 1}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {/* Daily Quote */}
          <View style={styles.quoteContainer}>
            <View style={styles.quoteSubContainer}>
              <CText weight='light' style={styles.todayQuote}>
                Today's Quote
              </CText>
              <CText numberOfLines={1} weight='semiBold' style={styles.Quote}>
                {dailyQuote.quote}
              </CText>
            </View>
            <TouchableOpacity
              style={[GlobalStyles.button, styles.viewButton]}
              onPress={() => setModalVisible(true)}
            >
              <CText style={[GlobalStyles.buttonText]}>View</CText>
            </TouchableOpacity>
          </View>
          {/* Modal for Quote */}
          <Modal
            animationType='slide'
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible)
            }}
            testID='quote-modal'
          >
            <View style={modalStyles.centeredView}>
              <View style={modalStyles.modalView}>
                <CText weight='semiBold' style={modalStyles.modalTitle}>
                  Today's Quote
                </CText>
                <CText
                  weight='medium'
                  style={modalStyles.title}
                  testID='complete-quote'
                >
                  {dailyQuote.quote}
                </CText>
                <CText weight='semiBold' style={modalStyles.author}>
                  - {dailyQuote.author}
                </CText>

                <View style={modalStyles.buttonContainer}>
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
          {/* Popular sessions */}
          <View style={styles.container}>
            <View style={GlobalStyles.blockContainer}>
              <CText weight='semiBold' style={GlobalStyles.blockTitle}>
                Popular Sessions
              </CText>
              <CText style={GlobalStyles.blockSubTitle}>25 sessions</CText>
            </View>
            <ScrollView
              directionalLockEnabled={'false'}
              horizontal={true}
              style={{ minWidth: '100%' }}
            >
              <View style={styles.sessionsContainer}>
                {popularSessions.map((session, index) => (
                  <SessionCard
                    key={index}
                    imageUrl={session.thumbnailUrl}
                    level={session.level}
                    title={session.title}
                    type={session.type}
                    duration={session.duration}
                    minCardWidth={RFValue(160)}
                    onPress={() =>
                      navigation.navigate('SearchTab', {
                        screen: 'Player',
                        params: { session: session },
                      })
                    }
                  />
                ))}
              </View>
            </ScrollView>
          </View>
          {/* Curated sessions */}
          <View style={styles.container}>
            <View style={GlobalStyles.blockContainer}>
              <CText weight='semiBold' style={GlobalStyles.blockTitle}>
                Curated Sessions
              </CText>
              <CText style={GlobalStyles.blockSubTitle}>25 sessions</CText>
            </View>
            <ScrollView
              directionalLockEnabled={'false'}
              horizontal={true}
              style={{ minWidth: '100%' }}
            >
              <View style={styles.sessionsContainer}>
                {curatedSessions.map((session, index) => (
                  <SessionCard
                    key={index}
                    imageUrl={session.thumbnailUrl}
                    level={session.level}
                    title={session.title}
                    type={session.type}
                    duration={session.duration}
                    minCardWidth={RFValue(160)}
                    onPress={() =>
                      navigation.navigate('Player', { session: session })
                    }
                  />
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    flex: 1,
  },
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: RFValue(0),
  },
  welcomeText: {
    fontSize: theme.fonts.sizes.h4,
    color: theme.colors.white,
    textAlign: 'center',
  },
  welcomeSubText: {
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.grayLight,
    textAlign: 'center',
  },
  feelingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: RFValue(8),
  },
  quoteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(10),
    backgroundColor: theme.colors.grayLight,
    borderRadius: RFValue(10),
    gap: RFValue(20),
  },

  quoteSubContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '60%',
  },
  todayQuote: {
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.primary,
  },
  Quote: {
    fontSize: theme.fonts.sizes.h6,
    color: theme.colors.primary,
  },
  viewButton: {
    color: theme.colors.primary,
    paddingVertical: RFValue(6),
    paddingHorizontal: RFValue(15),
  },
  sessionsContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: RFValue(15),
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
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
  modalTitle: {
    fontSize: theme.fonts.sizes.h4,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: RFValue(22),
    lineHeight: RFValue(35),
    textAlign: 'center',
    marginVertical: RFValue(20),
    color: theme.colors.tertiary,
  },
  author: {
    fontSize: theme.fonts.sizes.h6,
    marginBottom: RFValue(20),
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  cancelButton: {
    backgroundColor: theme.colors.tertiary,
  },
})
