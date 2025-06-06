import {StyleSheet, TouchableOpacity, View, Text} from "react-native";
import {useState, useEffect, useRef, useCallback, useMemo} from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import {createSong, playOrPauseSong} from "../../utils/controlPanelBtnNew";
import ControlBtnAnimated from "./ControlBtnAnimated";
import {Image} from "expo-image";


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


const RadioPlayerNew = ({selectCategory = 'Rock', listStation = null}) => {
    const [radioStationWillBePlay, setRadioStationWillBePlay] = useState(null);
    const [curNumRadioStationList, setCurNumRadioStationList] = useState(0);
    const [isPlay, setIsPlay] = useState(false);
    const [sound, setSound] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const playOrPauseSong = useMemo(() => async (isPlay, sound) => {
        try {
            if (!sound) return;

            if (isPlay) {
                await sound.playAsync();
            } else {
                await sound.pauseAsync();
            }
        } catch (e) {
            console.error(e);
            alert('не удалось воспроизвести файл');
        }
    }, [sound, isPlay]);



    //загрузка радиостанции которая должна буде играть
    // useEffect(() => {
    //     if (listStation.length > 0) {
    //         setRadioStationWillBePlay(listStation[curNumRadioStationList]);
    //     }
    // }, [listStation, curNumRadioStationList]);
    //создает из ссылки проигрыватель, но не запускает его по умолчанию
    useEffect(() => {
        if (!listStation) return;

        createSong(sound, setSound, listStation["url_resolved"], setIsLoading)
            .catch(e => console.error(e));

    }, [listStation]);

    //запуск плеера
    useEffect(() => {
        if (sound){
            console.log(sound)
            playOrPauseSong(isPlay, sound)
                .catch(e => console.error(e));
        }
    }, [isPlay, sound]);

    //сброс размонтирование соунда при размонтировании компонента ('при выходе из квартиры выключи свет')
    useEffect(() => {

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        }
    }, [sound]);



    const togglePlay = useCallback(() => setIsPlay(!isPlay), [isPlay]);
    const nextStation = useCallback(() => {
        setCurNumRadioStationList(prevState => {
            return prevState <= listStation.length ? prevState + 1 : prevState;
        })
    }, []);
    const preStation = useCallback(() => {
        setCurNumRadioStationList(prevState => {
            return prevState > 0 ? prevState - 1 : prevState;
        })
    }, []);
    const resetStation = useCallback(() => {
        setCurNumRadioStationList(0);
    }, []);




    return (
        <View style={styling.container}>

            <View style={styling.controlPanel}>
                <View>
                    <Image
                        source={{uri: listStation?.favicon}}
                        style={{
                            width: 100,
                            height: 40,
                            borderRadius: 10,
                            resizeMode: 'contain',

                    }}
                    />
                </View>
                <View style={styling.btnWrapper}>
                    <ButtonControl
                        managementFN={preStation}
                        styleBtn={styling.btn()}
                        styleLabel={styling.btnLabel}
                    >
                        <AntDesign name="stepbackward" size={24} color="white" />
                    </ButtonControl>
                    <ButtonControl
                        managementFN={togglePlay}
                        styleBtn={styling.btn(true)}
                        styleLabel={styling.btnLabel}
                    >
                        <ControlBtnAnimated isPlay={isPlay} isLoading={isLoading}/>
                    </ButtonControl>
                    <ButtonControl
                        managementFN={nextStation}
                        styleBtn={styling.btn(true)}
                        styleLabel={styling.btnLabel}
                    >
                        <AntDesign name="stepforward" size={24} color="white" />
                    </ButtonControl>
                    <ButtonControl
                        managementFN={resetStation}
                        styleBtn={styling.btn(true)}
                        styleLabel={styling.btnLabel}
                    >
                        <FontAwesome5 name="stop" size={24} color="white" />
                    </ButtonControl>
                </View>
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
    logoStation: {

    },
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
    btnWrapper: {
        flexDirection: 'row',

    },
    btn: (mr = false) => ({
        marginLeft: mr ? 25 : 0,


    }),
    btnLabel: {

    },
})

export default RadioPlayerNew;
