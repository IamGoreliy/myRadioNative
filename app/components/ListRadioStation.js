import {FlatList, View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {Image} from "expo-image";
import {useCallback, useState, useEffect, memo} from "react";
import Animated, {useAnimatedStyle, withTiming} from "react-native-reanimated";
import AntDesign from '@expo/vector-icons/AntDesign';
import {useUserDataContext} from "../../utils/UserDataSaveContext";
import {useDataLangContext} from "../(tabs)/_layout";

const logoPlaceholder = require('../../assets/logoByGemini.webp');

export const StationItem = memo(({handler, item, index, isSelect, starsIsSelect, starsSave}) => {
    return (
        <View
            style={styling.mainItem}
        >
            <TouchableOpacity
                onPress={() => handler(index)}
                style={[
                    styling.wrapperStation,
                    isSelect && styling.wrapperStationBorderColorSelect
                ]}
            >
                <View
                    style={styling.infoBtnWrapper}
                >
                    <View
                        style={styling.infoBtn}
                    >
                        <Image
                            style={styling.logoStation}
                            source={item.favicon ? {uri: item.favicon} : logoPlaceholder}
                        />
                        <Text
                            style={[
                                styling.nameStation,
                                isSelect && styling.nameStationSelect
                            ]}
                        >
                            {item.name.length > 30 ? item.name.slice(0, 30) + '...' : item.name}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styling.btnStar}
                        onPress={() => starsSave(item)}
                    >
                        { starsIsSelect
                            ? <AntDesign name="star" size={24} color="yellow" />
                            : <AntDesign name="staro" size={20} color="yellow" />
                        }
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </View>
    )
})

const ListRadioStation = ({listStation, fnSelectedRadio, changeIndex, onScroll, isScrollDisabled}) => {
    const [selectStationIndex, setSelectStationIndex] = useState(null);
    const [stateSaveRadio, setStateSaveRadio] = useUserDataContext();
    const [langData] = useDataLangContext();
    const [testText, setTestText] = useState('');




    useEffect(() => {
        if (changeIndex !== selectStationIndex) {
            setSelectStationIndex(changeIndex);
        }
    }, [changeIndex]);

    useEffect(() => {
        setTestText(langData[4]?.messageListNotFount)
    }, [langData])

    const radioWave = useCallback((indexElement) => {
        fnSelectedRadio(indexElement);
        setSelectStationIndex(indexElement);
    }, []);

    const toggleFavorite = useCallback((radioWave) => {
        setStateSaveRadio(prevState => {
            const isFavorite = !prevState.saveStation.some(wave => wave.stationuuid === radioWave.stationuuid);
            let newState;
            if (isFavorite) {
                newState = {
                    ...prevState,
                    saveStation: [...prevState.saveStation, radioWave],
                }
            } else {
               newState = {
                   ...prevState,
                   saveStation: prevState.saveStation.filter(curRadioWave => curRadioWave.stationuuid !== radioWave.stationuuid),
               }
            }
            return newState;
        });
    }, []);

    const renderListItem = useCallback(({item, index}) => {
        const isSelect = selectStationIndex === index;
        const starSelected = !!stateSaveRadio.saveStation.find(wave => wave.stationuuid === item.stationuuid);

        return (
            <StationItem
                handler={radioWave}
                item={item}
                index={index}
                isSelect={isSelect}
                starsIsSelect={starSelected}
                starsSave={toggleFavorite}
            />
        )
    }, [selectStationIndex, stateSaveRadio.saveStation]);

    const getItemLayout = useCallback((_, index) => {
        return {
            length: 44,
            offset: 44 * index,
            index,
        }
    }, []);

    return (
        listStation.length > 0
            ?
            <Animated.FlatList
                data={listStation}
                onScroll={onScroll}
                scrollEventThrottle={16}
                contentContainerStyle={styling.mapList}
                renderItem={renderListItem}
                keyExtractor={(item) => item.stationuuid}
                extraData={selectStationIndex}
                getItemLayout={getItemLayout}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={11}
            />
            :
            <View style={styling.waveNotFoundWrapper}>
                <Text style={styling.waveNotFountMessage}>
                    {testText}
                </Text>
            </View>

    )
}

const styling = StyleSheet.create({
    mapList: {
        width: '96%',
        marginHorizontal: '2%',
        paddingBottom: 54,
        marginTop: 120,
        // height: '100%',
        overflow: 'hidden   '
    },
    mainItem: {
        justifyContent: "center",
        alignItems: "center"
    },
    wrapperStation: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        width: '100%',
        height: 40,
        marginTop: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderWidth: 1,
        borderColor: '#78f8f0',
        borderRadius: 10,
    },
    wrapperStationBorderColorSelect: {
        borderColor: '#ff00f4',
        borderWidth: 3,
        // transform: [{scaleY: 1.15}, {scaleX: 1.03}],
        width: '102%',
        height: 50,
    },
    infoBtnWrapper: {
        width: '100%',
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    infoBtn: {
        flexDirection: "row",
    },
    descriptionWrapper: {
        flexDirection: "row",
        alignItems: 'center',
        padding: 5,
        width: '96%',
        backgroundColor: 'red',
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderLeftColor: 'white',
        borderRightColor: 'white',
        borderBottomColor: 'white',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    descriptionTextAndLink: {
        marginLeft: 20,
    },
    descNameStation: {
        fontWeight: 700,
    },
    btnGoHomePage: {
        padding: 2,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 4,
        backgroundColor: 'white',
    },
    logoStation: {
        width: 40,
        height: 20,
    },
    nameStation: {
        color: 'rgba(210, 210, 210, 1)',
        marginLeft: 10,
        fontWeight: 'bold'
    },
    nameStationSelect: {
        color: 'rgb(193,255,118)',
    },
    waveNotFoundWrapper: {
        marginHorizontal: '1%',
        // paddingHorizontal: 0,
        marginTop: '50%',
        width: '98%',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'black',
       backgroundColor: 'rgba(255,255,255,0.75)',
    },
    waveNotFountMessage: {
        textAlign: 'center',
        color: 'black',
        fontSize: 30,
        fontWeight: 600,
    }

})
export default ListRadioStation;


