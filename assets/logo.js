import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
/* SVGR has dropped some elements not supported by react-native-svg: style */
const SvgComponent = (props) => (
  <Svg
    xmlns='http://www.w3.org/2000/svg'
    xmlSpace='preserve'
    id='Layer_1'
    x={0}
    y={0}
    style={{
      enableBackground: 'new 0 0 160 38',
    }}
    viewBox='0 0 160 38'
    {...props}
  >
    <Path
      d='M6.8 13.5c.6 0 1.2.1 1.7.2.6.2 1.1.4 1.6.7l-.6 1.2c-.5-.3-1-.5-1.4-.6H6.8c-1.2 0-2.1.4-2.8 1.1-.7.7-1 1.8-1 3.2 0 1.4.3 2.5 1 3.2.6.8 1.6 1.1 2.8 1.1.9 0 1.9-.2 2.9-.7l.6 1.3c-.5.2-1.1.4-1.7.6-.6.1-1.2.2-1.8.2-1.7 0-3-.5-3.9-1.5-.9-1-1.4-2.4-1.4-4.3 0-1.2.2-2.2.6-3.1.4-.9 1-1.5 1.8-2 .8-.3 1.8-.6 2.9-.6zm10.5 8.2L16.2 25h-1.5l3.9-11.3h1.9l4 11.3H23l-1.2-3.3h-4.5zm2.2-6.4-1.7 5.1h3.6l-1.8-5.1h-.1zM36.7 25H30V13.7h1.5v10h5.2V25zm15.1-9.5c-.1.3-.3.9-.5 1.8-.3.9-.5 1.6-.7 2.2l-1.8 5.2h-1.5l-1.8-5.2c-.2-.6-.5-1.4-.7-2.2-.3-.9-.4-1.5-.5-1.7l-.5 4L43 25h-1.5L43 13.7h1.9l2 6c.1.2.1.4.2.7.1.3.2.5.3.8.3.8.4 1.4.6 1.8.1-.4.3-1 .6-1.8.1-.3.2-.6.3-.8.1-.3.2-.5.2-.7l2-6H53L54.4 25H53l-.7-5.5-.5-4zM69.2 14.3c-1-3-1.5-6-2-8.7 2.6.4 5.7 1 8.7 2C77.7 4 80.5.3 80.7 0c.2.3 3 4 4.7 7.6 3-1 6-1.5 8.7-2-.4 2.6-1 5.7-2 8.7 3.6 1.8 7.2 4.5 7.6 4.7-2.3 1.6-4.9 3.4-7.6 4.7 1 3 1.5 6 2 8.7-2.6-.4-5.7-1-8.7-2-1.8 3.6-4.5 7.2-4.7 7.6-.2-.3-3-4-4.7-7.6-3 1-6 1.5-8.7 2 .4-2.6 1-5.7 2-8.7-3.6-1.7-7.3-4.5-7.6-4.7.3-.2 4-3 7.5-4.7zM75 9.6c-1.7-.6-3.7-1-5-1.3.3 1.3.7 3.3 1.3 5 1.5-.5 2.4-.5 3.8 0-.6-1.3-.6-2.2-.1-3.7zm5.7-5.7c-1 1.5-3.8 5.9-3.8 7.7 0 1.6 2.6 4.6 3.8 5.8 1.1-1.2 3.8-4.2 3.8-5.8 0-1.8-2.8-6.2-3.8-7.7zm9.3 9.5c.6-1.7 1-3.7 1.3-5-1.3.3-3.3.7-5 1.3.5 1.5.5 2.4 0 3.8 1.3-.6 2.2-.7 3.7-.1zm5.8 5.6c-1.5-1-5.9-3.8-7.7-3.8-1.6 0-4.6 2.6-5.8 3.8 1.2 1.1 4.2 3.8 5.8 3.8 1.7 0 6.2-2.8 7.7-3.8zm-9.5 9.4c1.7.6 3.7 1 5 1.3-.3-1.3-.7-3.3-1.3-5-1.5.5-2.4.5-3.8 0 .6 1.2.6 2.1.1 3.7zm-5.6 5.7c1-1.5 3.8-5.9 3.8-7.7 0-1.6-2.7-4.7-3.8-5.8-1.1 1.2-3.8 4.2-3.8 5.8 0 1.8 2.8 6.2 3.8 7.7zm-9.4-9.5c-.6 1.7-1 3.7-1.3 5 1.3-.3 3.3-.7 5-1.3-.5-1.4-.5-2.4 0-3.8-1.2.6-2.1.7-3.7.1zm1.9-1.8c1.6 0 4.6-2.6 5.8-3.8-1.2-1.2-4.2-3.8-5.8-3.8-1.7 0-6.2 2.8-7.7 3.8 1.5 1 6 3.8 7.7 3.8zM116.7 15.5c-.1.3-.3.9-.5 1.8-.3.9-.5 1.6-.7 2.2l-1.8 5.2h-1.5l-1.8-5.2c-.2-.6-.5-1.4-.7-2.2-.3-.9-.4-1.5-.5-1.7l-.5 4-.7 5.5h-1.5l1.4-11.3h1.9l2 6c.1.2.1.4.2.7.1.3.2.5.3.8.3.8.4 1.4.6 1.8.1-.4.3-1 .6-1.8.1-.3.2-.6.3-.8.1-.3.2-.5.2-.7l2-6h1.9l1.4 11.3h-1.5l-.7-5.5-.4-4.1zm8.8-1.8h1.5V25h-1.5V13.7zm11.5 5.2c-.5-.7-1.1-1.6-1.8-2.8V25h-1.5V13.7h1.3l4.2 6c.4.6 1 1.6 1.9 2.9v-8.9h1.5V25h-1.3l-4.3-6.1zm16.1-5.2c1.8 0 3.1.5 4 1.5.9 1 1.4 2.4 1.4 4.2 0 1.8-.5 3.2-1.4 4.2-.9 1-2.3 1.5-4 1.5h-3.7V13.7h3.7zm0 9.9c1.2 0 2.2-.4 2.9-1.1.7-.7 1-1.8 1-3.2 0-1.4-.3-2.5-1-3.2-.7-.7-1.6-1.1-2.9-1.1H151v8.6h2.1z'
      className='st0'
    />
  </Svg>
)
export default SvgComponent
