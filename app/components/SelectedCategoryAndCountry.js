import {useEffect} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Animated, {useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing} from "react-native-reanimated";
import {useDataLangContext} from "../(tabs)/_layout";
import {getCategoryTitles} from "./language/langTabsSettings";

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
    const [dataLang] = useDataLangContext();
    return (
        <View style={styling.container}>
            <View style={styling.informationField}>
                <Text style={styling.informationText}>
                    {
                        whatListSelect === 'country'
                            ? country.name
                                ? `${country.flag} ${country.name}`
                                : dataLang[3]['headerSelectCategory']['country']
                            : category
                                ? category
                                : dataLang[3]['headerSelectCategory']['category']
                    }
                </Text>
            </View>
            <TouchableOpacity
                onPress={switchBetweenLists}
                style={styling.btn}
            >
                <AnimationIcon whatSelect={whatListSelect} color={'black'}/>
                <Text style={styling.btnLabel}>
                    {whatListSelect === 'country' ? getCategoryTitles(dataLang, 'station')['btnChange'][0] : getCategoryTitles(dataLang, 'station')['btnChange'][1]}
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
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        borderWidth: 1,
        // borderColor: 'rgb(255,103,37)',
    },
    informationField: {
        padding: 5,
        borderWidth: 2,
        borderColor: 'transparent',
        borderRadius: 5,
        backgroundColor: 'white',
    },
    informationText: {
        color: 'black',
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        borderRadius: 5,
        padding: 5,
        backgroundColor: 'white',
    },
    btnLabel: {
        color: 'black',
        marginLeft: 10,
    }
})

export default SelectedCategoryAndCountry;