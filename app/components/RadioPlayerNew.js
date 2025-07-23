import {StyleSheet, TouchableOpacity, View, Text, Linking} from "react-native";
import {useState, useEffect, useRef, useCallback, useMemo} from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import Foundation from '@expo/vector-icons/Foundation';
import {createSong} from "../../utils/controlPanelBtnNew";
import ControlBtnAnimated from "./ControlBtnAnimated";
import {Image} from "expo-image";
import {startListening, stopListening} from '../../services/TrackMetadataService';

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


const RadioPlayerNew = ({radioWave = null, handlerNextWave, handlerPreWave}) => {
    const [isPlay, setIsPlay] = useState(false);
    const [sound, setSound] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [waveUrl, setWaveUrl] = useState(null);
    const [controlPanelExpand, setControlPanelExpand] = useState(false);
    const [trackTitle, setTrackTitle] = useState('Название трека...');



    useEffect(() => {
        if (radioWave) {
            setWaveUrl(radioWave["url_resolved"]);
            setTrackTitle('Загрузка названия...')
        }
    }, [radioWave]);

    //создает из ссылки проигрыватель и как только волна будет загружена начнется воспроизведение
    useEffect(() => {
        if (!waveUrl) {
            return;
        }
        if (isPlay) {
            createSong(sound, setSound, waveUrl, setIsLoading, setIsPlay)
                .catch(e => console.error(e));

            startListening(waveUrl, (newTitle) => {
                setTrackTitle(newTitle);
            });
        } else {
            if(sound) {
                sound.unloadAsync();
            }
            setSound(null);
            stopListening();
            setTrackTitle('Название трека...')
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
    }, [radioWave?.homepage])



    return (
        <View style={styling.container}>
            <View
                style={[
                    styling.controlPanel,
                    controlPanelExpand && styling.controlPanelIsOpen,
                ]}
            >
                <View
                    style={[
                        styling.wrapperInfoRadioStation,
                        controlPanelExpand && styling.wrapperInfoRadioStationOnOpen,
                    ]}
                >
                    <Image
                        source={radioWave?.favicon ? {uri: radioWave.favicon} : logoPlaceholder}
                        style={[
                            styling.logoRadio,
                            controlPanelExpand && styling.logoRadioIsOpen,
                        ]}
                    />
                    {controlPanelExpand &&
                        <Text style={styling.nameRadioStation}>
                            {radioWave?.name ?? 'радиостанция не выбрана'}
                        </Text>
                    }
                    <Text
                        style={[
                            styling.trackTitle,
                            controlPanelExpand && styling.trackTitleOpen,
                        ]}
                        // numberOfLines={1}
                    >
                        {trackTitle}
                    </Text>
                    {controlPanelExpand &&
                        <TouchableOpacity
                            style={styling.goToHomeRadioBtn}
                            onPress={handlerGoHome}
                        >
                            <Text>
                                перейти на сайт радиостанции
                            </Text>
                        </TouchableOpacity>
                    }
                </View>
                <View
                    style={[
                        styling.btnWrapper,
                        controlPanelExpand && styling.btnWrapperOpen,
                    ]}
                >
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
                    <ButtonControl
                        managementFN={handlerExpand}
                        styleBtn={styling.btnExpandOpen}
                        styleLabel={styling.btnLabel}>
                            <Foundation name="arrows-compress" size={24} color="white" />
                    </ButtonControl>
                }
            </View>
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
        height: 50,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: "space-between",
        alignItems: 'center',
        borderColor: '#FF4D00FF',
        borderWidth: 1,
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
    logoRadio: {
        width: 100,
        height: 40,
        resizeMode: 'contain',
    },
    logoRadioIsOpen: {
        width: 200,
        height: 200,
        resizeMode: 'contain'
    },
    nameRadioStation: {
        fontWeight: 700,
        fontSize: 24,
        color: 'white',
    },
    trackTitle: {
        marginLeft: 10,
        color: 'white',
        width: 100,
    },
    trackTitleOpen: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        marginLeft: 0,
        marginTop: 20,
        fontWeight: 700,
        fontSize: 20,
        width: 300,
        backgroundColor: 'red'

    },
    btnWrapper: {
        flexDirection: 'row',
    },
    btnWrapperOpen: {
        position: "absolute",
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
    }
})

export default RadioPlayerNew;
