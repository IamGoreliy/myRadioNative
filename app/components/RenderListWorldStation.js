import {FlatList, View, Text, StyleSheet, TouchableOpacity, TextInput} from "react-native";
import {BlurView} from "expo-blur";
import {useState, useEffect} from "react";

const RenderListWorldStation = ({list = [], handlerSelectCountry}) => {
    const [listForRender, setListForRender] = useState(list);
    const [inputSearch, setInputSearch] = useState('');

    useEffect(() => {
        if (inputSearch !== '') {
            let filterCountry;
            const rusKeyBoard = new RegExp('[а-яА-ЯЁё]');
            const engKeyBoard = new RegExp('[a-zA-Z]');
            const editedInputSearch = inputSearch.trim().toLowerCase();
            const testKeyBoard = rusKeyBoard.test(editedInputSearch) ? 'rus' : engKeyBoard.test(editedInputSearch) ? 'eng' : 'unknow key board';
            if (testKeyBoard === 'rus') {
                 filterCountry = list.filter(country => country.nameRu.toLowerCase().includes(editedInputSearch));
            } else if (testKeyBoard === 'eng') {
                 filterCountry = list.filter(country => country.name.toLowerCase().includes(editedInputSearch));
            }
            setListForRender(filterCountry);
        } else {
            setListForRender(list);
        }
    }, [inputSearch]);

    return (
        <View>
            <View>
                <TextInput
                    onChangeText={(text) => setInputSearch(text)}
                    value={inputSearch}
                />
            </View>
            <FlatList
                data={listForRender}
                contentContainerStyle={styling.containerFlag}
                renderItem={({item}) => {
                    return (
                        <BlurView intensity={90} tint={"light"} style={styling.flagBtn}>
                            <TouchableOpacity
                                onPress={() => handlerSelectCountry(item)  }
                                style={styling.flagBtn}
                            >
                                <Text style={styling.flagImage}>
                                    {item.flag}
                                </Text>
                                <Text>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        </BlurView>

                    )
                }}
                keyExtractor={(item, index) => index.toString()}
                numColumns={4}
            />
        </View>
    )
}

const styling = StyleSheet.create({
    containerFlag: {
        backgroundColor: 'black',
        padding: 10,
    },
    flagBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 90,
        height: 70,
        padding: 3,
        borderWidth: 1,
        borderColor: 'black',
        margin: 5,
        borderRadius: 5,
    },
    flagImage: {
        fontSize: 15
    }
})

export default RenderListWorldStation;