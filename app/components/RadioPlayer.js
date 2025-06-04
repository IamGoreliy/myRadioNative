import {TouchableOpacity, View, Text, StyleSheet, Animated, Easing} from "react-native";
import {Image} from "expo-image";
import {useState, useEffect, useRef, useCallback} from "react";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import {playRadio, togglePlayRadio} from "../../utils/controlPanelBtn";

const testRadioUrl = 'https://s6-webradio.rockantenne.de/alternative/stream/mp3';
const testRadioUrlArrow = {
    url: 'http://stream.gal.io/arrow',
    logoStation: "https://www.arrow.nl/wp-content/uploads/2020/08/logo.png",
}


const RadioPlayer = ({selectCategory = 'Rock', listStation = []}) => {
    const [currentStation, setCurrentStation] = useState(null);
    const [currentNumberInTheListOfStations, setCurrentNumberInTheListOfStations] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const spinValue = useRef(new Animated.Value(0)).current;
    const [autoPlay, setAutoPlay] = useState(false);
    const [reset, setReset] = useState(false);


    useEffect(() => {
        if (listStation.length > 0) {
            setCurrentStation(listStation[currentNumberInTheListOfStations]);
        }
    }, [listStation, currentNumberInTheListOfStations]);

    useEffect(() => {
        if (autoPlay) {
            playRadio(currentStation["url_resolved"], isPlaying, setIsPlaying, sound, setSound, setIsLoading)
                .catch(error => console.error(error))
                .finally(() => setAutoPlay(false));
        }
    }, [autoPlay]);

    // параметры для анимации загрузки
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    useEffect(() => {
        const spinAnimation = Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true
            })
        );
        if (isLoading) {
            spinAnimation.start();
        } else {
            spinAnimation.stop();
            spinValue.setValue(0);
        }
    }, [isLoading, spinValue]);

    //при размонтировании компонента размонтируем sound если он есть.
    useEffect(() => {
        if (sound) {
            //слушатель конца проигрывания(если радиостанция прекратила вещание)
            sound.setOnPlaybackStatusUpdate((status) => {
                if (status.didJustFinish) {
                    setIsPlaying(false);
                    setSound(null);
                }
            });
        }

        if (reset) {
            setIsPlaying(false);
            setReset(false);
        }

        return () => {
            if (sound) {
                sound.unloadAsync();
                sound.setOnPlaybackStatusUpdate(null);
            }
        }
    }, [sound, reset]);

    const nextStation = useCallback(() => {
        if (isPlaying) {
            setIsPlaying(false);

            setCurrentNumberInTheListOfStations(
                prevState =>
                    prevState <= listStation.length + 1 ? prevState + 1 : prevState
            );
            setAutoPlay(true);
        } else {
            setCurrentNumberInTheListOfStations(
                prevState =>
                    prevState <= listStation.length + 1 ? prevState + 1 : prevState
            );
        }
    }, [isPlaying]);

    const preStation = useCallback(() => {
        if (isPlaying) {
            setIsPlaying(false);

            setCurrentNumberInTheListOfStations(
                prevState =>
                    prevState > 0 ? prevState - 1 : prevState
            );
            setAutoPlay(true);
        } else {
            setCurrentNumberInTheListOfStations(
                prevState =>
                    prevState > 0 ? prevState - 1 : prevState
            );
        }
    }, [isPlaying]);

    const resetStation = useCallback(() => {

        setCurrentNumberInTheListOfStations(0);
        setReset(true)
    }, []);



    return (
        <View style={stylingComponent.container}>
            <View>
                <Text style={stylingComponent.selectStation}>
                    {selectCategory}
                </Text>
                <Image
                    source={{uri: currentStation?.favicon}}
                    style={{width: '100%', height: 100, resizeMode: 'contain'}}
                />
                <Text style={stylingComponent.selectStation}>
                    {currentStation?.name}
                </Text>
            </View>
            <View style={stylingComponent.controlPanel}>
                <TouchableOpacity
                    onPress={preStation}
                    style={stylingComponent.btn()}
                >
                    <AntDesign name="stepbackward" size={44} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => togglePlayRadio(currentStation["url_resolved"], [isPlaying, setIsPlaying, sound, setSound, setIsLoading])}
                    style={stylingComponent.btn(true)}
                >
                    {isPlaying
                        ? <FontAwesome5 name="pause" size={44} color="black"/>
                        : isLoading
                            ? <Animated.View style={{transform: [{rotate: spin}]}}>
                                  <AntDesign name="loading1" size={44} color="black"/>
                              </Animated.View>
                            : <FontAwesome5 name="play" size={44} color="black"/>
                    }
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={nextStation}
                    style={stylingComponent.btn(true)}
                >
                    <AntDesign name="stepforward" size={44} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={resetStation}
                    style={stylingComponent.btn(true)}
                >
                    <FontAwesome5 name="stop" size={44} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const stylingComponent = StyleSheet.create({
    container: {
        flex: 1
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
        left: '50%',
        bottom: 50,
        transform: [{
            translateX: '-50%',
        }]
    },
    btn: (mr = false) => ({
        marginLeft: mr ? 25 : 0,

    }),
})

export default RadioPlayer;




