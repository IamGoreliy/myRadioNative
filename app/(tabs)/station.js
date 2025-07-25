import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import SelectedCategoryAndCountry from "../components/SelectedCategoryAndCountry";
import {useCallback, useEffect, useState} from "react";
import {fetchGetListCountry} from "../../utils/fetch/fetchGetCountry";
import {countriesList} from "../../utils/newBaseCountryFlag";
import RenderListWorldStation from "../components/RenderListWorldStation";
import RenderListCategory from "../components/RenderListCategory";
import {fetchGetListCategory} from "../../utils/fetch/fetchGetCategory";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {useUserDataContext} from "../../utils/UserDataSaveContext";
import {LoadingIcon} from "../../utils/customSvgIcon";
import {LoadingAnimationComponent} from "../components/LoadingAnimationComponent";
import {getCategoryTitles} from "../components/language/langTabsSettings";
import {useDataLangContext} from "./_layout";

const initialStateForInputSearch = {
    country: {
        inputValue: '',
    },
    category: {
        inputValue: '',
    },
};


const Station = () => {
    const [listCountry, setListCountry] = useState([]);
    const [listCategory, setListCategory] = useState([]);
    const [whatListSelect, setWhatListSelect] = useState('country');
    const [inputSearchFilter, setInputSearchFilter] = useState(initialStateForInputSearch);
    const [userData, setUserData] = useUserDataContext();
    const [isLoading, setIsLoading] = useState(true);
    const [dataLang] = useDataLangContext();

    console.log('isLoading', isLoading)


    const handlerSelectCountry = useCallback((value) => {
        // setCountrySelected(value)
        setUserData(prevState => ({
            ...prevState,
            searchCountry: value,
        }));
    }, []);
    const handlerSelectCategory = useCallback((value) => {
        // setCategorySelected(value);
        setUserData(prevState => ({
            ...prevState,
            tag: value,
        }));
    }, []);

    const switchBetweenLists = useCallback(() => {
        setWhatListSelect(prevState => prevState === 'country' ? 'category' : 'country');
    }, []);

    const handlerInputChangeValue = useCallback((value) => {
        setInputSearchFilter(prevState => {
            return {
                ...prevState,
                [whatListSelect]: {
                    ...prevState[whatListSelect],
                    inputValue: value,
                }
            }
        })
    }, [whatListSelect]);

    const handlerClearInput = useCallback(() => {
        setInputSearchFilter(prevState => {
            return {
                ...prevState,
                [whatListSelect]: {
                    ...prevState[whatListSelect],
                    inputValue: '',
                }
            }
        });
        setUserData(prevState => ({
            ...prevState,
            tag: '',
        }));
    }, [whatListSelect])



    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        setIsLoading(true);
        Promise.all([
            fetchGetListCountry(signal),
            fetchGetListCategory(signal),
        ])
            .then(response => {
                if (!signal.aborted) {
                    const [country, category] = response;
                    const uniqueISO = new Set(country.map(ele => ele['iso_3166_1']));
                    const uniqueCountry = countriesList.filter(ele => uniqueISO.has(ele.code));
                    setListCountry(uniqueCountry);
                    setListCategory(category);
                }
            })
            .catch(e => {
                if (e.name === 'AbortError') {
                    console.error('запрос отменен');
                } else {
                    console.error(e);
                }
            })
            .finally(() => setIsLoading(false))

        return () => {
            controller.abort();
        }
    }, []);

    //подзагрузка поля input (сохранения поиска категории пользователя)

    useEffect(() => {
        setInputSearchFilter(prevState => ({
            ...prevState,
            [whatListSelect]: {
                inputValue: userData.tag
            }
        }))
    }, []);

    return (
        <View style={styling.container}>
            <View style={[styling.headerContainer]}>
                <SelectedCategoryAndCountry category={userData.tag} country={userData.searchCountry} switchBetweenLists={switchBetweenLists} whatListSelect={whatListSelect}/>
                <View style={styling.inputWrapper}>
                    <TextInput
                        onChangeText={(text) => handlerInputChangeValue(text)}
                        value={inputSearchFilter[whatListSelect].inputValue}
                        style={styling.input}
                        placeholder={`${getCategoryTitles(dataLang, 'station')['inputPlaceholder']}...`}
                    />
                    <View
                        style={styling.svgClear}
                    >
                        <TouchableOpacity
                            onPress={handlerClearInput}
                            style={styling.btnClear}
                        >
                            <MaterialIcons name="clear" size={24} color="white"/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {!isLoading
            ?
                <View
                    style={styling.wrapperHeader}
                >
                    { whatListSelect === 'country'
                        ? <RenderListWorldStation list={listCountry} handlerSelectCountry={handlerSelectCountry} fieldInput={inputSearchFilter.country.inputValue}/>
                        : <RenderListCategory list={listCategory} handlerSelectCategory={handlerSelectCategory} fieldInput={inputSearchFilter.category.inputValue}/>
                    }
                </View>
            :
                <View style={styling.containerLoading}>
                    <Text style={styling.testLoadingText}>
                        <LoadingAnimationComponent/>
                    </Text>
                </View>
            }
        </View>
    )
}

const styling = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1
    },
    wrapperHeader: {
        marginTop: 95,
        backgroundColor: 'red',
        flex: 1
    },
    inputWrapper: {
        position: "relative",
        height: 35,
        backgroundColor: 'black',
    },
    input: {
        paddingHorizontal: 10,
        height: '100%',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: 'white',
    },
    btnClear: {
        backgroundColor: 'red',
        borderRadius: '50%',
        padding: 2,
    },
    svgClear: {
        position: "absolute",
        right: 15,
        top: '50%',
        transform: [{translateY: '-50%'}]
    },
    containerLoading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    testLoadingText: {
        fontSize: 24,
        color: 'green'
    }

})

export default Station;