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
      d='M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25'
    />
  </Svg>
)
export default SvgComponent
