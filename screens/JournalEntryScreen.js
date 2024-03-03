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

// Validation Schema using Yup
const JournalEntrySchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  date: Yup.date().required('Date is required'),
  imageUri: Yup.string().notRequired(),
})

const JournalEntryScreen = () => {
  const [showDatePicker, setShowDatePicker] = useState(false)

  const initialValues = {
    title: '',
    description: '',
    date: new Date(),
    imageUri: '',
  }

  const pickImage = async (setFieldValue) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.cancelled) {
      setFieldValue('imageUri', result.uri)
    }
  }

  const submitForm = async (values, actions) => {
    // Here, you would handle the submission of the journal entry
    console.log(values)
    // After submission, you might want to clear the form
    actions.resetForm()
  }

  return (
    <SafeAreaView style={GlobalStyles.safeAreaContainer}>
      <ScrollView>
        <StatusBar
          barStyle='light-content'
          backgroundColor={theme.colors.primary}
        />
        <View style={[GlobalStyles.container, styles.container]}>
          <Header showBack={true} useLogo={false} title='Journal Entry' />
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
                      uri: values.imageUri || 'https://placehold.it/100x100',
                    }}
                    style={styles.image}
                  />
                </TouchableOpacity>
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
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <TextInput
                    style={GlobalStyles.input}
                    value={dayjs(values.date).format('DD/MM/YYYY')}
                    placeholder='Date'
                    editable={false} // Makes the text input non-editable
                  />
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
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={GlobalStyles.button}
                >
                  <Text style={GlobalStyles.buttonText}>Submit Journal</Text>
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
    height: RFValue(120), // Adjust the height for the description input
    textAlignVertical: 'top', // Align text to the top for multiline TextInput
  },
})

export default JournalEntryScreen
