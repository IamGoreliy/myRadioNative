import {View, Text, StyleSheet, TouchableOpacity} from "react-native";


const SelectedCategoryAndCountry = ({country, category, switchBetweenLists}) => {

    return (
        <View style={styling.container}>
            <TouchableOpacity
                onPress={() => switchBetweenLists('country')}
                style={styling.btnWrapper}
            >
                <Text style={{color: 'red'}}>
                    {country.name !== '' && country.flag !== '' ? `${country?.flag} ${country?.name}` : 'страна не выбрана'}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => switchBetweenLists('category')}
                style={styling.btnWrapper}
            >
                <Text style={{color: 'red'}}>
                    {category !== '' ? category : 'категория не выбрана'}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styling = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        height: 60,
        backgroundColor: 'black',
        borderWidth: 1,
        borderColor: 'rgb(255,103,37)',
    },
    btnWrapper: {
        width: 150
    }
})

export default SelectedCategoryAndCountry;