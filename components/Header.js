import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Logo from '../assets/logo'
import GlobalStyles from '../utils/GlobalStyles'
import { RFValue } from 'react-native-responsive-fontsize'
import BackIcon from '../assets/back-icon'

const Header = ({ showBack, title, isHome, avatarUrl, onAvatarPress }) => {
  const navigation = useNavigation()

  return (
    <View style={styles.headerContainer}>
      <View style={styles.iconButton}>
        {showBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
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
      {isHome ? (
        <Logo style={GlobalStyles.logo} />
      ) : (
        <Text style={styles.screenTitle}>{title}</Text>
      )}

      <TouchableOpacity onPress={onAvatarPress} style={styles.iconButton}>
        <Image
          source={{ uri: avatarUrl }}
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
    fontWeight: 'bold',
  },
  avatar: {
    borderRadius: RFValue(50),
  },
})

export default Header
