import {StyleSheet, TouchableOpacity, View, Text} from "react-native";
import {useState, useEffect, useRef, useCallback, useMemo} from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import {createSong} from "../../utils/controlPanelBtnNew";
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


const RadioPlayerNew = ({radioWave = null, handlerNextWave, handlerPreWave}) => {
    const [isPlay, setIsPlay] = useState(false);
    const [sound, setSound] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [waveUrl, setWaveUrl] = useState(null);



    useEffect(() => {
        if (radioWave) {
            setWaveUrl(radioWave["url_resolved"]);
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
        } else {
            if(sound) {
                sound.unloadAsync();
            }
            setSound(null);
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

    const resetBtn = useCallback(() => {
        sound?.unloadAsync();
        setIsPlay(false);
        setSound(null);
    }, [])



    return (
        <View style={styling.container}>

            <View style={styling.controlPanel}>
                <View>
                    <Image
                        source={{uri: radioWave?.favicon}}
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
                        managementFN={handlerPreWave}
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
                        managementFN={handlerNextWave}
                        styleBtn={styling.btn(true)}
                        styleLabel={styling.btnLabel}
                    >
                        <AntDesign name="stepforward" size={24} color="white" />
                    </ButtonControl>
                    {/*<ButtonControl*/}
                    {/*    managementFN={resetBtn}*/}
                    {/*    styleBtn={styling.btn(true)}*/}
                    {/*    styleLabel={styling.btnLabel}*/}
                    {/*>*/}
                    {/*    <FontAwesome5 name="stop" size={24} color="white" />*/}
                    {/*</ButtonControl>*/}
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
