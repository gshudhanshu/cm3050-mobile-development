import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgComponent = (props) => (
  <Svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 13 25'
    {...props}
  >
    <Path
      fill='#fff'
      d='M10.677 4.93h2.197V1.102c-.379-.052-1.682-.17-3.2-.17-3.168 0-5.338 1.993-5.338 5.655v3.37H.841v4.277h3.495V25h4.286V14.236h3.354l.532-4.278H8.621V7.012c0-1.236.334-2.083 2.056-2.083Z'
    />
  </Svg>
)
export default SvgComponent
