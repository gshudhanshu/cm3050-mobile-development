import React, { useEffect, useState } from 'react'
import {
  Button,
  TextInput,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native'

// https://yminamiyama.com/expo-react-native-google-signin/
// The  @react-native-google-signin/google-signin library can't be used in the Expo Go app because it requires custom native code.
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from '@react-native-google-signin/google-signin'

import { signInWithEmailAndPassword } from '@react-native-firebase/auth'
import * as yup from 'yup'
import { Formik } from 'formik'
import GlobalStyles from '../utils/GlobalStyles'
import theme from '../utils/theme'
import CText from '../components/common/CText'
// import useAuthStore from '../store/authStore';

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
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  //   useEffect(() => {
  //     GoogleSignin.configure({
  //       webClientId:
  //         '1050634579199-f32n4t0j3f4smfom4e0ef4h89q475rha.apps.googleusercontent.com',
  //     })
  //   }, [])

  const handleLogin = () => {
    // Add your login logic here
  }

  const handleGoogleLogin = () => {
    // Add your Google login logic here
  }

  const handleFacebookLogin = () => {
    // Add your Facebook login logic here
  }

  return (
    <SafeAreaView style={[GlobalStyles.container, styles.safeAreaContainer]}>
      <View>
        <CText style={styles.title}>Login Your Account</CText>
      </View>
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
            <TextInput
              style={styles.input}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              placeholder='Email'
              keyboardType='email-address'
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
            <TextInput
              style={styles.input}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              placeholder='Password'
              secureTextEntry
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
            <Button onPress={handleSubmit} title='Login' />
          </View>
        )}
      </Formik>
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
  },
  title: {
    fontSize: theme.fonts.sizes.h3,
    color: theme.colors.yellowLight,
    textAlign: 'center',
    marginVertical: 20,
  },
})

export default LoginScreen
