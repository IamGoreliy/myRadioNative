import {useEffect} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing} from "react-native-reanimated";

const AnimationIcon = ({whatSelect, size = 24, color = 'black'}) => {
    const rotate = useSharedValue(0);
    const rotateAnimation = useAnimatedStyle(() => {
        return {
            transform: [{
                rotate: `${rotate.value * 180}deg`
            }],
        }
    })

    useEffect(() => {
        rotate.value = withRepeat(
            withTiming(-1, {duration: 500, easing: Easing.linear}),
            1
        );

        return () => {
            rotate.value = 0;
        }
    }, [whatSelect]);


    return (
        <Animated.View style={rotateAnimation}>
            <MaterialIcons name="change-circle" size={size} color={color} />
        </Animated.View>
    )
}


const SelectedCategoryAndCountry = ({country, category, switchBetweenLists, whatListSelect}) => {

    return (
        <View style={styling.container}>
            <View>
                <Text style={styling.informationText}>
                    {
                        whatListSelect === 'country'
                            ? country.name
                                ? `${country.flag} ${country.name}`
                                : 'страна не выбрана'
                            : category
                                ? category
                                : 'категория не выбрана'
                    }
                </Text>
            </View>
            <TouchableOpacity
                onPress={switchBetweenLists}
                style={styling.btn}
            >
                <AnimationIcon whatSelect={whatListSelect} color={'white'}/>
                <Text style={styling.btnLabel}>
                    {whatListSelect === 'country' ? 'category' : 'country'}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styling = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        height: 60,
        backgroundColor: 'black',
        borderWidth: 1,
        borderColor: 'rgb(255,103,37)',
    },
    informationField: {

    },
    informationText: {
        color: 'white'
    },
    btn: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 5,
        padding: 5
    },
    btnLabel: {
        color: 'white'
    }
})

export default SelectedCategoryAndCountry;