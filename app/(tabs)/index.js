import { View, Text, StyleSheet, ImageBackground} from 'react-native';
import {useState, useEffect, useCallback} from "react";
import {fetchGetStation} from "../../utils/fetch/fetchGetStation";
import RadioPlayerNew from "../components/RadioPlayerNew";
import ListRadioStation from "../components/ListRadioStation";

const background = require('../../assets/backgroundByGrok.jpg');

const Home = () => {
    const [search, setSearch] = useState('rock');
    const [stations, setStations] = useState([]);
    const [radioWaveIndex, setRadioWaveIndex] = useState(null);
    const [countryName, setCountryName] = useState('');



    useEffect(() => {

        const variantArlLink = (value) => value === 'all'
            ? [
                `https://de1.api.radio-browser.info/json/stations/search?name=${search}`,
                `https://de2.api.radio-browser.info/json/stations/search?name=${search}`,
                `https://fi1.api.radio-browser.info/json/stations/search?name=${search}`,
            ]
            : [
                `https://de1.api.radio-browser.info/json/stations/search?name=${search}&countrycode=${value}`,
                `https://de2.api.radio-browser.info/json/stations/search?name=${search}&countrycode=${value}`,
                `https://fi1.api.radio-browser.info/json/stations/search?name=${search}&countrycode=${value}`,
            ]



        fetchGetStation(search, countryName, 0, variantArlLink(countryName))
            .then(response => {
                //вариант 1
                // const list = response.filter((wave, index, self) => wave['url_resolved'] && self.findIndex(w => w.name === wave.name) === index);
                //вариант 2
                const uniqueName = new Set();
                const list = response.filter(wave => {
                    if (!wave['url_resolved']) {
                        return false;
                    }
                    if (uniqueName.has(wave.name)) {
                        return false;
                    }
                    uniqueName.add(wave.name);
                    return true;
                });
                console.log(list.length)
                setStations(list);
            })
            .catch(error => console.error(error));


    }, [search]);

    const selectedCategory = useCallback((value) => {
        setRadioWaveIndex(value);
    }, []);

    const nextRadioWave = useCallback(() => {
        console.log('i am work next station');
        if (radioWaveIndex === null) return;
        setRadioWaveIndex(prevState => prevState < stations.length ? prevState + 1 : prevState);
    }, [radioWaveIndex]);

    const preRadioWave = useCallback(() => {
        console.log('i am work next station');
        if (radioWaveIndex === null) return;
        setRadioWaveIndex(prevState => prevState > 0 ? prevState - 1 : prevState);
    },[radioWaveIndex]);


    return (
            <ImageBackground
                style={styles.container}
                source={background}
            >
                <ListRadioStation listStation={stations} fnSelectedRadio={selectedCategory} changeIndex={radioWaveIndex}/>
                {/*<RadioPlayer selectCategory={search} listStation={stations}/>*/}
                <RadioPlayerNew
                    selectCategory={search}
                    radioWave={stations[radioWaveIndex]}
                    handlerNextWave={nextRadioWave}
                    handlerPreWave={preRadioWave}
                />
            </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",

    },
});

export default Home;
