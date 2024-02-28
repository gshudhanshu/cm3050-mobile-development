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
        fill='#EF5F1B'
        d='M10.03 51.738c11.376 1.68 22.568 1.68 33.944 0 4.032-.631 8.114-4.691 8.766-8.734 1.681-11.063 1.681-21.949 0-33.016-.652-4.038-4.734-8.098-8.766-8.733-11.38-1.673-22.568-1.673-33.944.004-4.032.634-8.118 4.694-8.77 8.733-1.681 11.063-1.681 21.95 0 33.016.652 4.039 4.734 8.099 8.766 8.734l.004-.004Z'
      />
      <Path
        fill='#8E2209'
        d='M27.162 28.826h-.065c-2.538 0-5.03 1.117-7.013 3.144-2.17 2.218-3.675 5.43-4.352 9.285a2.177 2.177 0 0 0 .475 1.778 2.161 2.161 0 0 0 1.663.775l18.256.015c.64 0 1.245-.282 1.66-.772.413-.49.59-1.136.482-1.778-1.278-7.518-5.638-12.404-11.106-12.447ZM21.366 18.87c0-2.546-.936-4.125-2.44-4.125-1.506 0-2.442 1.579-2.442 4.125 0 2.546.936 4.125 2.441 4.125s2.441-1.58 2.441-4.125ZM35.075 14.745c-1.505 0-2.441 1.579-2.441 4.125 0 2.546.936 4.125 2.44 4.125 1.505 0 2.441-1.58 2.441-4.125 0-2.546-.936-4.125-2.44-4.125Z'
      />
    </G>
    <Defs>
      <ClipPath id='a'>
        <Path fill='#fff' d='M0 0h54v53H0z' />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgComponent