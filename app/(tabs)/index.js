import { View, Text, StyleSheet, ImageBackground} from 'react-native';
import RadioPlayer from "../components/RadioPlayer";
import {useState, useEffect, useCallback} from "react";
import {fetchGetStation} from "../../utils/fetchGetStation";
import RadioPlayerNew from "../components/RadioPlayerNew";
import ListRadioStation from "../components/listRadioStation";

const background = require('../../assets/backgroundByGrok.jpg');

const Home = () => {
    const [search, setSearch] = useState('rock');
    const [stations, setStations] = useState([]);
    const [selectCategory, setSelectCategory] = useState({});


    useEffect(() => {
        fetchGetStation(search)
            .then(response => setStations(response))
            .catch(error => console.error(error));


    }, [search]);

    const selectedCategory = useCallback((value) => {
        setSelectCategory(value);
    }, [])

    return (
            <ImageBackground
                style={styles.container}
                source={background}
            >
                <ListRadioStation listStation={stations} fnSelectedRadio={selectedCategory}/>
                {/*<RadioPlayer selectCategory={search} listStation={stations}/>*/}
                <RadioPlayerNew selectCategory={search} listStation={selectCategory}/>
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
