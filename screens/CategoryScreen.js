import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  Pressable,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  FlatList,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import GlobalStyles from '../utils/GlobalStyles'
import theme from '../utils/theme'
import { RFValue } from 'react-native-responsive-fontsize'
import Header from '../components/Header'
import CText from '../components/common/CText'
import SessionCard from '../components/SessionCard'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import useSessionStore from '../store/useSessionStore'

// const sessionsData = [
//   // imageUrl, level, title, type, duration, onPress
//   {
//     id: '1',
//     imageUrl:
//       'https://media.istockphoto.com/id/1322220448/photo/abstract-digital-futuristic-eye.jpg?s=612x612&w=0&k=20&c=oAMmGJxyTTNW0XcttULhkp5IxfW9ZTaoVdVwI2KwK5s=',
//     level: 'Beginner',
//     type: 'Guided',
//     duration: 25,
//     title: 'Meditation',
//   },
//   {
//     id: '2',
//     imageUrl:
//       'https://media.istockphoto.com/id/1322220448/photo/abstract-digital-futuristic-eye.jpg?s=612x612&w=0&k=20&c=oAMmGJxyTTNW0XcttULhkp5IxfW9ZTaoVdVwI2KwK5s=',
//     level: 'Beginner',
//     type: 'Guided',
//     duration: 25,
//     title: 'Meditation',
//   },
// ]

export default function CategoryScreen({ route }) {
  const [searchQuery, setSearchQuery] = useState('')
  const { category } = route.params
  const { fetchSessions, sessions } = useSessionStore()
  const isFocused = useIsFocused()
  const navigation = useNavigation()

  // Fetch sessions when the screen is focused or the category changes
  useEffect(() => {
    fetchSessions(category)
  }, [isFocused, category])

  // Filter sessions based on the search query
  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Render each session card
  const renderCategoryCard = (item, index) => (
    <View
      key={item.id}
      style={[
        styles.categoryCardContainer,
        index % 2 !== 0 && styles.categoryCardRight,
      ]}
    >
      {/* imageUrl, level, title, type, duration, onPress */}
      <SessionCard
        imageUrl={item.thumbnailUrl}
        level={item.level}
        title={item.title}
        type={item.type}
        duration={item.duration}
        onPress={() => navigation.navigate('Player', { session: item })}
      />
    </View>
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
          <Header showBack={true} useLogo={false} title={'Search'} />
          {/* Search input */}
          <View style={styles.searchInputContainer}>
            <TextInput
              placeholder='Search...'
              style={[GlobalStyles.input]}
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </View>
          {/* Categories cards */}
          <View style={styles.categoriesContainer}>
            <View style={GlobalStyles.blockContainer}>
              <CText weight='semiBold' style={GlobalStyles.blockTitle}>
                Browse by sessions
              </CText>
            </View>
            <View style={styles.categoriesGrid}>
              {filteredSessions.map(renderCategoryCard)}
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

  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCardContainer: {
    width: '48%',
    marginBottom: '4%',
  },
  categoryCardRight: {
    marginLeft: '4%',
  },
})
