import {FlatList, View, Text, StyleSheet, TouchableOpacity, TextInput} from "react-native";
import {BlurView} from "expo-blur";
import {useState, useEffect} from "react";
import Animated from "react-native-reanimated";
import {userLanguage} from "./language/langTabsSettings";
import {useUserDataContext} from "../../utils/UserDataSaveContext";


const RenderListWorldStation = ({list = [], handlerSelectCountry, fieldInput}) => {
    const [listForRender, setListForRender] = useState(list);
    // const [inputSearch, setInputSearch] = useState('');
    const [userData] = useUserDataContext();

    useEffect(() => {
        if (list.length) {
            setListForRender(list);
        }
    }, [list]);

    useEffect(() => {
        if (fieldInput !== '') {
            let filterCountry;
            const rusKeyBoard = new RegExp('[а-яА-ЯЁё]');
            const engKeyBoard = new RegExp('[a-zA-Z]');
            const editedInputSearch = fieldInput.trim().toLowerCase();
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
    }, [fieldInput]);

    return (
        <View
            style={styling.mainContainer}
        >
            {/*<View>*/}
            {/*    <TextInput*/}
            {/*        onChangeText={(text) => setInputSearch(text)}*/}
            {/*        value={inputSearch}*/}
            {/*    />*/}
            {/*</View>*/}
            <Animated.FlatList
                data={listForRender}
                contentContainerStyle={styling.containerFlag}
                scrollEventThrottle={16}
                renderItem={({item}) => {

                    return (
                        <>
                            {item.code !== 'RU'
                                ? (
                                    <BlurView intensity={100} tint={"light"} style={styling.flagBtn}>
                                        <TouchableOpacity
                                            onPress={() => handlerSelectCountry(item)}
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
                                : (
                                    <BlurView intensity={100} tint={"light"} style={styling.flagBtn}>
                                        <TouchableOpacity
                                            onPress={() => alert(userLanguage(userData.selectLanguage)['appLang']['page'][3]['countryList']['message'])}
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
                            }
                        </>
                    )
                }}
                keyExtractor={(item, index) => index.toString()}
                numColumns={4}
            />
        </View>
    )
}

const styling = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: 0,
    },
    containerFlag: {
        backgroundColor: 'transparent',
        padding: 3,
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