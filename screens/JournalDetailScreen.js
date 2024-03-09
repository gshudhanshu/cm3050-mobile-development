import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native'
import GlobalStyles from '../utils/GlobalStyles'
import theme from '../utils/theme'
import Header from '../components/Header'
import CText from '../components/common/CText'
import { useNavigation } from '@react-navigation/native'
import useJournalStore from '../store/useJournalStore'
import useAuthStore from '../store/useAuthStore'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
import { RFValue } from 'react-native-responsive-fontsize'
dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.tz.setDefault('Europe/London')

const JournalDetailScreen = ({ route }) => {
  const { deleteJournal } = useJournalStore()
  const { user } = useAuthStore()
  const { imageUrl, date, title, description, id } = route.params
  const navigation = useNavigation()

  const editJournal = () => {
    navigation.navigate('JournalEntry', {
      id,
      imageUrl,
      date,
      title,
      description,
    })
  }

  const handleDeleteJournal = async () => {
    // show alert before deleting
    Alert.alert(
      'Delete Journal',
      'Are you sure you want to delete this journal?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            await deleteJournal(user.uid, id)
            navigation.navigate('Journal')
          },
        },
      ]
    )
  }

  return (
    <SafeAreaView style={GlobalStyles.safeAreaContainer}>
      <ScrollView>
        <StatusBar
          barStyle='light-content'
          backgroundColor={theme.colors.primary}
        />
        <View style={[GlobalStyles.container, styles.container]}>
          <Header showBack={true} useLogo={false} title='Journal Details' />
          <View style={styles.journalContainer}>
            <Image
              source={{ uri: imageUrl || 'https://placehold.it/300x300' }}
              style={styles.image}
              testID='journal-image'
            />
            <CText weight='semiBold' style={styles.title}>
              {title}
            </CText>
            <CText style={styles.date}>
              {dayjs(date.seconds * 1000).format('MMMM DD, YYYY')}
            </CText>
            <CText style={styles.description}>{description}</CText>
          </View>

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[GlobalStyles.button]}
              onPress={editJournal}
              testID='edit-journal-button'
            >
              <CText style={[GlobalStyles.buttonText]}>Edit Journal</CText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[GlobalStyles.button, styles.deleteButton]}
              onPress={handleDeleteJournal}
              testID='delete-journal-button'
            >
              <CText style={[GlobalStyles.buttonText]}>Delete Journal</CText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  journalContainer: {
    marginVertical: RFValue(20),
    alignItems: 'center',
  },
  image: {
    width: RFValue(300),
    height: RFValue(300),
    borderRadius: RFValue(10),
  },
  title: {
    fontSize: theme.fonts.sizes.h3,
    color: theme.colors.white,
    marginTop: RFValue(20),
  },
  date: {
    fontSize: theme.fonts.sizes.body,
    color: theme.colors.secondary,
    marginBottom: RFValue(10),
  },
  description: {
    fontSize: theme.fonts.sizes.body * 1.2,
    color: theme.colors.white,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: RFValue(20),
    marginVertical: RFValue(20),
  },
  deleteButton: {
    backgroundColor: theme.colors.grayMedium,
  },
})

export default JournalDetailScreen
