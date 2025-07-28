import {View, Text, StyleSheet, ImageBackground} from 'react-native';
import {useState, useEffect, useCallback, useRef, createContext} from "react";
import {fetchGetStation} from "../../utils/fetch/fetchGetStation";
import RadioPlayerNew from "../components/RadioPlayerNew";
import ListRadioStation from "../components/ListRadioStation";
import {variantArlLink} from "../../utils/fnListLinksAPI";
import RenderTitleAndFilterHomePage from "../components/RenderTitleAndFilterHomePage";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    withTiming,
} from "react-native-reanimated";
import {useUserDataContext} from "../../utils/UserDataSaveContext";

export const background = require('../../assets/backgroundByGrok.jpg');
const HEADER_HEIGHT = 110;
const DEFINITION_MOVEMENT_SCROLLING = 5;

const Home = () => {
    const [stationsList, setStationsList] = useState([]);
    const [stationListForRender, setStationListForRender] = useState([]);
    const [radioWaveIndex, setRadioWaveIndex] = useState(null);
    const [userData] = useUserDataContext(); // контекст который загружает все настройки пользователя + сохраненные станции
    const [isFavorite, setIsFavorite] = useState(false);

    //анимация
    const lastScrollY = useSharedValue(0);
    const headerTranslateY = useSharedValue(0);
    const isHeaderVisible = useSharedValue(1);

    useEffect(() => {
        fetchGetStation(0, variantArlLink(userData.searchCountry.code, userData.tag, userData.switcher))
            .then(response => {
                //вариант 1 //🦄🦄🦄 если включить анимацию список перестает реагировать на нажатие из за этого пришлось отказать от анимации.
    // const animatedListWrapper = useAnimatedStyle(() => {
    //     return {
    //         marginTop: withTiming(isHeaderVisible.value ? 120 : 0, {duration:  1}),
    //     }
    // })
                // const list = response.filter((wave, index, self) => wave['url_resolved'] && self.findIndex(w => w.name === wave.name) === index);
                //вариант 2

                const uniqueName = new Set();
                const list = response.filter(wave => {
                    if (!wave['url_resolved']) {
                        return false;
                    }
                    if (uniqueName.has(wave.name)) {
                        return false;
                    }
                    uniqueName.add(wave.name);
                    return true;
                });
                console.log(list.length) // 🦄🦄🦄 лог количество загруженных радиостанций
                setStationsList(list);
            })
            .catch(error => console.error(error));
    }, [userData.searchCountry, userData.tag, userData.switcher]);

    useEffect(() => {
        if (!isFavorite) {
            setStationListForRender(stationsList);
        } else {
            setStationListForRender(userData.saveStation);
        }
    }, [stationsList, isFavorite]);

    const selectedCategory = useCallback((value) => {
        setRadioWaveIndex(value);
    }, []);

    const nextRadioWave = useCallback(() => {
        if (radioWaveIndex === null) return;
        setRadioWaveIndex(prevState => prevState < stationsList.length ? prevState + 1 : prevState);
    }, [radioWaveIndex]);

    const preRadioWave = useCallback(() => {
        if (radioWaveIndex === null) return;
        setRadioWaveIndex(prevState => prevState > 0 ? prevState - 1 : prevState);
    },[radioWaveIndex]);

    const handlerSearchNameRadioStation = useCallback((value) => {
        if (stationsList.length) {
            if (value !== '') {
                const response = stationsList.filter(wave => wave.name.toLowerCase().includes(value.toLowerCase()));
                setStationListForRender(response);
            } else {
                setStationListForRender(stationsList);
            }
        }
    }, [stationsList]);

    const togglerFavorite = useCallback(() => setIsFavorite(!isFavorite), [isFavorite]);

    const handlerScrollHideTitleComponent = useAnimatedScrollHandler({
        onScroll: (event, ctx) => {
            const currentOffsetY = event.contentOffset.y;
            const diff = currentOffsetY - lastScrollY.value;
            if (Math.abs(diff) < DEFINITION_MOVEMENT_SCROLLING) {
                return;
            }
            if (currentOffsetY > lastScrollY.value && currentOffsetY > HEADER_HEIGHT) {
                headerTranslateY.value = withTiming(-HEADER_HEIGHT, {duration: 250});
                isHeaderVisible.value = 0;
            } else if (currentOffsetY < lastScrollY.value || currentOffsetY <= HEADER_HEIGHT / 2) {
                if (isHeaderVisible.value === 0) {
                    headerTranslateY.value = withTiming(0, {duration: 250});
                    isHeaderVisible.value = 1;
                }
            }
            lastScrollY.value = currentOffsetY;
        },
    })

    const animatedHeaderStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateY: headerTranslateY.value}],
        };
    })

    return (
            <ImageBackground
                style={styled.container}
                source={background}
            >
                <Animated.View
                    style={[
                        styled.headerContainer,
                        animatedHeaderStyle
                    ]}
                >
                     <RenderTitleAndFilterHomePage
                         country={userData.searchCountry}
                         category={userData.tag}
                         handlerChangeFilter={handlerSearchNameRadioStation}
                         togglerFavorite={togglerFavorite}
                         toggleFavoriteValue={isFavorite}
                     />
                </Animated.View>
                <Animated.View>
                    <ListRadioStation
                        listStation={stationListForRender}
                        fnSelectedRadio={selectedCategory}
                        changeIndex={radioWaveIndex}
                        onScroll={handlerScrollHideTitleComponent}
                    />
                </Animated.View>
                <RadioPlayerNew
                    selectCategory={userData.tag}
                    radioWave={stationListForRender[radioWaveIndex]}
                    handlerNextWave={nextRadioWave}
                    handlerPreWave={preRadioWave}
                />
            </ImageBackground>
    );
}

const styled = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },
    headerContainer: {
        width: '100%',
        height: 115,
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1
    },

});

export default Home;
