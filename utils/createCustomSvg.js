import Svg, {Path} from "react-native-svg";

export const createCustomSvg = (svgPath, option) => {
    const { viewBox = '0, 0, 24, 24'} = option;

    const IconComponent = ({size = 24, color = 'black', style}) => {
       return (
           <Svg
               height={size}
               width={size}
               viewBox={viewBox}
               style={style}
           >
               {Array.isArray(svgPath)
                    ? svgPath.map((d, index) => (
                        <Path key={index} d={d} fill={color}/>
                    ))
                    : (
                        <Path d={svgPath} fill={color}/>
                    )
               }
           </Svg>
       )
    }
    IconComponent.displayName = 'SvgIcon';
    return IconComponent
}