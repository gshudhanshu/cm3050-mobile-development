import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  Image,
  Button,
  Alert,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  Platform,
} from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'
import * as ImagePicker from 'expo-image-picker'
import { useNavigation } from '@react-navigation/native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Picker } from '@react-native-picker/picker'

import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.tz.setDefault('Europe/London')

import useAuthStore from '../store/useAuthStore'

import { auth } from '../firebase/firebase'
import GlobalStyles from '../utils/GlobalStyles'
import theme from '../utils/theme'
import BackIcon from '../assets/back-icon'
import { RFValue } from 'react-native-responsive-fontsize'
import Header from '../components/Header'

// Validation Schema using Yup
const ProfileSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  dob: Yup.date().required('Date of Birth is required'),
  gender: Yup.string().required('Gender is required'),
})

const ProfileScreen = () => {
  const navigation = useNavigation()
  const {
    setUserProfile,
    getUserProfile,
    saveUserProfile,
    uploadProfilePicture,
  } = useAuthStore()
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    dob: new Date(),
    gender: '',
    profilePicture: '',
  })
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Fetch user profile data
  const fetchUserProfile = async () => {
    const userId = auth.currentUser.uid
    const profile = await getUserProfile(userId)
    if (profile) {
      setUserProfile(profile)
    }
    const formattedDob = dayjs(profile.dob, 'DD/MM/YYYY').toDate()
    console.log(profile.dob)
    console.log(formattedDob)
    if (profile) {
      // Set initial form values with fetched user profile data
      setInitialValues({
        ...initialValues,
        ...profile,
        dob: formattedDob || dayjs(),
      })
    }
  }

  useEffect(() => {
    // Fetch user profile data when component mounts
    fetchUserProfile()
  }, [])

  const pickImage = async (setFieldValue) => {
    // Allow user to pick an image from gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    })

    if (!result.cancelled) {
      // Upload selected image and set profile picture field value
      const imageUrl = await uploadProfilePicture(
        auth.currentUser.uid,
        result.assets[0].uri
      )
      setFieldValue('profilePicture', imageUrl)
    }
  }

  const submitForm = async (values) => {
    try {
      // Submit form data and update user profile
      const userId = auth.currentUser.uid
      const formattedDob = dayjs(values.dob).format('DD/MM/YYYY')
      await saveUserProfile(userId, { ...values, dob: formattedDob })
      Alert.alert('Profile updated successfully!')
      fetchUserProfile()
    } catch (error) {
      console.error('Failed to update profile:', error)
      Alert.alert('Failed to update profile.')
    }
  }

  return (
    <SafeAreaView style={GlobalStyles.safeAreaContainer}>
      <ScrollView>
        <StatusBar
          barStyle='light-content'
          backgroundColor={theme.colors.primary}
        />
        <View style={[GlobalStyles.container, styles.container]}>
          {/* Header component */}
          <Header
            showBack={true}
            useLogo={true}
            onAvatarPress={() => setIsSettingsModalVisible(true)}
          />
          <View style={styles.profileContainer}>
            <Formik
              initialValues={initialValues}
              validationSchema={ProfileSchema}
              enableReinitialize={true}
              onSubmit={(values) => submitForm(values)}
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
                <View style={GlobalStyles.safeAreaContainer}>
                  <View style={styles.formContainer}>
                    <TouchableOpacity
                      onPress={() => pickImage(setFieldValue)}
                      style={{ alignItems: 'center' }}
                      testID='pick-image-button'
                    >
                      <Image
                        source={{
                          uri:
                            values.profilePicture ||
                            'https://placehold.it/100x100',
                        }}
                        style={styles.image}
                      />
                    </TouchableOpacity>
                    {/* First name input */}
                    <TextInput
                      style={GlobalStyles.input}
                      onChangeText={handleChange('firstName')}
                      onBlur={handleBlur('firstName')}
                      value={values.firstName}
                      placeholder='First Name'
                      testID='first-name-input'
                    />
                    {touched.firstName && errors.firstName && (
                      <Text style={GlobalStyles.errorText}>
                        {errors.firstName}
                      </Text>
                    )}
                    {/* Last name input */}
                    <TextInput
                      style={GlobalStyles.input}
                      onChangeText={handleChange('lastName')}
                      onBlur={handleBlur('lastName')}
                      value={values.lastName}
                      placeholder='Last Name'
                      testID='last-name-input'
                    />
                    {touched.lastName && errors.lastName && (
                      <Text style={GlobalStyles.errorText}>
                        {errors.lastName}
                      </Text>
                    )}
                    {/* Date of Birth input */}
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                      <TextInput
                        style={GlobalStyles.input}
                        value={values.dob ? values.dob.toDateString() : ''}
                        placeholder='Date of Birth'
                        editable={false}
                        testID='date-picker'
                      />
                    </TouchableOpacity>

                    {showDatePicker && (
                      <DateTimePicker
                        value={values.dob || new Date()}
                        mode='date'
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, selectedDate) => {
                          setShowDatePicker(Platform.OS === 'ios')
                          setFieldValue('dob', selectedDate || values.dob)
                        }}
                      />
                    )}
                    {/* Gender picker */}
                    <Picker
                      selectedValue={values.gender}
                      onValueChange={(itemValue, itemIndex) =>
                        setFieldValue('gender', itemValue)
                      }
                      style={GlobalStyles.input}
                      testID='gender-picker'
                    >
                      <Picker.Item label='Male' value='male' />
                      <Picker.Item label='Female' value='female' />
                    </Picker>
                    {/* Submit button */}
                    <TouchableOpacity
                      onPress={handleSubmit}
                      style={GlobalStyles.button}
                      testID='submit-button'
                    >
                      <Text style={GlobalStyles.buttonText}>Save Profile</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </View>
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
    borderRadius: 100,
    marginBottom: 20,
  },

  formContainer: {
    width: '100%',
    gap: RFValue(20),
    marginVertical: RFValue(20),
  },
  profileContainer: {
    width: '100%',
  },
})

export default ProfileScreen
