import React, { useEffect, useState } from 'react'
import {
  Button,
  TextInput,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native'

import * as yup from 'yup'
import { Formik } from 'formik'
import GlobalStyles from '../utils/GlobalStyles'
import theme from '../utils/theme'
import CText from '../components/common/CText'
import { useNavigation } from '@react-navigation/native'

import { db } from '../firebase/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

import FacebookIcon from '../assets/facebook-icon'
import GoogleIcon from '../assets/google-icon'
import { RFValue } from 'react-native-responsive-fontsize'

// Schema for form validation using Yup
const signupSchema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

const SignupScreen = () => {
  const navigation = useNavigation()
  const [signUpError, setSignUpError] = useState('')

  // Initialize auth here to use throughout the component
  const auth = getAuth()

  // Effect to navigate to Home screen if user is already authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate('Home')
      }
    })
    return unsubscribe
  }, [])

  // Navigate to login screen
  const handleLogin = (values) => {
    navigation.navigate('Login')
  }

  const handleGoogleLogin = () => {}

  const handleFacebookLogin = () => {}

  // Navigate to forget password screen
  const handleForgetPassword = () => {
    navigation.navigate('ForgetPassword')
  }

  // Submit form data for signup
  const handleSubmit = async (values) => {
    const { email, password, firstName, lastName } = values

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = userCredential.user

      // After successful signup, save additional user details in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
      })

      user.firstName = firstName
      user.lastName = lastName

      // Navigate to the Home screen or wherever you need
      console.log('User created and additional details saved in Firestore.')
      navigation.navigate('Home')
    } catch (error) {
      const errorCode = error.code
      const errorMessage = error.message
      // Display error message
      setSignUpError(errorMessage)
      console.error(errorCode, errorMessage)
    }
  }

  return (
    <SafeAreaView style={[GlobalStyles.safeAreaContainer]}>
      <KeyboardAvoidingView style={[GlobalStyles.container]}>
        <ScrollView style={styles.container}>
          <View>
            <CText style={GlobalStyles.title}>Create Your Account</CText>
          </View>
          <View style={styles.buttons}>
            {/* Google login button */}
            <Pressable
              onPress={handleGoogleLogin}
              style={[GlobalStyles.button, styles.button, styles.googleButton]}
              disabled={true}
            >
              <GoogleIcon width={25} height={25} />
              <CText style={[GlobalStyles.buttonText, styles.buttonText]}>
                Continue with google
              </CText>
            </Pressable>
            {/* Facebook login button */}
            <Pressable
              onPress={handleFacebookLogin}
              style={[
                GlobalStyles.button,
                styles.button,
                styles.facebookButton,
              ]}
              disabled={true}
            >
              <FacebookIcon width={25} height={25} />
              <CText style={[GlobalStyles.buttonText]}>
                Continue with facebook
              </CText>
            </Pressable>
          </View>
          {/* Signup with email */}
          <CText style={styles.orText}>Or Signup with email</CText>
          {/* Formik form for signup */}
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
            }}
            validationSchema={signupSchema}
            onSubmit={(values) => handleSubmit(values)}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.container}>
                <View style={styles.container}>
                  {/* First name input */}
                  <TextInput
                    style={GlobalStyles.input}
                    onChangeText={handleChange('firstName')}
                    onBlur={handleBlur('firstName')}
                    value={values.firstName}
                    placeholder='First Name'
                    keyboardType='default'
                  />
                  {touched.firstName && errors.firstName && (
                    <CText style={GlobalStyles.errorText}>
                      {errors.firstName}
                    </CText>
                  )}
                  {/* Last name input */}
                  <TextInput
                    style={GlobalStyles.input}
                    onChangeText={handleChange('lastName')}
                    onBlur={handleBlur('lastName')}
                    value={values.lastName}
                    placeholder='Last Name'
                    keyboardType='default'
                  />
                  {touched.lastName && errors.lastName && (
                    <CText style={GlobalStyles.errorText}>
                      {errors.lastName}
                    </CText>
                  )}
                  {/* Email input */}
                  <TextInput
                    style={GlobalStyles.input}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    placeholder='Email'
                    keyboardType='email-address'
                  />
                  {touched.email && errors.email && (
                    <CText style={GlobalStyles.errorText}>{errors.email}</CText>
                  )}
                  {/* Password input */}
                  <TextInput
                    style={GlobalStyles.input}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    placeholder='Password'
                    secureTextEntry
                  />
                  {touched.password && errors.password && (
                    <CText style={GlobalStyles.errorText}>
                      {errors.password}
                    </CText>
                  )}
                  {/* Display signup error */}
                  {signUpError && (
                    <CText style={GlobalStyles.errorText}>{signUpError}</CText>
                  )}
                  {/* Submit button */}
                  <Pressable
                    onPress={handleSubmit}
                    style={GlobalStyles.button}
                    testID='signup-button'
                  >
                    <CText style={GlobalStyles.buttonText}>Sign Up</CText>
                  </Pressable>
                </View>
                {/* Navigation to login screen */}
                <View style={styles.loginContainer}>
                  <CText style={styles.forgetPassword}>
                    Already have an account?
                  </CText>
                  <Pressable onPress={handleLogin} testID='login-button'>
                    <CText style={styles.loginButton}>Login</CText>
                  </Pressable>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    overflow: 'hidden',
  },
  container: {
    // flex: 1,
    width: '100%',
    gap: 20,
  },

  buttons: {
    gap: RFValue(15),
    width: '100%',
  },

  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  googleButton: {
    backgroundColor: '#F0F0F0',
  },
  buttonText: {
    color: '#3F414E',
  },
  facebookButton: {
    backgroundColor: '#316FF6',
  },
  orText: {
    textAlign: 'center',
    color: theme.colors.grayMedium,
    fontSize: theme.fonts.sizes.body,
    marginVertical: RFValue(30),
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  forgetPassword: {
    textAlign: 'center',
    color: theme.colors.grayMedium,
    fontSize: theme.fonts.sizes.body,
  },
  loginButton: {
    color: theme.colors.secondary,
    fontSize: theme.fonts.sizes.body,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  loginContainer: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
  },
})

export default SignupScreen
