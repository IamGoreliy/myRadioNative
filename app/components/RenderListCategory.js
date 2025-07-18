import {FlatList, StyleSheet, View, Text, TouchableOpacity, TextInput} from "react-native";
import {useState, useEffect} from "react";
import Animated from "react-native-reanimated";

const RenderListCategory = ({list = [], handlerSelectCategory, fieldInput}) => {
    const [listForRender, setListForRender] = useState(list);
    const [inputSearch, setInputSearch] = useState('');

    useEffect(() => {
        if (list.length) {
            setListForRender(list);
        }
    }, [list]);

    useEffect(() => {
        if (fieldInput !== '') {
            const filterList = list.filter(station => {
                return station.name.toLowerCase().includes(fieldInput.toLowerCase());
            })
            setListForRender(filterList);
        } else {
            setListForRender(list);
        }
    }, [fieldInput]);

    return (
        <View style={styling.container}>
            {/*<View style={styling.inputWrapper}>*/}
            {/*    <TextInput*/}
            {/*        onChangeText={(text) => setInputSearch(text)}*/}
            {/*        value={inputSearch}*/}
            {/*        placeholder={'поиск радиостанции по тегу...'}*/}
            {/*        style={styling.inputField}*/}
            {/*    />*/}
            {/*</View>*/}
            <Animated.FlatList
                data={listForRender}
                scrollEventThrottle={16}
                renderItem={({item}) => {
                    return (
                        <TouchableOpacity
                            onPress={() => handlerSelectCategory(item?.name)}
                            style={styling.btn}
                        >
                            <Text style={styling.btnLabel}>
                                {item?.name}
                            </Text>
                        </TouchableOpacity>
                    )
                }}
                contentContainerStyle={styling.containerList}
                numColumns={4}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    )
}

const styling = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputWrapper: {

    },
    inputField: {
        height: 35,

    },
    containerList: {
        padding: 10,
        backgroundColor: 'black',
    },
    btn: {
        justifyContent: "center",
        alignItems: 'center',
        width: 90,
        height: 70,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'white',
        margin: 5
    },
    btnLabel: {
        color: 'white'
    }
})

export default RenderListCategory;