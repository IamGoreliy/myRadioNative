import {StyleSheet, TouchableOpacity, View, Text, Linking, ScrollView} from "react-native";
import {useState, useEffect, useCallback, } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Foundation from '@expo/vector-icons/Foundation';
import {createSong} from "../../utils/controlPanelBtnNew";
import ControlBtnAnimated from "./ControlBtnAnimated";
import {Image} from "expo-image";
import {startListening, stopListening} from '../../services/TrackMetadataService';
import {useUserDataContext} from "../../utils/UserDataSaveContext";
import {ShazamButton} from "./shazamBtn/ShazamButton";
import randomcolor from "randomcolor";
import Animated, {useSharedValue, useAnimatedStyle, withTiming} from "react-native-reanimated";
import {Audio, InterruptionModeAndroid} from 'expo-av';
import {BtnOption} from "./BtnCopyNameTrack";
import RecordingLiveButton from "./RecordingLiveButton";


const logoPlaceholder = require('../../assets/logoByGemini.webp');



const ButtonControl = ({
           managementFN,
           styleBtn,
           styleLabel,
           children
}) => {
    return (
        <TouchableOpacity
            onPress={managementFN}
            style={styleBtn}
        >
            <Text style={styleLabel}>
                {children}
            </Text>
        </TouchableOpacity>
    )
}

const initialStateLangData = [
    {
        countryCode: 'UA',
        appLang: {

                alert: 'радіохвиля не обрана',
                nameTrack: 'назва пісні',
                loadingTrack: 'завантаження назви пісні...',
                noTrackInfo: 'станція не має інформації про треки',
                btnGoHome: 'Перейти на домашню сторінку',
                notLoadingNameTrack: 'Не вдалось завантажити назву треку',
        }
    },
    {
        countryCode: 'USA',
        appLang: {

            alert: 'Radio wave is not chosen',
            nameTrack: 'The name of the song',
            loadingTrack: 'Loading the name of the track...',
            noTrackInfo: 'The station does not have track information',
            btnGoHome: 'Go to home page',
            notLoadingNameTrack: 'Failed to load the track name',
        }
    },
    {
        countryCode: 'RU',
        appLang: {
            alert: 'Радиоволна не выбрана',
            nameTrack: 'Название песни',
            loadingTrack: 'Загрузка названия трека...',
            noTrackInfo: 'Станция не имеет информации о треках',
            btnGoHome: 'Перейти на домашнюю страницу',
            notLoadingNameTrack: 'Не удалось загрузить название трека',
        }
    }

]



const RadioPlayerNew = ({radioWave = null, handlerNextWave, handlerPreWave, isOpenPlayer}) => {
    const [isPlay, setIsPlay] = useState(false);
    const [sound, setSound] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [waveUrl, setWaveUrl] = useState(null);
    const [controlPanelExpand, setControlPanelExpand] = useState(false);
    const [userData] = useUserDataContext();
    const [trackTitle, setTrackTitle] = useState(null);
    const startColor = useSharedValue(0);
    const [colors, setColors] = useState({
        current: 'red',
        next: randomcolor({luminosity: 'bright'})
    })

    useEffect(() => {
        isOpenPlayer();
    }, [controlPanelExpand])
    // console.log('trackTitle', trackTitle)

    useEffect(() => {
        const idChangeColorInterval = setInterval(() => {
            setColors(prevState => ({
                current: prevState.next,
                next: randomcolor({luminosity: 'bright'}),
            }))
            startColor.value = 0;
            startColor.value = withTiming(1, {duration: 2000});
        }, 2000);

        return () => {
            clearInterval(idChangeColorInterval);
        }
    }, []);

    useEffect(() => {
        if (radioWave) {
            setWaveUrl(radioWave["url_resolved"]);
            setTrackTitle(`${findLang(initialStateLangData, 'nameTrack')}...`);
        }
    }, [radioWave]);

    useEffect(() => {
        (async () => {
            try {
                await Audio.setAudioModeAsync({
                    staysActiveInBackground: true,
                    shouldDuckAndroid: true,
                    interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
                    playThroughEarpieceAndroid: false, // Убедимся, что играет через динамик, а не "ухо"
                });
            } catch (e) {
                console.error('Failed to set audio mode', e);
            }
        })();

    }, []);

    //создает из ссылки проигрыватель и как только волна будет загружена начнется воспроизведение
    useEffect(() => {
        if (!waveUrl) {
            return;
        }
        if (isPlay) {
            createSong(sound, setSound, waveUrl, setIsLoading, setIsPlay)
                .catch(e => console.error('Ошибка воспроизведения аудио:', e));

            (async () => {
                const maxAttempts = 5;
                const delay = ms => new Promise(res => setTimeout(res, ms));
                for (let i = 0; i < maxAttempts; i++) {
                    try {
                        console.log(`попытка № ${i + 1} запуск метаданных...`);
                        const res = await startListening(waveUrl, (newTitle) => {
                            setTrackTitle(newTitle);
                        });
                        if (res.hasMetadata && res.nameTrack) {
                            console.log('[Плеер] Прослушивание метаданных успешно запущено, трек получен.');
                            setTrackTitle(res.nameTrack);
                            break;
                        }
                        if (!res.hasMetadata) {
                            console.log('[Плеер] Станция не предоставляет метаданные.')
                            setTrackTitle(findLang(initialStateLangData, 'noTrackInfo'));
                            break;
                        }
                        console.log(`[Плеер] Метаданные есть, но трек пока не пришел. Ждем...`);

                    } catch (e) {
                        console.log('непридвиденная ошибка', e.message);
                    }
                    if (i === maxAttempts - 1) {
                        await delay(2000);
                    } else {
                        console.log(`[Плеер] Не удалось получить название трека после ${maxAttempts} попыток.`);
                        setTrackTitle(findLang(initialStateLangData, 'notLoadingNameTrack'));
                    }
                }
            })();
        } else {
            if(sound) {
                sound.unloadAsync();
            }
            setSound(null);
            stopListening();
            setTrackTitle('Название трека...');
        }

        return () => {
            stopListening();
        }

    }, [waveUrl, isPlay]);

    // сброс размонтирование соунда при размонтировании компонента ('при выходе из квартиры выключи свет')
    useEffect(() => {

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        }
    }, [sound]);

    const togglePlay = useCallback(() => {
        setIsPlay(prevState => !prevState);


    }, []);

    const handlerExpand = useCallback(() => {
        setControlPanelExpand(prevState => !prevState);
    }, [])

    const handlerGoHome = useCallback(async () => {
        if (radioWave?.homepage) {
            try {
                await Linking.openURL(radioWave.homepage);
            } catch (e) {
                alert('не удалось открыть сайт ')
                console.log('failed to open URL:',e)
            }
        }
    }, [radioWave?.homepage]);

    const findLang = useCallback((dataTextForSection, section) => {
        const textObjForSection = dataTextForSection.find(ele => ele.countryCode === userData.selectLanguage);
        return textObjForSection['appLang'][section];
    }, [userData.selectLanguage]);

    const AnimatedColorForControlPanel = useAnimatedStyle(() => {
        return {
            borderColor: colors.current
        }
    })


    return (
        <View style={styling.container}>
            <Animated.View
                style={[
                    styling.controlPanel,
                    controlPanelExpand && styling.controlPanelIsOpen,
                    AnimatedColorForControlPanel
                ]}
            >
                <View
                    style={[
                        styling.wrapperInfoRadioStation,
                        controlPanelExpand && styling.wrapperInfoRadioStationOnOpen,
                    ]}
                >
                    <View style={styling.wrapperLogoRadioPlayerClose}>
                        <Image
                            source={radioWave?.favicon ? {uri: radioWave.favicon} : logoPlaceholder}
                            style={[
                                styling.logoRadio,
                                controlPanelExpand && styling.logoRadioIsOpen,
                            ]}
                        />
                    </View>
                    {controlPanelExpand &&
                        <View style={styling.nameRadioStation}>
                            <ScrollView>
                                <Text style={styling.nameRadioStationLabel}>
                                    {radioWave?.name ?? findLang(initialStateLangData, 'alert')}
                                </Text>
                            </ScrollView>
                        </View>
                    }
                    {controlPanelExpand &&
                        <View
                            style={[
                                styling.wrapperTrackTitle,
                                controlPanelExpand && styling.wrapperTrackTitleOpen
                            ]}
                        >
                            <Text
                                style={[
                                    styling.trackTitle,
                                    controlPanelExpand && styling.trackTitleOpen,
                                ]}
                                // numberOfLines={1}
                            >
                                {trackTitle ?? findLang(initialStateLangData, 'loadingTrack')}
                            </Text>
                        </View>
                    }
                    {controlPanelExpand &&
                        <>
                            <TouchableOpacity
                                style={styling.goToHomeRadioBtn}
                                onPress={handlerGoHome}
                            >
                                {/*<Text>*/}
                                {/*    {findLang(initialStateLangData,'btnGoHome')}*/}
                                {/*</Text>*/}
                                <AntDesign name="home" size={34} color="balack" />
                            </TouchableOpacity>
                        </>
                    }
                </View>
                {!controlPanelExpand && <ShazamButton size={34} sx={{marginLeft: 20}} startAnimation={isPlay}/>}
                <View
                    style={[
                        styling.btnWrapper,
                        controlPanelExpand && styling.btnWrapperOpen,
                    ]}
                >
                    {controlPanelExpand && <RecordingLiveButton radioWave={radioWave}/>}
                    <ButtonControl
                        managementFN={handlerPreWave}
                        styleBtn={styling.btn()}
                        styleLabel={styling.btnLabel}
                    >
                        <AntDesign name="stepbackward" size={controlPanelExpand ? 44 : 24} color="white" />
                    </ButtonControl>
                    <ButtonControl
                        managementFN={togglePlay}
                        styleBtn={styling.btn(true)}
                        styleLabel={styling.btnLabel}
                    >
                        <ControlBtnAnimated isPlay={isPlay} isLoading={isLoading} isBig={controlPanelExpand}/>
                    </ButtonControl>
                    <ButtonControl
                        managementFN={handlerNextWave}
                        styleBtn={styling.btn(true)}
                        styleLabel={styling.btnLabel}
                    >
                        <AntDesign name="stepforward" size={controlPanelExpand ? 44 : 24} color="white" />
                    </ButtonControl>
                    {controlPanelExpand && <BtnOption nameTrack={trackTitle}/>}

                    {!controlPanelExpand &&
                        <ButtonControl
                            managementFN={handlerExpand}
                            styleBtn={styling.btnExpand}
                            styleLabel={[
                                styling.btnLabel,
                            ]}
                         >
                            <Foundation name="arrows-expand" size={24} color="white" />
                        </ButtonControl>
                    }
                </View>
                {controlPanelExpand &&
                    <>
                        <ButtonControl
                            managementFN={handlerExpand}
                            styleBtn={styling.btnExpandOpen}
                            styleLabel={styling.btnLabel}>
                                <Foundation name="arrows-compress" size={24} color="white" />
                        </ButtonControl>
                    </>
                }
            </Animated.View>
        </View>
    )
}

const styling = StyleSheet.create({
    container: {
        flex: 1,
    },
    selectStation: {
        color: 'black',
        fontSize: 44,
        textAlign: 'center',
    },
    //панель с кнопками закрыта
    controlPanel: {
        flexDirection: 'row',
        position: "absolute",
        bottom: 0,
        left: '50%',
        paddingHorizontal: 10,
        width: '100%',
        height: 55,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: "space-between",
        alignItems: 'center',
        // borderColor: '#FF4D00FF',
        borderWidth: 2,
        transform: [{
            translateX: '-50%',
        }],
    },
    //панель с копками открыта
    controlPanelIsOpen: {
        padding: 20,
        height: 600,
        flexDirection: "column",
        justifyContent: 'unset',

    },
    //обертка информации про радиостанцию в обычном состоянии
    wrapperInfoRadioStation: {
        flexDirection: 'row',
    },
    //обертка информация про радиостанцию когда панель развернута
    wrapperInfoRadioStationOnOpen: {
        flexDirection: "column",
        alignItems: "center"
    },
    //лого радиостанции
    wrapperLogoRadioPlayerClose: {
        // width: 70,
        // height: 40,
        // resizeMode: 'contain',
        backgroundColor: 'white',
    },
    logoRadio: {
        width: 70,
        height: 40,
        resizeMode: 'cover',
        objectFit: 'center'
    },
    logoRadioIsOpen: {
        width: 200,
        height: 200,
        resizeMode: 'contain'
    },
    nameRadioStation: {
        maxWidth: '100%',
        height: 100,
    },
    nameRadioStationLabel: {
        fontWeight: 700,
        fontSize: 24,
        color: 'white',
    },
    wrapperTrackTitle: {
        width: 100,
        marginLeft: 10,

    },
    wrapperTrackTitleOpen: {
        width: 300,
        padding: 10,
        flexDirection: "row",
        flexWrap: "wrap",
        marginLeft: 0,
        marginTop: 20,
        backgroundColor: 'rgb(49,100,49)',
        borderRadius: 5
    },
    trackTitle: {
        color: 'white',
    },
    trackTitleOpen: {
        fontWeight: 700,
        fontSize: 16,
    },
    btnWrapper: {
        flexDirection: 'row',
    },
    btnWrapperOpen: {
        position: "absolute",
        width: '100%',
        justifyContent: 'center',
        bottom: 20,
    },
    btn: (mr = false) => ({
        marginLeft: mr ? 25 : 0,

    }),
    btnExpand:{
        marginLeft: 25,
    },
    btnExpandOpen: {
        position: "absolute",
        top: 20,
        right: 20,
    },
    btnLabel: {

    },
    btnLabelOpen: {
        fontSize: 44
    },
    goToHomeRadioBtn: {
        marginTop: 50,
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 5,
    },
    shazamButtonOnOpenPlayer: {
        position: "absolute",
        bottom: 20,
        left: 10,
    }
})

export default RadioPlayerNew;
