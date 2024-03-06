import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgComponent = (props) => (
  <Svg
    xmlns='http://www.w3.org/2000/svg'
    width={54}
    height={53}
    viewBox='0 0 54 53'
    fill='none'
    {...props}
  >
    <G clipPath='url(#a)'>
      <Path
        fill={props.gray ? '#91a79c' : '#64D49D'}
        d='M9.844 51.738c11.165 1.68 22.147 1.68 33.316 0 3.957-.631 7.964-4.691 8.603-8.734 1.65-11.063 1.65-21.949 0-33.016-.64-4.038-4.646-8.098-8.603-8.733C31.99-.418 21.01-.418 9.844 1.259c-3.958.634-7.968 4.694-8.607 8.733-1.65 11.063-1.65 21.95 0 33.016.64 4.039 4.646 8.099 8.603 8.734l.004-.004Z'
      />
      <Path
        fill={props.gray ? '#2f4438' : '#066D32'}
        d='M35.612 28.883c-.523 1.67-1.706 3.073-3.42 4.054-1.636.933-3.7 1.45-5.812 1.45h-.046c-2.074-.012-4.081-.524-5.65-1.447-1.64-.966-2.777-2.362-3.286-4.042l-.438-1.442-3.124.988.439 1.442c1.438 4.734 6.169 7.81 12.052 7.84h.067c2.657 0 5.286-.668 7.402-1.876 2.449-1.399 4.155-3.458 4.936-5.946l.453-1.439-3.117-1.017-.452 1.439-.004-.004ZM18.575 22.995c1.477 0 2.395-1.58 2.395-4.125 0-2.546-.918-4.125-2.395-4.125-1.477 0-2.396 1.579-2.396 4.125 0 2.546.919 4.125 2.396 4.125ZM34.425 22.995c1.477 0 2.396-1.58 2.396-4.125 0-2.546-.919-4.125-2.396-4.125-1.476 0-2.395 1.579-2.395 4.125 0 2.546.919 4.125 2.395 4.125Z'
      />
    </G>
    <Defs>
      <ClipPath id='a'>
        <Path fill='#fff' d='M0 0h53v53H0z' />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgComponent
