import {TouchableOpacity, Text, Linking, Alert, StyleSheet} from "react-native";
import Fontisto from '@expo/vector-icons/Fontisto';
import Animated, {
    useAnimatedStyle,
    withTiming,
    useSharedValue,
    withRepeat,
    Easing,
    interpolateColor
} from "react-native-reanimated";
import {useEffect, useState} from "react";
import randomcolor from 'randomcolor';
import SendIntentAndroid from "react-native-send-intent";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedShazamIconColor = Animated.createAnimatedComponent(Fontisto);

const shazamPackageName = 'com.shazam.android';
const shazamAndroidStoreUrl = 'market://details?id=com.shazam.android';

export const ShazamButton = ({size}) => {
    const startPositionRotate = useSharedValue(0);
    const colorAnimation = useSharedValue(0);
    const [colors, setColors] = useState({
        current: '#0088FF',
        next: randomcolor({luminosity: 'bright'}),
    })

    useEffect(() => {
        startPositionRotate.value = withRepeat(
            withTiming(1, {duration: 4000, easing: Easing.linear}),
            -1,
            true
        );
        const idColorInterval = setInterval(() => {
            setColors(prevState => ({
                current: prevState.next,
                next: randomcolor({luminosity: 'bright'}),
            }))
            colorAnimation.value = 0;
            colorAnimation.value = withTiming(1, {duration: 2000});
        }, 2000)
        return () => {
            clearInterval(idColorInterval);
        }
    }, []);

    const animationRotate = useAnimatedStyle(() => ({
        transform: [{rotate: `${startPositionRotate.value * 720 }deg`}],
    }))

    const animationColorShazamIcon = useAnimatedStyle(() => {
        const changeColorAnimation = interpolateColor(
            colorAnimation.value,
            [0, 1],
            [colors.current, colors.next],
        )
        return {
            color: changeColorAnimation,
        }
    })

    const handlerShazam = async () => {
        try {
            const isAppInstalled = await SendIntentAndroid.isAppInstalled(shazamPackageName);
            // console.log('isAppInstalled', isAppInstalled)
            if (isAppInstalled) {
                console.log("Shazam установлен. Открываю приложение...");
                await SendIntentAndroid.openApp(shazamPackageName, {});
            } else {
                console.log("Не удалось открыть напрямую. Скорее всего, приложение не установлено.");

                // 3. Показываем пользователю диалог для установки.
                Alert.alert(
                    'Shazam не установлен',
                    'Хотите установить Shazam, чтобы распознавать музыку?',
                    [
                        { text: 'Отмена', style: 'cancel' },
                        {
                            text: 'Установить',
                            // Открываем Google Play
                            onPress: () => Linking.openURL(shazamAndroidStoreUrl),
                        }
                    ]
                );
            }
        } catch (e) {
            console.error("Перехваченная ошибка:", e.message);
        }
        console.log('проверка шазам завершина')
    }
    return (

            <AnimatedTouchableOpacity
                onPress={handlerShazam}
                style={[styling.container(size), animationRotate]}
            >
                <AnimatedShazamIconColor name="shazam" size={size} style={animationColorShazamIcon} />
            </AnimatedTouchableOpacity>

    )
}

const styling = StyleSheet.create({
    container: (size) =>  ({
        width: size + 3,
        height: size + 3,
        justifyContent: 'center',
        alignItems: 'center',
        // borderRadius: size / 2 ,
        // borderWidth: 1,
        // borderColor: 'white'
    }),
    labelText: {
        color: 'white',
    },

})