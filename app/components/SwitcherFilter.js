import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {useCallback, useState} from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import {useUserDataContext} from "../../utils/UserDataSaveContext";
export const SwitcherFilter = ({styleMain}) => {
    const [userData, setUserData] = useUserDataContext();
    const [isActive, setIsActive] = useState(userData.switcher !== 'country');
    const togglerIsActive = useSharedValue(isActive);

    const moveToggler = useCallback(() => {
        if (togglerIsActive.value) {
            togglerIsActive.value = false;
            setIsActive(false);
            setUserData(prevState => ({
                ...prevState,
                switcher: 'country',
            }))
        } else {
            togglerIsActive.value = true;
            setIsActive(true);
            setUserData(prevState => ({
                ...prevState,
                switcher: 'category',
            }))
        }
    }, []);

    const togglerAnimated = useAnimatedStyle(() => ({
        transform: [{
            translateX: withTiming(togglerIsActive.value ? '115%' : '0%', {duration: 250})
        }],
        backgroundColor: 'white',
    }));

    const changeBackgroundColorBtn = useAnimatedStyle(() => ({
        backgroundColor: withTiming(togglerIsActive.value ? 'rgba(129, 255, 108, 1)' : 'white'),
    }));

    return (
        <View
            style={styleMain}
        >
            <TouchableOpacity
                onPress={moveToggler}
            >
                <Animated.View
                    style={[styling.switcherMain, changeBackgroundColorBtn]}
                >
                    <Animated.View style={[styling.toggler, togglerAnimated]}>
                        <Text>
                            {isActive
                                ? <FontAwesome name="flag-o" size={23} color="black" />
                                : <Fontisto name="applemusic" size={28} color="red" />
                            }
                        </Text>
                    </Animated.View>
                </Animated.View>
            </TouchableOpacity>
        </View>
    )
}

const styling = StyleSheet.create({
    switcherMain: {
        position: "relative",
        width: 60,
        height: 30,
        padding: 1,
        // backgroundColor: 'black',
        // borderWidth: 1,
        borderRadius: 20,
    },
    toggler: {
        position: "absolute",
        top: 1,
        justifyContent: "center",
        alignItems: "center",
        width: 28,
        height: 28,
        borderRadius: '50%',
        backgroundColor: 'black',
        overflow: "hidden",
        borderWidth: 1,
        borderColor: 'black',
    },
    wrapperIcon: {

    }
})