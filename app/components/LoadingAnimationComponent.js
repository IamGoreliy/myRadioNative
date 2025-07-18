import {View, Text} from "react-native";
import {useEffect} from "react";
import Animated, {useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing} from "react-native-reanimated";
import {LoadingIcon} from "../../utils/customSvgIcon";

export const LoadingAnimationComponent = () => {
    const rotation = useSharedValue(0)

    const animationRotation = useAnimatedStyle(() => {
        return {
            transform: [{rotate: `${rotation.value * 360}deg`}],

        }
    });

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(1, {duration: 2000, easing: Easing.linear}),
            -1
        );

        return () => {
            rotation.value = 0;
        }
    }, []);


    return (
        <View>
            <Animated.View style={animationRotation}>
                <LoadingIcon size={60} color={'red'}/>
            </Animated.View>
        </View>
    )
}