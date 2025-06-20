import {View, Text, StyleSheet, ImageBackground} from 'react-native';
import {useState, useEffect, useCallback, useRef} from "react";
import {fetchGetStation} from "../../utils/fetch/fetchGetStation";
import RadioPlayerNew from "../components/RadioPlayerNew";
import ListRadioStation from "../components/ListRadioStation";
import {useSearchContext} from "../components/SearchRadioStationContext";
import {variantArlLink} from "../../utils/fnListLinksAPI";
import RenderTitleAndFilterHomePage from "../components/RenderTitleAndFilterHomePage";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedScrollHandler,
    withTiming,
} from "react-native-reanimated";

const background = require('../../assets/backgroundByGrok.jpg');
const HEADER_HEIGHT = 100;
const DEFINITION_MOVEMENT_SCROLLING = 5;

const Home = () => {
    const [stationsList, setStationsList] = useState([]);
    const [stationListForRender, setStationListForRender] = useState([]);
    const [radioWaveIndex, setRadioWaveIndex] = useState(null);
    const [userSearchState] = useSearchContext(); //🏄🏄🏄 эта функция возвращает state и setState

    //анимация
    const lastScrollY = useSharedValue(0);
    const headerTranslateY = useSharedValue(0);
    const isHeaderVisible = useSharedValue(1);






    useEffect(() => {
        fetchGetStation(0, variantArlLink(userSearchState.country.code, userSearchState.tag))
            .then(response => {
                //вариант 1
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
                console.log(list.length) // лог количество загруженных радиостанций
                setStationsList(list);
            })
            .catch(error => console.error(error));
    }, [userSearchState]);

    useEffect(() => {
        if (stationsList.length) {
            setStationListForRender(stationsList);
        }
    }, [stationsList]);

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
            transform: [{translateY: headerTranslateY.value}]
        };
    })

    return (
            <ImageBackground
                style={styles.container}
                source={background}
            >
                <Animated.View style={[styles.headerContainer, animatedHeaderStyle]}>
                     <RenderTitleAndFilterHomePage country={userSearchState.country} handlerChangeFilter={handlerSearchNameRadioStation}/>
                </Animated.View>
                <ListRadioStation
                    listStation={stationListForRender}
                    fnSelectedRadio={selectedCategory}
                    changeIndex={radioWaveIndex}
                    onScroll={handlerScrollHideTitleComponent}
                />
                {/*<RadioPlayer selectCategory={search} listStation={stations}/>*/}
                <RadioPlayerNew
                    selectCategory={userSearchState.tag}
                    radioWave={stationListForRender[radioWaveIndex]}
                    handlerNextWave={nextRadioWave}
                    handlerPreWave={preRadioWave}
                />
            </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },
    headerContainer: {
        width: '100%',
        height: 100,
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1
    }
});

export default Home;
