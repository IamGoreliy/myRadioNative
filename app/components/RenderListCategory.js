import {FlatList, StyleSheet, View, Text, TouchableOpacity, TextInput} from "react-native";
import {useState, useEffect} from "react";

const RenderListCategory = ({list = [], handlerSelectCategory}) => {
    const [listForRender, setListForRender] = useState(list);
    const [inputSearch, setInputSearch] = useState('');

    useEffect(() => {
        if (inputSearch !== '') {
            const filterList = list.filter(station => {
                return station.name.toLowerCase().includes(inputSearch.toLowerCase());
            })
            setListForRender(filterList);
        } else {
            setListForRender(list);
        }
    }, [inputSearch]);

    return (
        <View style={styling.container}>
            <View>
                <TextInput
                    onChangeText={(text) => setInputSearch(text)}
                    value={inputSearch}
                    placeholder={'поиск радиостанции по тегу'}
                />
            </View>
            <FlatList
                data={listForRender}
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
        height: '94%',
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