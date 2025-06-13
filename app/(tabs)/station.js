import {View, Text, StyleSheet} from 'react-native';
import SelectedCategoryAndCountry from "../components/SelectedCategoryAndCountry";
import {useCallback, useEffect, useState} from "react";
import {fetchGetListCountry} from "../../utils/fetch/fetchGetCountry";
import {countriesList} from "../../utils/newBaseCountryFlag";
import RenderListWorldStation from "../components/RenderListWorldStation";
import RenderListCategory from "../components/RenderListCategory";
import {fetchGetListCategory} from "../../utils/fetch/fetchGetCategory";

//https://de2.api.radio-browser.info/json/countries

const Station = () => {
    const [categorySelected, setCategorySelected] = useState('');
    const [countrySelected, setCountrySelected] = useState(null);
    const [listCountry, setListCountry] = useState([]);
    const [listCategory, setListCategory] = useState([]);
    const [whatListSelect, setWhatListSelect] = useState('country');

    const handlerSelectCountry = useCallback((value) => {
        setCountrySelected(value)
    }, []);
    const handlerSelectCategory = useCallback((value) => {
        setCategorySelected(value)
    }, []);

    const switchBetweenLists = useCallback((value) => setWhatListSelect(value), []);



    useEffect(() => {
        Promise.all([fetchGetListCountry(), fetchGetListCategory()])
            .then(response => {
                const [country, category] = response;
                const uniqueISO = new Set(country.map(ele => ele['iso_3166_1']));
                const uniqueCountry = countriesList.filter(ele => uniqueISO.has(ele.code));
                setListCountry(uniqueCountry);
                setListCategory(category);
            })
            .catch(e => console.error(e))
    }, []);



    return (
        <View style={styling.container}>
            <SelectedCategoryAndCountry category={categorySelected} country={countrySelected} switchBetweenLists={switchBetweenLists}/>
            { whatListSelect === 'country'
                ? <RenderListWorldStation list={listCountry} handlerSelectCountry={handlerSelectCountry}/>
                : <RenderListCategory list={listCategory} handlerSelectCategory={handlerSelectCategory}/>
            }
        </View>
    );
}

const styling = StyleSheet.create({
    container: {
        flex: 1
    }

})

export default Station;