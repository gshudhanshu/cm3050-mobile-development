import renderer from 'react-test-renderer'
import App from './App'

// import '@react-navigation/stack'
// import 'react-native-gesture-handler'
import 'react-native-gifted-charts'

// jest.mock('@react-navigation/stack', () => {
//   return {
//     createStackNavigator: jest.fn(),
//   }
// })

// jest.mock('react-native-gesture-handler', () => {
//   return {
//     ScrollView: {},
//   }
// })

jest.mock('react-native-gifted-charts', () => {
  return {
    PieChart: jest.fn(),
    BarChart: jest.fn(),
  }
})

describe('App', () => {
  it('renders correctly', () => {
    renderer.create(<App />)
  })
})
