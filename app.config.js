export default {
  expo: {
    name: 'calm-mind',
    slug: 'calm-mind',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.uol.calmmind',
      // googleServicesFile: process.env.GOOGLE_SERVICES_INFOPLIST,
      googleServicesFile: './GoogleService-Info.plist',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.uol.calmmind',
      // googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      googleServicesFile: './google-services.json',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-font',
      [
        'expo-image-picker',
        {
          photosPermission:
            'The app accesses your photos to let you set profile picture.',
        },
      ],
      [
        'expo-av',
        {
          microphonePermission:
            'Allow $(PRODUCT_NAME) to access your microphone.',
        },
      ],
      '@react-native-google-signin/google-signin',
    ],
    extra: {
      eas: {
        projectId: 'bfba65c3-f136-48b2-a73f-595992ec1def',
      },
    },
    updates: {
      url: 'https://u.expo.dev/bfba65c3-f136-48b2-a73f-595992ec1def',
    },
    // runtimeVersion: {
    //   policy: 'appVersion',
    // },
    runtimeVersion: 'exposdk:50.0.11',
  },
}
