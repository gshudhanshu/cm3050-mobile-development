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
} from 'react-native'

import * as yup from 'yup'
import { Formik } from 'formik'
import GlobalStyles from '../utils/GlobalStyles'
import theme from '../utils/theme'
import CText from '../components/common/CText'
import { useNavigation } from '@react-navigation/native'
import { auth } from '../firebase/firebase'

import FacebookIcon from '../assets/facebook-icon'
import GoogleIcon from '../assets/google-icon'
import { RFValue } from 'react-native-responsive-fontsize'
import { ScrollView } from 'react-native-gesture-handler'

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

const LoginScreen = () => {
  const navigation = useNavigation()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate('Home')
      }
    })
    return unsubscribe
  }, [])

  const handleLogin = (values) => {
    auth
      .signInWithEmailAndPassword(values.email, values.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user
        console.log('user', user)
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log('errorCode', errorCode)
        console.log('errorMessage', errorMessage)
      })
  }

  const handleGoogleLogin = () => {
    // Add your Google login logic here
  }

  const handleFacebookLogin = () => {
    // Add your Facebook login logic here
  }

  const handleForgetPassword = () => {
    navigation.navigate('ForgetPassword')
  }

  const handleSignUp = () => {
    navigation.navigate('Signup')
  }

  return (
    <SafeAreaView style={[GlobalStyles.safeAreaContainer]}>
      <KeyboardAvoidingView style={[GlobalStyles.container]}>
        <ScrollView style={styles.container}>
          <View>
            <CText style={GlobalStyles.title}>Login Your Account</CText>
          </View>
          <View style={styles.buttons}>
            <Pressable
              onPress={handleGoogleLogin}
              style={[GlobalStyles.button, styles.button, styles.googleButton]}
            >
              <GoogleIcon width={25} height={25} />
              <CText style={[GlobalStyles.buttonText, styles.buttonText]}>
                Continue with google
              </CText>
            </Pressable>
            <Pressable
              onPress={handleFacebookLogin}
              style={[
                GlobalStyles.button,
                styles.button,
                styles.facebookButton,
              ]}
            >
              <FacebookIcon width={25} height={25} />
              <CText style={[GlobalStyles.buttonText]}>
                Continue with facebook
              </CText>
            </Pressable>
          </View>
          <CText style={styles.orText}>Or Login with email</CText>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={(values) => handleLogin(values)}
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
                  <Pressable onPress={handleSubmit} style={GlobalStyles.button}>
                    <CText style={GlobalStyles.buttonText}>Login</CText>
                  </Pressable>
                  <Pressable onPress={handleForgetPassword}>
                    <CText style={styles.forgetPassword}>
                      Forget Password?
                    </CText>
                  </Pressable>
                </View>
                <View style={styles.signupContainer}>
                  <CText style={styles.forgetPassword}>
                    Don't have account?
                  </CText>
                  <Pressable onPress={handleSignUp}>
                    <CText style={styles.signupButton}>Sign Up</CText>
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
    flex: 1,
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
  signupButton: {
    color: theme.colors.secondary,
    fontSize: theme.fonts.sizes.body,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  signupContainer: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
  },
})

export default LoginScreen
