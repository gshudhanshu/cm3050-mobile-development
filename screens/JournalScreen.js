import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import React from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import GlobalStyles from '../utils/GlobalStyles'
import theme from '../utils/theme'
import CText from '../components/common/CText'
import Header from '../components/Header'

import { useNavigation } from '@react-navigation/native'
import JournalCard from '../components/JournalCard'

export default function JournalScreen() {
  const navigation = useNavigation()
  const addNewJournal = () => {
    navigation.navigate('JournalEntry')
  }

  return (
    <SafeAreaView style={GlobalStyles.safeAreaContainer}>
      <KeyboardAvoidingView style={GlobalStyles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <StatusBar
            barStyle='light-content'
            backgroundColor={theme.colors.primary}
          />
          <Header showBack={false} useLogo={false} title={'Journal'} />
          {/* Search input */}
          <View style={styles.searchInputContainer}>
            <TextInput placeholder='Search...' style={[GlobalStyles.input]} />
          </View>
          {/* Journal cards */}
          <View style={styles.journalContainer}>
            <View style={GlobalStyles.blockContainer}>
              <CText weight='semiBold' style={GlobalStyles.blockTitle}>
                Browse by Journals
              </CText>
              <TouchableOpacity
                style={[GlobalStyles.button]}
                onPress={addNewJournal}
              >
                <CText style={[GlobalStyles.buttonText]}>Add Journal</CText>
              </TouchableOpacity>
            </View>
            <View style={styles.journalsContainer}>
              <JournalCard
                imageUri='https://firebasestorage.googleapis.com/v0/b/cm3050-calm-mind.appspot.com/o/profilePictures%2FPf7mh9mCFghKKLMfrBFj7PoWNfR2?alt=media&token=ac0988d7-6013-463b-8a01-cfb93570e267'
                date='March 3, 2024'
                title='My Journal Entry'
                description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                onButtonPress={() =>
                  navigation.navigate('JournalEntry', { journal })
                }
              />
              <JournalCard
                imageUri='https://firebasestorage.googleapis.com/v0/b/cm3050-calm-mind.appspot.com/o/profilePictures%2FPf7mh9mCFghKKLMfrBFj7PoWNfR2?alt=media&token=ac0988d7-6013-463b-8a01-cfb93570e267'
                date='March 3, 2024'
                title='My Journal Entry'
                description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                onButtonPress={() =>
                  navigation.navigate('JournalEntry', { journal })
                }
              />
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
  searchInputContainer: {
    marginVertical: RFValue(10),
  },

  journalsContainer: {
    gap: RFValue(20),
  },
})
