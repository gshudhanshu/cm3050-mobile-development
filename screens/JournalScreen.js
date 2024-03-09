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
import React, { useEffect, useState } from 'react'
import { RFValue } from 'react-native-responsive-fontsize'
import GlobalStyles from '../utils/GlobalStyles'
import theme from '../utils/theme'
import CText from '../components/common/CText'
import Header from '../components/Header'

import { useNavigation } from '@react-navigation/native'
import useJournalStore from '../store/useJournalStore'
import useAuthStore from '../store/useAuthStore'
import JournalCard from '../components/JournalCard'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.tz.setDefault('Europe/London')

export default function JournalScreen() {
  const { journals, fetchJournals } = useJournalStore()
  const { user } = useAuthStore()
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Fetch journals when user changes
    if (user?.uid) {
      fetchJournals(user.uid)
    }
  }, [user?.uid, fetchJournals])

  const addNewJournal = () => {
    // Navigate to Journal Entry screen
    navigation.navigate('JournalEntry')
  }

  // Filter journals based on the search query
  const filteredJournals = journals.filter(
    (journal) =>
      journal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journal.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <SafeAreaView style={GlobalStyles.safeAreaContainer}>
      <KeyboardAvoidingView style={GlobalStyles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <StatusBar
            barStyle='light-content'
            backgroundColor={theme.colors.primary}
          />
          {/* Header */}
          <Header showBack={false} useLogo={false} title={'Journal'} />
          {/* Search input */}
          <View style={styles.searchInputContainer}>
            <TextInput
              placeholder='Search...'
              style={[GlobalStyles.input]}
              onChangeText={setSearchQuery}
              value={searchQuery}
            />
          </View>
          {/* Journal cards */}
          <View style={styles.journalContainer}>
            <View style={GlobalStyles.blockContainer}>
              <CText weight='semiBold' style={GlobalStyles.blockTitle}>
                Browse by Journals
              </CText>
              {/* Add Journal button */}
              <TouchableOpacity
                style={[GlobalStyles.button]}
                onPress={addNewJournal}
              >
                <CText style={[GlobalStyles.buttonText]}>Add Journal</CText>
              </TouchableOpacity>
            </View>
            {/* Render each journal card */}
            <View style={styles.journalsContainer}>
              {filteredJournals.map((journal) => (
                <JournalCard
                  key={journal.id}
                  imageUri={journal.imageUrl || 'https://placehold.it/300x300'}
                  date={dayjs(journal.createdAt).format('MMMM DD, YYYY')}
                  title={journal.title}
                  description={journal.description}
                  onButtonPress={() =>
                    navigation.navigate('JournalDetail', {
                      ...journal,
                    })
                  }
                />
              ))}
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
