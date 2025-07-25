import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import Animated , {useSharedValue, useAnimatedStyle, withTiming} from "react-native-reanimated";

export const Toggler = ({isSelect = false}) => {

    const animationToggler = useAnimatedStyle(() => ({
        transform: [{translateX: isSelect ? '100%' : '0%'}]
    }))

    return (
            <View
                style={styling.togglerWrapper(isSelect)}>
                <Animated.View
                    style={[
                        styling.toggler,
                        animationToggler
                    ]}
                />
            </View>
    )
}

const styling = StyleSheet.create({
    togglerWrapper: (isActive) => ({
        position: 'relative',
        width: 60,
        height: 30,
        backgroundColor: isActive ? 'green' : 'red',
        borderRadius: 30,
    }),
    toggler: {
        position: "absolute",
        top: 0,
        left: 0,
        width: 30,
        height: 30,
        borderRadius: '50%',
        backgroundColor: 'black',
        // overflow: "hidden",
    }
})