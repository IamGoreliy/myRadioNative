import {FlatList, View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {Image} from "expo-image";
import {LinearGradient} from "expo-linear-gradient";
import {useCallback, useState, useEffect, memo} from "react";

const logoPlaceholder = require('../../assets/logoByGemini.webp');

const StationItem = memo(({handler, item, index, isSelect}) => {
    return (
        <TouchableOpacity
            onPress={() => handler(index)}
            style={[
                styling.wrapperStation(index),
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

const ListRadioStation = ({listStation, fnSelectedRadio, changeIndex}) => {
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
    }, [selectStationIndex])

    return (
        <FlatList
            data={listStation}
            contentContainerStyle={styling.mapList}
            renderItem={renderListItem}
            keyExtractor={(item, index) => index.toString()}
            extraData={selectStationIndex}
        />
    )
}

const styling = StyleSheet.create({
    mapList: {
        width: '96%',
        marginHorizontal: '2%',
    },
    wrapperStation: (index) => ({
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        width: '100%',
        height: 40,
        marginTop: index !== 0 ? 4 : 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderWidth: 1,
        borderColor: '#78f8f0',
        borderRadius: 10,
    }),
    wrapperStationBorderColorSelect: {
        borderColor: '#c777b0',
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


