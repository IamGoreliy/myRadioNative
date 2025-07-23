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
                        {toggleFavoriteValue
                            ?
                            <View style={styling.wrapperIconFavoriteBtnGeneral}>
                               <View style={styling.wrapperIconFavoriteBtn}>
                                   <AntDesign name="star" size={24} color="rgba(255, 228, 0, 1)" />
                               </View>
                                <View style={styling.wrapperIconFavoriteBtn}>
                                    <AntDesign name="staro" size={28} color="rgba(108, 200, 255, 1)" />
                                </View>
                            </View>
                            :
                            <View style={styling.wrapperIconFavoriteBtnGeneral}>
                                <View style={styling.wrapperIconFavoriteBtn}>
                                    <AntDesign name="staro" size={18} color="rgba(255, 228, 0, 1)" />
                                </View>
                                <View style={styling.wrapperIconFavoriteBtn}>
                                    <AntDesign name="staro" size={28} color="rgba(108, 200, 255, 1)" />
                                </View>
                            </View>
                        }
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
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
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
        // borderWidth: 1,
        // borderColor: 'red',
        marginTop: 15,
        borderRadius: 15,
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: 'white',
    },
    btnFavorite: {
        width: 50,
        justifyContent: "center",
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.2)',
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        // backgroundColor: 'rgba(210, 210, 210, 1)'
    },
    wrapperIconFavoriteBtnGeneral: {
        position: "relative",
        width: '100%',
        height: '100%',
    },
    wrapperIconFavoriteBtn: {
        position: "absolute",
        top: '50%',
        left: '50%',
        transform: [{translateX: '-50%'}, {translateY: '-50%'}],
    },
    switcherStyling: {
        marginLeft: 20
    },
    descriptionWrapper: {
        flexDirection: 'row'
    },
    titleDesc: (whatCategory, value = '') =>  ({
        padding: 3,
        color: whatCategory === value ? 'green': 'black',
        fontWeight: whatCategory === value ? 700 : 300,
        backgroundColor: whatCategory === value ? 'white' : 'transparent',
        borderRadius: 5,
    })

})

export default RenderTitleAndFilterHomePage;