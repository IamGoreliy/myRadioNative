import {Animated, Easing} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import {useRef, useEffect} from "react";

const ControlBtnAnimated = ({isPlay, isLoading, isBig}) => {
    const spinValue = useRef(new Animated.Value(0)).current;

    const spinOption = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    useEffect(() => {
        const spinAnimation = Animated.loop(
            Animated.timing(spinValue, {
            toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );

        if (isLoading) {
            spinAnimation.start();
        } else {
            spinAnimation.stop();
            spinValue.setValue(0);
        }
    }, [isLoading, spinValue])

    return (
        <>
            {!isPlay
                ? <AntDesign name="play" size={isBig ? 44 : 24} color="white" />
                : isLoading
                    ? <Animated.View style={{transform: [{rotate: spinOption}]}}>
                        <AntDesign name="loading2" size={isBig ? 44: 24} color="white" />
                      </Animated.View>
                    : <AntDesign name="pause" size={isBig ? 44 : 24} color="white" />
            }
        </>
    )
}

export default ControlBtnAnimated;