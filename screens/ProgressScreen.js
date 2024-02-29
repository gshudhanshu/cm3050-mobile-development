import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native'
import Header from '../components/Header'
import CText from '../components/CText'
import GlobalStyles from '../utils/GlobalStyles'
import theme from '../utils/theme'
import { useNavigation } from '@react-navigation/native'
import { useContentStore } from '../store/useContentStore'

export default function ProgressScreen() {
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
            useLogo={false}
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
              {categories.map(renderCategoryCard)}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})
