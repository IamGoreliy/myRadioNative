import {Text, TextInput, View, StyleSheet, TouchableOpacity} from "react-native";
import {useState, useEffect} from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import {SwitcherFilter} from "./SwitcherFilter";
import {useUserDataContext} from "../../utils/UserDataSaveContext";

const RenderTitleAndFilterHomePage = ({country, handlerChangeFilter, togglerFavorite, category, toggleFavoriteValue}) => {
    const [valueInputCategory, setValueInputCategory] = useState('');
    const [userData] = useUserDataContext();


    //будет происходить запись фильтра списка, при обновление valueInput
    useEffect(() => {
        handlerChangeFilter(valueInputCategory);
    }, [valueInputCategory]);

    return (
        <View
            style={styling.container}
        >
            <View
                style={styling.containerSelectedCategory}
            >
                <View style={styling.categoryBlock}>
                    <View>
                        <View style={styling.descriptionWrapper}>
                            <Text style={styling.titleDesc(userData.switcher, 'country')}>
                                Страна:
                            </Text>
                            <Text>
                                &nbsp; {country.flag} &nbsp; {country.name}
                            </Text>
                        </View>
                        <View style={styling.descriptionWrapper}>
                            <Text style={styling.titleDesc(userData.switcher, 'category')}>
                                Категория:
                            </Text>
                            <Text>
                                &nbsp; "{category}"
                            </Text>
                        </View>
                    </View>
                    <SwitcherFilter styleMain={styling.switcherStyling}/>
                </View>
                <TouchableOpacity
                    onPress={togglerFavorite}
                    style={styling.btnFavorite}
                >
                    <Text>
                        {toggleFavoriteValue
                            ? <AntDesign name="star" size={24} color="yellow" />
                            : <AntDesign name="staro" size={20} color="yellow" />
                        }

                    </Text>
                </TouchableOpacity>
            </View>
            <TextInput
                onChangeText={text => setValueInputCategory(text)}
                value={valueInputCategory}
                placeholder={'поиск ...'}
                style={styling.input}
            />
        </View>
    )
}

const styling = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        padding: 5,
    },
    containerSelectedCategory: {
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    categoryBlock: {
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: 'black',
        marginTop: 15,
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    btnFavorite: {
        width: 50,
        justifyContent: "center",
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
    },
    switcherStyling: {
        marginLeft: 20
    },
    descriptionWrapper: {
        flexDirection: 'row'
    },
    titleDesc: (whatCategory, value = '') =>  ({
        color: whatCategory === value ? 'green': 'black'
    })

})

export default RenderTitleAndFilterHomePage;