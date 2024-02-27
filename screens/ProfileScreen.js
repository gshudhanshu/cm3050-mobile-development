import React, { useEffect } from 'react'
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
} from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'
import * as ImagePicker from 'expo-image-picker'
import { TextInput } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import {
  uploadProfilePicture,
  saveUserProfile,
  getUserProfile,
} from '../utils/userProfileUtils'
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
  dob: Yup.string().required('Date of Birth is required'),
  gender: Yup.string().required('Gender is required'),
})

const ProfileScreen = () => {
  const navigation = useNavigation()

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = auth.currentUser.uid
      const profile = await getUserProfile(userId)
      if (profile) {
        // Assuming setFieldValue is available here to prefill the form
      }
    }

    fetchUserProfile()
  }, [])

  const pickImage = async (setFieldValue) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.cancelled) {
      const imageUrl = await uploadProfilePicture(
        auth.currentUser.uid,
        result.uri
      )
      setFieldValue('profilePicture', imageUrl)
    }
  }

  return (
    <SafeAreaView style={GlobalStyles.safeAreaContainer}>
      <ScrollView style={{ marginBottom: RFValue(80) }}>
        <StatusBar
          barStyle='light-content'
          backgroundColor={theme.colors.primary}
        />
        <View style={[GlobalStyles.container, styles.container]}>
          <Header
            showBack={true}
            isHome={true}
            avatarUrl='https://placehold.co/50x50.png'
            onAvatarPress={() => setIsSettingsModalVisible(true)}
          />
          <View style={styles.profileContainer}>
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                dob: '',
                gender: '',
                profilePicture: '',
              }}
              validationSchema={ProfileSchema}
              onSubmit={async (values) => {
                try {
                  const userId = auth.currentUser.uid
                  await saveUserProfile(userId, values)
                  Alert.alert('Profile updated successfully!')
                } catch (error) {
                  console.error('Failed to update profile:', error)
                  Alert.alert('Failed to update profile.')
                }
              }}
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
                    <Button
                      title='Pick an image from camera roll'
                      onPress={() => pickImage(setFieldValue)}
                    />
                    {values.profilePicture ? (
                      <Image
                        source={{ uri: values.profilePicture }}
                        style={styles.image}
                      />
                    ) : null}
                    <TextInput
                      style={GlobalStyles.input}
                      onChangeText={handleChange('firstName')}
                      onBlur={handleBlur('firstName')}
                      value={values.firstName}
                      placeholder='First Name'
                    />
                    {touched.firstName && errors.firstName && (
                      <Text style={styles.errorText}>{errors.firstName}</Text>
                    )}
                    <TextInput
                      style={GlobalStyles.input}
                      onChangeText={handleChange('lastName')}
                      onBlur={handleBlur('lastName')}
                      value={values.lastName}
                      placeholder='Last Name'
                    />
                    {touched.lastName && errors.lastName && (
                      <Text style={styles.errorText}>{errors.lastName}</Text>
                    )}
                    <TextInput
                      style={GlobalStyles.input}
                      onChangeText={handleChange('dob')}
                      onBlur={handleBlur('dob')}
                      value={values.dob}
                      placeholder='Date of Birth'
                    />
                    {touched.dob && errors.dob && (
                      <Text style={styles.errorText}>{errors.dob}</Text>
                    )}
                    <TextInput
                      style={GlobalStyles.input}
                      onChangeText={handleChange('gender')}
                      onBlur={handleBlur('gender')}
                      value={values.gender}
                      placeholder='Gender'
                    />
                    {touched.gender && errors.gender && (
                      <Text style={styles.errorText}>{errors.gender}</Text>
                    )}
                    <Button title='Save Profile' onPress={handleSubmit} />
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
  },
})

export default ProfileScreen
