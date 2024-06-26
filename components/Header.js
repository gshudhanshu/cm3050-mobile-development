import { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Logo from '../assets/logo'
import GlobalStyles from '../utils/GlobalStyles'
import { RFValue } from 'react-native-responsive-fontsize'
import BackIcon from '../assets/back-icon'
import theme from '../utils/theme'
import CText from './common/CText'

import useAuthStore from '../store/useAuthStore'
import { getUserProfile } from '../utils/utils'

const Header = ({ showBack, title, useLogo }) => {
  const navigation = useNavigation()
  const { user, setUserProfile, profile } = useAuthStore()

  // Fetch user profile data when user ID changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.uid) {
        try {
          const profileData = await getUserProfile(user.uid)
          if (profileData?.profilePicture) {
            setUserProfile(profileData)
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
        }
      }
    }

    fetchUserProfile()
  }, [user?.uid])

  return (
    <View style={styles.headerContainer}>
      {/* Back button if showBack is true */}
      <View style={styles.iconButton}>
        {showBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
            testID='back-button'
          >
            <BackIcon
              style={styles.iconButton}
              stroke={'white'}
              strokeWidth={1}
              width={RFValue(35)}
              height={RFValue(35)}
            />
          </TouchableOpacity>
        )}
      </View>
      {/* Display logo or screen title */}
      {useLogo ? (
        <Logo style={GlobalStyles.logo} testID='logo' />
      ) : (
        <CText style={styles.screenTitle}>{title}</CText>
      )}
      {/* Profile avatar */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Profile')}
        style={styles.iconButton}
        testID='profile-avatar'
      >
        <Image
          source={{
            uri: profile?.profilePicture || 'https://placehold.co/100x100.png',
          }}
          style={[styles.avatar, styles.iconButton]}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: RFValue(10),
  },
  iconButton: {
    width: RFValue(35),
    height: RFValue(35),
  },
  backButtonText: {
    fontSize: 18,
    width: RFValue(35),
    height: RFValue(35),
  },
  screenTitle: {
    fontSize: RFValue(20),
    color: theme.colors.white,
  },
  avatar: {
    borderRadius: RFValue(50),
  },
})

export default Header
