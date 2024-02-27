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
import React from 'react'
import GlobalStyles from '../utils/GlobalStyles'
import theme from '../utils/theme'
import { RFValue } from 'react-native-responsive-fontsize'
import Header from '../components/Header'
import CText from '../components/common/CText'
import CategoryCard from '../components/CategoryCard'

const categoriesData = [
  {
    id: '1',
    imageUrl:
      'https://media.istockphoto.com/id/1322220448/photo/abstract-digital-futuristic-eye.jpg?s=612x612&w=0&k=20&c=oAMmGJxyTTNW0XcttULhkp5IxfW9ZTaoVdVwI2KwK5s=',
    category: 'Meditation',
    numberOfSessions: 25,
  },
  {
    id: '2',
    imageUrl:
      'https://media.istockphoto.com/id/1322220448/photo/abstract-digital-futuristic-eye.jpg?s=612x612&w=0&k=20&c=oAMmGJxyTTNW0XcttULhkp5IxfW9ZTaoVdVwI2KwK5s=',
    category: 'Yoga',
    numberOfSessions: 15,
  },
  {
    id: '3',
    imageUrl:
      'https://media.istockphoto.com/id/1322220448/photo/abstract-digital-futuristic-eye.jpg?s=612x612&w=0&k=20&c=oAMmGJxyTTNW0XcttULhkp5IxfW9ZTaoVdVwI2KwK5s=',
    category: 'Yoga',
    numberOfSessions: 15,
  },
  {
    id: '4',
    imageUrl:
      'https://media.istockphoto.com/id/1322220448/photo/abstract-digital-futuristic-eye.jpg?s=612x612&w=0&k=20&c=oAMmGJxyTTNW0XcttULhkp5IxfW9ZTaoVdVwI2KwK5s=',
    category: 'Yoga',
    numberOfSessions: 15,
  },
  {
    id: '5',
    imageUrl:
      'https://media.istockphoto.com/id/1322220448/photo/abstract-digital-futuristic-eye.jpg?s=612x612&w=0&k=20&c=oAMmGJxyTTNW0XcttULhkp5IxfW9ZTaoVdVwI2KwK5s=',
    category: 'Yoga',
    numberOfSessions: 15,
  },
  // Add more categories as needed
]

export default function SearchScreen() {
  const renderCategoryCard = (item, index) => (
    <View
      key={item.id}
      style={[
        styles.categoryCardContainer,
        index % 2 !== 0 && styles.categoryCardRight,
      ]}
    >
      <CategoryCard
        imageUrl={item.imageUrl}
        category={item.category}
        numberOfSessions={item.numberOfSessions}
        onPress={() => {}}
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
          <Header
            showBack={false}
            isHome={false}
            title={'Search'}
            onAvatarPress={() => {}}
          />
          {/* Search input */}
          <View style={styles.searchInputContainer}>
            <TextInput placeholder='Search...' style={[GlobalStyles.input]} />
          </View>
          {/* Categories cards */}
          <View style={styles.categoriesContainer}>
            <View style={GlobalStyles.blockContainer}>
              <CText weight='semiBold' style={GlobalStyles.blockTitle}>
                Browse by category
              </CText>
            </View>
            <View style={styles.categoriesGrid}>
              {categoriesData.map(renderCategoryCard)}
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
