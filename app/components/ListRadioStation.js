import {FlatList, View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {Image} from "expo-image";
import {LinearGradient} from "expo-linear-gradient";
import {useCallback, useState, useEffect, memo} from "react";
import Animated from "react-native-reanimated";

const logoPlaceholder = require('../../assets/logoByGemini.webp');

const StationItem = memo(({handler, item, index, isSelect}) => {
    return (
        <TouchableOpacity
            onPress={() => handler(index)}
            style={[
                styling.wrapperStation,
                isSelect && styling.wrapperStationBorderColorSelect
            ]}
        >
            <Image
                style={styling.logoStation}
                source={item.favicon ? {uri: item.favicon} : logoPlaceholder}
            />
            <Text
                style={styling.nameStation}
            >
                {item.name}
            </Text>
        </TouchableOpacity>
    )
})

const ListRadioStation = ({listStation, fnSelectedRadio, changeIndex, onScroll}) => {
    const [selectStationIndex, setSelectStationIndex] = useState(null);

    useEffect(() => {
        if (changeIndex !== selectStationIndex) {
            setSelectStationIndex(changeIndex);
        }
    }, [changeIndex])

    const  radioWave = useCallback((indexElement) => {
        fnSelectedRadio(indexElement);
        setSelectStationIndex(indexElement);
    }, []);

    const renderListItem = useCallback(({item, index}) => {
        const isSelect = selectStationIndex === index;
        return (
            <StationItem
                handler={radioWave}
                item={item}
                index={index}
                isSelect={isSelect}
            />
        )
    }, [selectStationIndex]);

    const getItemLayout = useCallback((_, index) => {
        return {
            length: 44,
            offset: 44 * index,
            index,
        }
    }, [])

    return (
        <Animated.FlatList
            data={listStation}
            onScroll={onScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styling.mapList}
            renderItem={renderListItem}
            keyExtractor={(item, index) => index.toString()}
            extraData={selectStationIndex}
            getItemLayout={getItemLayout}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={11}
        />
    )
}

const styling = StyleSheet.create({
    mapList: {
        width: '96%',
        marginHorizontal: '2%',
        paddingBottom: 54,
    },
    wrapperStation: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        width: '100%',
        height: 40,
        marginTop: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderWidth: 1,
        borderColor: '#78f8f0',
        borderRadius: 10,
    },
    wrapperStationBorderColorSelect: {
        borderColor: '#ff00f4',
        borderWidth: 2,
    },
    logoStation: {
        width: 40,
        height: 20,
    },
    nameStation: {
        color: 'white'
    }
})
export default ListRadioStation;


