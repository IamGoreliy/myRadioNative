import {StyleSheet, TouchableOpacity, View, Text} from "react-native";
import {useState, useEffect, useRef, useCallback} from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import {createSong, playOrPauseSong} from "../../utils/controlPanelBtnNew";


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


const RadioPlayerNew = ({selectCategory = 'Rock', listStation = []}) => {
    const [radioStationWillBePlay, setRadioStationWillBePlay] = useState(null);
    const [curNumRadioStationList, setCurNumRadioStationList] = useState(0);
    const [isPlay, setIsPlay] = useState(false);
    const [sound, setSound] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    console.log(listStation)

    //загрузка радиостанции которая должна буде играть
    useEffect(() => {
        if (listStation.length > 0) {
            setRadioStationWillBePlay(listStation[curNumRadioStationList]);
        }
    }, [listStation]);
    //создает из ссылки проигрыватель, но не запускает его по умолчанию
    useEffect(() => {
        if (radioStationWillBePlay) {
            createSong(sound, setSound, radioStationWillBePlay["url_resolved"])
                .catch(e => console.error(e))
        }
    }, [radioStationWillBePlay]);

    //запуск плеера
    useEffect(() => {
        if (sound) {
            console.log('test sound')
            playOrPauseSong(isPlay, sound)
                .catch(e => console.error(e))
        }

    }, [isPlay, sound])



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
                <ButtonControl
                    managementFN={preStation}
                    styleBtn={styling.btn()}
                    styleLabel={styling.btnLabel}
                >
                    <AntDesign name="stepbackward" size={44} color="black" />
                </ButtonControl>
                <ButtonControl
                    managementFN={togglePlay}
                    styleBtn={styling.btn(true)}
                    styleLabel={styling.btnLabel}
                >
                    {isPlay ? <FontAwesome5 name="pause" size={44} color="black" /> :<AntDesign name="play" size={44} color="black" />}
                </ButtonControl>
                <ButtonControl
                    managementFN={nextStation}
                    styleBtn={styling.btn(true)}
                    styleLabel={styling.btnLabel}
                >
                    <AntDesign name="stepforward" size={44} color="black" />
                </ButtonControl>
                <ButtonControl
                    managementFN={resetStation}
                    styleBtn={styling.btn(true)}
                    styleLabel={styling.btnLabel}
                >
                    <FontAwesome5 name="stop" size={44} color="black" />
                </ButtonControl>
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
        bottom: 50,
        left: '50%',
        width: 250,
        justifyContent: "center",
        transform: [{
            translateX: '-50%',
        }]
    },
    btn: (mr = false) => ({
        marginLeft: mr ? 25 : 0,


    }),
    btnLabel: {

    },
})

export default RadioPlayerNew;
