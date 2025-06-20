import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import SelectedCategoryAndCountry from "../components/SelectedCategoryAndCountry";
import {useCallback, useEffect, useState} from "react";
import {fetchGetListCountry} from "../../utils/fetch/fetchGetCountry";
import {countriesList} from "../../utils/newBaseCountryFlag";
import RenderListWorldStation from "../components/RenderListWorldStation";
import RenderListCategory from "../components/RenderListCategory";
import {fetchGetListCategory} from "../../utils/fetch/fetchGetCategory";
import {useSearchContext} from "../components/SearchRadioStationContext";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const initialStateForInputSearch = {
    country: {
        inputValue: '',
    },
    category: {
        inputValue: '',
    },
};


const Station = () => {
    // const [categorySelected, setCategorySelected] = useState('');
    // const [countrySelected, setCountrySelected] = useState(null);
    const [listCountry, setListCountry] = useState([]);
    const [listCategory, setListCategory] = useState([]);
    const [whatListSelect, setWhatListSelect] = useState('country');
    const [inputSearchFilter, setInputSearchFilter] = useState(initialStateForInputSearch);
    const [searchState, setSearchState] = useSearchContext();



    const handlerSelectCountry = useCallback((value) => {
        // setCountrySelected(value)
        setSearchState(prevState => ({country: value, tag: prevState.tag }));
    }, []);
    const handlerSelectCategory = useCallback((value) => {
        // setCategorySelected(value);
        setSearchState(prevState => ({country: prevState.country, tag: value}));
    }, []);

    const switchBetweenLists = useCallback((value) => setWhatListSelect(value), []);

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
        })
    }, [whatListSelect])



    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
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

        return () => {
            controller.abort();
        }
    }, []);


    return (
        <View style={styling.container}>
            <View style={[styling.headerContainer]}>
                <SelectedCategoryAndCountry category={searchState.tag} country={searchState.country} switchBetweenLists={switchBetweenLists}/>
                <View style={styling.inputWrapper}>
                    <TextInput
                        onChangeText={(text) => handlerInputChangeValue(text)}
                        value={inputSearchFilter[whatListSelect].inputValue}
                        style={styling.input}
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
            <View
                style={styling.wrapperHeader}
            >
                { whatListSelect === 'country'
                    ? <RenderListWorldStation list={listCountry} handlerSelectCountry={handlerSelectCountry} fieldInput={inputSearchFilter.country.inputValue}/>
                    : <RenderListCategory list={listCategory} handlerSelectCategory={handlerSelectCategory} fieldInput={inputSearchFilter.category.inputValue}/>
                }
            </View>
        </View>
    );
}

const styling = StyleSheet.create({
    container: {
        flex: 1
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
        height: '100%',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: 'white'
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


})

export default Station;