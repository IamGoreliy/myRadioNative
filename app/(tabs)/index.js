import { View, Text, StyleSheet} from 'react-native';
import RadioPlayer from "../components/RadioPlayer";
import {useState, useEffect} from "react";
import {fetchGetStation} from "../../utils/fetchGetStation";
import RadioPlayerNew from "../components/RadioPlayerNew";

const Home = () => {
    const [search, setSearch] = useState('rock');
    const [stations, setStations] = useState([]);
    useEffect(() => {
        fetchGetStation(search)
            .then(response => setStations(response))
            .catch(error => console.error(error));
    }, [search]);

    return (
        <View style={styles.container}>
            {/*<RadioPlayer selectCategory={search} listStation={stations}/>*/}
            <RadioPlayerNew selectCategory={search} listStation={stations}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        position: "relative",

    },
});

export default Home;
