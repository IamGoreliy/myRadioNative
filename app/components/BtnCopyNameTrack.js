import {TouchableOpacity, View, Text, StyleSheet, ScrollView, Linking, Alert} from "react-native";
import {useState, useEffect} from "react";
import Animated, {useAnimatedStyle, useSharedValue, withSequence, withTiming, withDelay} from "react-native-reanimated";
import {useCallback} from "react";
import * as Clipboard from "expo-clipboard";
import {openApp, openBrows} from '../../utils/requestAnotherApp/requestAnotherApp';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import {createCustomSvg} from '../../utils/createCustomSvg'
import Fontisto from '@expo/vector-icons/Fontisto';
import {ShazamButton} from './shazamBtn/ShazamButton';
import {testGetNameTrack} from "../../utils/fetch/testGetNameTrack";

//все для спотифай
const SpotifyPackageName = 'com.spotify.music';
const SpotifyLinkOne = 'spotify:search:';
const SpotifyLinkTwo = 'https://open.spotify.com/search/';
const SpotifyLinkForDownloadApp = 'https://play.google.com/store/apps/details?id=com.spotify.music&hl=ru';

//все для эпл
const ApplePackageName = 'com.apple.android.music';
const AppleLinkOne = 'music://search?term=';
const AppleLinkTwo = 'https://music.apple.com/search?term=';
const AppleLinkForDownloadApp = 'https://play.google.com/store/apps/details?id=com.apple.android.music&hl=ru';

//все для ютуба
const YouTubePackageName = 'com.google.android.youtube';
const YouTubeLinkOne = 'https://www.youtube.com/results?search_query='; // Приложение YouTube хорошо обрабатывает веб-ссылки
const YouTubeLinkTwo = 'https://www.youtube.com/results?search_query=';
const YouTubeLinkForDownloadApp = 'https://play.google.com/store/apps/details?id=com.google.android.youtube';


const CopyNotification = ({notificationIsVisible}) => {
    const opacityValue = useSharedValue(0);

    useEffect(() => {
        if (notificationIsVisible) {
            opacityValue.value = withSequence(
                withTiming(1, {duration: 500}),
                withDelay(1000, withTiming(0, {duration: 500}))
            )
        }
    }, [notificationIsVisible]);

    const animationNotification = useAnimatedStyle(() => {
        return {
            opacity: opacityValue.value,
        }
    })

    return (
        <Animated.View style={[animationNotification, styling.wrapperNotification]}>
            <Text
                style={styling.messageNotification}
            >
                Copied!
            </Text>
        </Animated.View>
    )
}

const WindowAction = ({isOpenWindowAction, handlers = [], trackName}) => {
    const opacityValue = useSharedValue(0);

    console.log('trackName', Boolean(trackName));

    useEffect(() => {
        if (isOpenWindowAction) {
            opacityValue.value = withTiming(1, {duration: 500});
        } else {
            opacityValue.value = withTiming(0, {duration: 500});
        }
    }, [isOpenWindowAction]);

    const animationWindowAction = useAnimatedStyle(() => {
        return {
            opacity: opacityValue.value,
        }
    })

    const handlerInterpretation = useCallback(() => {
        alert('Ксожелению нет название песни. Воспользуйтеесь Shazam.');
    }, []);

    return (
        <Animated.View
            style={[animationWindowAction, styling.actionBtnContainer]}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={styling.actionBtn}
                >
                    <ShazamButton size={30} />
                </View>
                {[
                    <FontAwesome name="chrome" size={30} color={trackName ? "black" : "gray"} />,
                    <FontAwesome name="spotify" size={30} color={trackName ? "green" : "gray"}/>,
                    <Fontisto name="applemusic" size={30} color={trackName ? "red" : "gray"} />,
                    <FontAwesome name="youtube-play" size={24} color={trackName ? "red" : "gray"} />,
                    <FontAwesome5 name="copy" size={30} color={trackName ? "black" : "gray"} />
                ].map((ele, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={trackName ? handlers[index] : handlerInterpretation}
                        activeOpacity={0.8}
                        style={[styling.actionBtn, {marginTop: 12}]}
                    >
                        <Text
                            style={styling.actionBtnText}
                        >
                            {ele}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </Animated.View>
    )
}

export const BtnOption = ({nameTrack}) => {
    const [isOpenWindowAction, setIsOpenWindowAction] = useState(false);
    const [notification, setNotification] = useState({
        isVisible: false,
        text: ''
    });


    const handlerTogglerWindowAction = useCallback(() => {
        setIsOpenWindowAction(prevState => !prevState);
    }, []);

    const handlerCloseWindowAction = useCallback(() => {
        setIsOpenWindowAction(false);
    }, []);

    const openSpotify = () => openApp(nameTrack, handlerCloseWindowAction, 'Spotify', SpotifyPackageName, SpotifyLinkOne, SpotifyLinkTwo, SpotifyLinkForDownloadApp);
    const openApple = () => openApp(nameTrack, handlerCloseWindowAction, 'Apple music', ApplePackageName, AppleLinkOne, AppleLinkTwo, AppleLinkForDownloadApp);
    const openYouTube = () => openApp(nameTrack, handlerCloseWindowAction, 'YouTube', YouTubePackageName, YouTubeLinkOne, YouTubeLinkTwo, YouTubeLinkForDownloadApp);
    const openBrowser = () => openBrows(nameTrack, handlerCloseWindowAction);

    //фунцкция для копирования песни в буфер обмена
    const copying = async () => {
        if (!nameTrack || nameTrack.includes('...')) {
            return;
        }
        try {
            await Clipboard.setStringAsync(nameTrack);
            setNotification({
                isVisible: true,
                text: 'Copied!'
            })
        } catch (e) {
            console.log('не удалось скопировать', e.message);
        }
        setTimeout(() => {
            setNotification({
                isVisible: false,
                text: '',
            })
        }, 2000);
    }

    return (
        <View
            style={styling.container}
        >
            <CopyNotification notificationIsVisible={notification.isVisible}/>
            {/*<View*/}
            {/*    style={styling.wrapperNameTrack}*/}
            {/*>*/}
            {/*    <Text*/}
            {/*        style={styling.nameTrack}*/}
            {/*    >*/}
            {/*        {nameTrack}*/}
            {/*    </Text>*/}
            {/*</View>*/}
            <View style={styling.wrapperActionBtn}>
                <TouchableOpacity
                    onPress={handlerTogglerWindowAction}
                    activeOpacity={0.8}
                    style={styling.btnOpenOptions}
                >
                    <FontAwesome name="gear" size={30} color="black" />
                </TouchableOpacity>

                <WindowAction
                    isOpenWindowAction={isOpenWindowAction}
                    handlers={[openBrowser, openSpotify, openApple, openYouTube, copying,]}
                    trackName={nameTrack}
                />
            </View>
        </View>
    )
}

const styling = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 30,
        justifyContent: 'center',
        alignItems: 'center',
        width: 44,

    },
    wrapperNameTrack: {
        width: 240,
        height: '100%',
        backgroundColor: 'rgb(16,49,16)',
        borderRadius: 5,
    },
    nameTrack: {
      color: 'white',
    },
    wrapperActionBtn: {
        // borderWidth: 1,
        // borderColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnOpenOptions: {
        width: 44,
        height: 44,
        backgroundColor: 'white',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionBtnContainer: {
        position: 'absolute',
        bottom: 55,
        right: 0,
        width: 52,
        height: 175,
        backgroundColor: 'rgba(210,210,210,0.8)',
        zIndex: 2,
        borderWidth: 1,
        borderColor: 'rgb(73,73,73)',
        borderRadius: 10,
        padding: 5

    },
    actionBtn: {
        backgroundColor: 'white',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',

    },
    actionBtnText: {
        color: 'black',
        fontSize: 16,
    },
    wrapperNotification: {
        position: 'absolute',
        top: -50,
        right: 0,
        padding: 7,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    messageNotification: {
        color: 'black',
    }


})