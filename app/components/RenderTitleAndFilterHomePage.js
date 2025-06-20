import {Text, TextInput, View, StyleSheet} from "react-native";
import {useState, useEffect} from "react";

const RenderTitleAndFilterHomePage = ({country, handlerChangeFilter}) => {
    const [valueInputCategory, setValueInputCategory] = useState('');

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
                <Text>
                    Выбранная страна {country.flag} &nbsp; {country.name}
                </Text>
                <Text>
                    Радиостанция {valueInputCategory}
                </Text>
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
    categoryText: {

    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: 'black',
        marginTop: 15,
    }

})

export default RenderTitleAndFilterHomePage;