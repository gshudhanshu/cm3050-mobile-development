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

import {
  uploadProfilePicture,
  saveUserProfile,
  getUserProfile,
} from '../utils/userProfileUtils'
import useAuthStore from '../store/useAuthStore'

import { auth } from '../firebase/firebase' // Adjust import paths as necessary
import GlobalStyles from '../utils/GlobalStyles'
import theme from '../utils/theme'
import BackIcon from '../assets/back-icon' // Ensure you have a BackIcon component or image
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
  const { setUserProfile } = useAuthStore()
  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    dob: new Date(),
    gender: '',
    profilePicture: '',
  })
  const [showDatePicker, setShowDatePicker] = useState(false)

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
      setInitialValues({
        ...initialValues,
        ...profile,
        dob: formattedDob || dayjs(),
      })
    }
  }

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const pickImage = async (setFieldValue) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    })

    if (!result.cancelled) {
      const imageUrl = await uploadProfilePicture(
        auth.currentUser.uid,
        result.assets[0].uri
      )
      setFieldValue('profilePicture', imageUrl)
    }
  }

  const submitForm = async (values) => {
    try {
      console.log('values:', values)
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
          <Header
            showBack={true}
            isHome={true}
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
                  <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <BackIcon style={styles.backIcon} />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.formContainer}>
                    <TouchableOpacity onPress={() => pickImage(setFieldValue)}>
                      <Image
                        source={{
                          uri:
                            values.profilePicture ||
                            'https://placehold.it/100x100',
                        }}
                        style={styles.image}
                      />
                    </TouchableOpacity>

                    <TextInput
                      style={GlobalStyles.input}
                      onChangeText={handleChange('firstName')}
                      onBlur={handleBlur('firstName')}
                      value={values.firstName}
                      placeholder='First Name'
                    />
                    {touched.firstName && errors.firstName && (
                      <Text style={GlobalStyles.errorText}>
                        {errors.firstName}
                      </Text>
                    )}
                    <TextInput
                      style={GlobalStyles.input}
                      onChangeText={handleChange('lastName')}
                      onBlur={handleBlur('lastName')}
                      value={values.lastName}
                      placeholder='Last Name'
                    />
                    {touched.lastName && errors.lastName && (
                      <Text style={GlobalStyles.errorText}>
                        {errors.lastName}
                      </Text>
                    )}
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                      <TextInput
                        style={GlobalStyles.input}
                        value={values.dob ? values.dob.toDateString() : ''}
                        placeholder='Date of Birth'
                        editable={false} // Makes the text input non-editable
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

                    <Picker
                      selectedValue={values.gender}
                      onValueChange={(itemValue, itemIndex) =>
                        setFieldValue('gender', itemValue)
                      }
                      style={GlobalStyles.input}
                    >
                      <Picker.Item label='Male' value='male' />
                      <Picker.Item label='Female' value='female' />
                      {/* Add more genders as needed */}
                    </Picker>
                    <TouchableOpacity
                      onPress={handleSubmit}
                      style={GlobalStyles.button}
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

  return (
    <View style={styles.container}>
      <Button title='Pick an image from camera roll' onPress={pickImage} />
      {profileData.profilePicture ? (
        <Image
          source={{ uri: profileData.profilePicture }}
          style={styles.image}
        />
      ) : null}
      <TextInput
        style={styles.input}
        placeholder='First Name'
        value={profileData.firstName}
        onChangeText={(text) =>
          setProfileData({ ...profileData, firstName: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder='Last Name'
        value={profileData.lastName}
        onChangeText={(text) =>
          setProfileData({ ...profileData, lastName: text })
        }
      />
      <TextInput
        style={styles.input}
        placeholder='Date of Birth'
        value={profileData.dob}
        onChangeText={(text) => setProfileData({ ...profileData, dob: text })}
      />
      <TextInput
        style={styles.input}
        placeholder='Gender'
        value={profileData.gender}
        onChangeText={(text) =>
          setProfileData({ ...profileData, gender: text })
        }
      />
      <Button title='Save Profile' onPress={handleSaveProfile} />
    </View>
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
  },
  profileContainer: {
    width: '100%',
  },
})

export default ProfileScreen
