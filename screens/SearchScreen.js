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

export default function SearchScreen() {
  return (
    <SafeAreaView style={GlobalStyles.safeAreaContainer}>
      <KeyboardAvoidingView style={styles.container}>
        <ScrollView style={{ marginBottom: RFValue(80) }}>
          <StatusBar
            barStyle='light-content'
            backgroundColor={theme.colors.primary}
          />
          <View style={[GlobalStyles.container, styles.container]}>
            <Header
              showBack={false}
              isHome={false}
              avatarUrl='https://placehold.co/50x50.png'
              title={'Search'}
              onAvatarPress={() => setIsSettingsModalVisible(true)}
            />
            {/* Search input */}
            <View style={styles.searchInputContainer}>
              <TextInput
                placeholder='Search...'
                style={[GlobalStyles.input]}
              ></TextInput>
            </View>
            {/* Categories cards */}
            <View style={styles.categoriesContainer}>
              <View style={GlobalStyles.blockContainer}>
                <CText weight='semiBold' style={GlobalStyles.blockTitle}>
                  Browse all categories
                </CText>
                {/* <CText style={GlobalStyles.blockSubTitle}>25 sessions</CText> */}
              </View>
              <View style={styles.categories}>
                <CategoryCard
                  imageUrl={
                    'https://media.istockphoto.com/id/1322220448/photo/abstract-digital-futuristic-eye.jpg?s=612x612&w=0&k=20&c=oAMmGJxyTTNW0XcttULhkp5IxfW9ZTaoVdVwI2KwK5s='
                  }
                  category={'Meditation'}
                  numberOfSessions={25}
                  onPress={() => {}}
                />
                <CategoryCard
                  imageUrl={
                    'https://media.istockphoto.com/id/1322220448/photo/abstract-digital-futuristic-eye.jpg?s=612x612&w=0&k=20&c=oAMmGJxyTTNW0XcttULhkp5IxfW9ZTaoVdVwI2KwK5s='
                  }
                  category={'Meditation'}
                  numberOfSessions={25}
                  onPress={() => {}}
                />
                <CategoryCard
                  imageUrl={
                    'https://media.istockphoto.com/id/1322220448/photo/abstract-digital-futuristic-eye.jpg?s=612x612&w=0&k=20&c=oAMmGJxyTTNW0XcttULhkp5IxfW9ZTaoVdVwI2KwK5s='
                  }
                  category={'Meditation'}
                  numberOfSessions={25}
                  onPress={() => {}}
                />
                <CategoryCard
                  imageUrl={
                    'https://media.istockphoto.com/id/1322220448/photo/abstract-digital-futuristic-eye.jpg?s=612x612&w=0&k=20&c=oAMmGJxyTTNW0XcttULhkp5IxfW9ZTaoVdVwI2KwK5s='
                  }
                  category={'Meditation'}
                  numberOfSessions={25}
                  onPress={() => {}}
                />
              </View>
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
  searchInputContainer: {
    marginHorizontal: RFValue(20),
    marginVertical: RFValue(10),
    width: '100%',
  },
  categoriesContainer: {
    width: '100%',
  },
  categories: {
    gap: RFValue(20),
  },
})
