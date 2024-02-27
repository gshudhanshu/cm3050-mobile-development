import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import React, { useState } from 'react'
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

export default function HomeScreen() {
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false)

  return (
    <SafeAreaView style={GlobalStyles.safeAreaContainer}>
      <ScrollView style={{ marginBottom: RFValue(80) }}>
        <StatusBar
          barStyle='light-content'
          backgroundColor={theme.colors.primary}
        />
        <View style={[GlobalStyles.container, styles.container]}>
          <Header
            showBack={false}
            isHome={true}
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
              <TouchableOpacity>
                <FeelingEmoji1 width={RFValue(40)} />
              </TouchableOpacity>
              <TouchableOpacity>
                <FeelingEmoji2 width={RFValue(40)} />
              </TouchableOpacity>
              <TouchableOpacity>
                <FeelingEmoji3 width={RFValue(40)} />
              </TouchableOpacity>
              <TouchableOpacity>
                <FeelingEmoji4 width={RFValue(40)} />
              </TouchableOpacity>
              <TouchableOpacity>
                <FeelingEmoji5 width={RFValue(40)} />
              </TouchableOpacity>
              <TouchableOpacity>
                <FeelingEmoji6 width={RFValue(40)} />
              </TouchableOpacity>
            </View>
          </View>
          {/* Daily Quote */}
          <View style={styles.quoteContainer}>
            <View style={styles.quoteSubContainer}>
              <CText weight='light' style={styles.todayQuote}>
                Today's Quote
              </CText>
              <CText numberOfLines={1} weight='semiBold' style={styles.Quote}>
                The only way to do great work is to love what you do.
              </CText>
            </View>
            <TouchableOpacity style={[GlobalStyles.button, styles.viewButton]}>
              <CText style={[GlobalStyles.buttonText]}>View</CText>
            </TouchableOpacity>
          </View>
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
            </ScrollView>
          </View>
          {/* Trending sessions */}
          <View style={styles.container}>
            <View style={GlobalStyles.blockContainer}>
              <CText weight='semiBold' style={GlobalStyles.blockTitle}>
                Recommended
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
  },
})
