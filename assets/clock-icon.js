import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgComponent = (props) => (
  <Svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    stroke='currentColor'
    strokeWidth={1.5}
    className='w-6 h-6'
    viewBox='0 0 24 24'
    width={24}
    height={24}
    {...props}
  >
    <Path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
    />
  </Svg>
)
export default SvgComponent
