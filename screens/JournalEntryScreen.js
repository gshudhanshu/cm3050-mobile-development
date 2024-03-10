import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  Button,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'
import * as ImagePicker from 'expo-image-picker'
import DateTimePicker from '@react-native-community/datetimepicker'

import dayjs from 'dayjs'
import { RFValue } from 'react-native-responsive-fontsize'
import GlobalStyles from '../utils/GlobalStyles'
import theme from '../utils/theme'
import Header from '../components/Header'
import useJournalStore from '../store/useJournalStore'
import useAuthStore from '../store/useAuthStore'
import { useNavigation } from '@react-navigation/native'

// Validation Schema using Yup
const JournalEntrySchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  date: Yup.date().required('Date is required'),
  imageUrl: Yup.string().notRequired(),
})

const JournalEntryScreen = ({ route }) => {
  const navigation = useNavigation()
  const [showDatePicker, setShowDatePicker] = useState(false)
  const { addJournal, editJournal, deleteJournal } = useJournalStore()
  const { user } = useAuthStore()
  const { imageUrl, date, title, description, id } = route.params || {}
  const [loading, setLoading] = useState(false)

  const initialValues = id
    ? {
        title: title,
        description: description,
        date: date.toDate(),
        imageUri: '',
      }
    : {
        title: '',
        description: '',
        date: new Date(),
        imageUri: '',
      }

  console.log('initialValues', initialValues)

  const pickImage = async (setFieldValue) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    })

    if (!result.cancelled) {
      setFieldValue('imageUri', result.assets[0].uri)
    }
  }

  const submitForm = async (values, actions) => {
    setLoading(true)
    if (id) {
      // Editing an existing journal
      await editJournal(user.uid, id, values)
      Alert.alert('Success', 'Journal entry updated successfully.')
    } else {
      // Adding a new journal
      const newJournal = await addJournal(user.uid, values)
      Alert.alert('Success', 'Journal entry added successfully.')
    }
    navigation.navigate('Journal')
    actions.resetForm()
    setLoading(false)
  }

  return (
    <SafeAreaView style={GlobalStyles.safeAreaContainer}>
      <ScrollView>
        <StatusBar
          barStyle='light-content'
          backgroundColor={theme.colors.primary}
        />
        <View style={[GlobalStyles.container, styles.container]}>
          {/* Header */}
          <Header
            showBack={true}
            useLogo={false}
            title={id ? 'Edit Journal' : 'Journal Entry'}
          />
          {/* Formik form */}
          <Formik
            initialValues={initialValues}
            validationSchema={JournalEntrySchema}
            onSubmit={submitForm}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.formContainer}>
                <TouchableOpacity
                  onPress={() => pickImage(setFieldValue)}
                  style={{ alignItems: 'center' }}
                >
                  <Image
                    source={{
                      uri:
                        values.imageUri ||
                        imageUrl ||
                        'https://placehold.it/300x300',
                    }}
                    style={styles.image}
                  />
                </TouchableOpacity>
                {/* Title input */}
                <TextInput
                  style={GlobalStyles.input}
                  onChangeText={handleChange('title')}
                  onBlur={handleBlur('title')}
                  value={values.title}
                  placeholder='Title'
                />
                {touched.title && errors.title && (
                  <Text style={GlobalStyles.errorText}>{errors.title}</Text>
                )}
                {/* Description input */}
                <TextInput
                  style={[GlobalStyles.input, styles.descriptionInput]}
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  value={values.description}
                  placeholder='Description'
                  multiline={true}
                />
                {touched.description && errors.description && (
                  <Text style={GlobalStyles.errorText}>
                    {errors.description}
                  </Text>
                )}
                {/* Date input */}
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <TextInput
                    style={GlobalStyles.input}
                    value={dayjs(values.date).format('DD/MM/YYYY')}
                    placeholder='Date'
                    editable={false} // Makes the text input non-editable
                  />
                  {/* Date picker */}
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={values.date}
                    mode='date'
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(Platform.OS === 'ios')
                      setFieldValue('date', selectedDate || values.date)
                    }}
                  />
                )}
                {/* Submit button */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={GlobalStyles.button}
                >
                  {loading ? (
                    <ActivityIndicator size='small' color='#FFF' />
                  ) : (
                    <Text style={GlobalStyles.buttonText}>Submit Journal</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 20,
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    gap: RFValue(20),
    marginVertical: RFValue(20),
  },
  descriptionInput: {
    height: RFValue(120),
    textAlignVertical: 'top',
  },
})

export default JournalEntryScreen
