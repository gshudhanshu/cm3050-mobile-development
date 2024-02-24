import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgComponent = (props) => (
  <Svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 25'
    {...props}
  >
    <Path
      fill='#4285F4'
      d='M23.65 13.233c0-.989-.081-1.71-.255-2.46H12.098v4.466h6.631c-.133 1.11-.855 2.78-2.46 3.904l-.022.15 3.572 2.766.247.025c2.273-2.1 3.583-5.187 3.583-8.85Z'
    />
    <Path
      fill='#34A853'
      d='M12.098 24.998c3.249 0 5.976-1.07 7.968-2.914l-3.797-2.942c-1.016.71-2.38 1.204-4.17 1.204-3.183 0-5.883-2.1-6.846-5l-.141.012-3.714 2.874-.049.135c1.979 3.93 6.043 6.631 10.75 6.631Z'
    />
    <Path
      fill='#FBBC05'
      d='M5.253 15.346a7.408 7.408 0 0 1-.4-2.38c0-.829.146-1.63.387-2.38l-.007-.16-3.76-2.92-.124.059a12.044 12.044 0 0 0-1.283 5.401c0 1.939.468 3.77 1.283 5.401l3.904-3.021Z'
    />
    <Path
      fill='#EB4335'
      d='M12.099 5.586c2.259 0 3.783.976 4.652 1.792l3.396-3.316c-2.086-1.939-4.8-3.128-8.048-3.128-4.706 0-8.77 2.7-10.75 6.63l3.891 3.022c.976-2.9 3.677-5 6.859-5Z'
    />
  </Svg>
)
export default SvgComponent
