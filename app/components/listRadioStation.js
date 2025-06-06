import {FlatList, View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {Image} from "expo-image";
import {LinearGradient} from "expo-linear-gradient";
import {useState} from "react";

const logoPlaceholder = require('../../assets/logoByGemini.webp');

const ListRadioStation = ({listStation, fnSelectedRadio}) => {
    const [stationSelect, setStationSelect] = useState(null)
    return (

        //вариант 2

        <FlatList
            data={listStation}
            contentContainerStyle={styling.mapList}
            renderItem={({item, index}) => {
                return (
                    <TouchableOpacity
                        onPress={() => {
                            fnSelectedRadio(item)
                            setStationSelect(index)
                        }}
                        style={styling.wrapperStation(index, stationSelect)}
                    >
                        <Image
                            style={styling.logoStation}
                            source={item.favicon ? {uri: item.favicon} : logoPlaceholder}
                        />
                        <Text
                            style={styling.nameStation}
                        >
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                )
            }}
            keyExtractor={(item, index) => index.toString()}
        />

    )
}

const styling = StyleSheet.create({
    mapList: {
        width: '96%',
        marginHorizontal: '2%',
    },
    gradientTop: (index) => ({
        width: '96%',
        marginHorizontal: '2%',
        height: 3,
        marginTop: index !== 0 ? 4 : 0,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    }),
    gradientBottom: {
        width: '96%',
        height: 3,
        marginHorizontal: '2%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    wrapperStation: (index, stationId) =>  ({
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        width: '100%',
        height: 40,
        // borderWidth: 1,
        // borderColor: "#7ffaf8",
        marginTop: index !== 0 ? 4 : 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderWidth: 1,
        borderColor: stationId !== index ? '#78f8f0' : '#c777b0',
        borderRadius: 10,
        // borderLeftColor: "#c777b0",
        // borderRightColor: "#78f8f0",
        // borderLeftWidth: 5,
        // borderRightWidth: 5,
    }),
    logoStation: {
        width: 40,
        height: 20,
    },
    nameStation: {
        color: 'white'
    }
})
export default ListRadioStation;


//вариант 1
// <View>
//     <FlatList
//         data={listStation}
//         contentContainerStyle={styling.mapList}
//         renderItem={({item, index}) => {
//             return (
//                 <>
//                     <LinearGradient
//                         colors={[
//                         '#78f8f0',
//                         '#5fc4c3',
//                         '#3eb7b6',
//                         '#2993ad',
//                         '#2f408d',
//                         '#443283',
//                         '#7461ad',
//                         '#ae71b4',
//                         '#c777b0',
//                         '#f4e3f3',
//                     ]}
//                         start={{x: 0, y: 0}}
//                         end={{x: 1, y: 0}}
//                         style={styling.gradientTop(index)}
//                     />
//                     <View
//                         style={styling.wrapperStation}
//                     >
//                         <Image
//                             style={styling.logoStation}
//                             source={item.favicon ? {uri: item.favicon} : logoPlaceholder}
//                         />
//                         <Text
//                             style={styling.nameStation}
//                         >
//                             {item.name}
//                         </Text>
//                     </View>
//                     <LinearGradient
//                         colors={[
//                             '#78f8f0',
//                             '#5fc4c3',
//                             '#3eb7b6',
//                             '#2993ad',
//                             '#2f408d',
//                             '#443283',
//                             '#7461ad',
//                             '#ae71b4',
//                             '#c777b0',
//                             '#f4e3f3',
//                         ]}
//                         start={{x: 1, y: 0}}
//                         end={{x: 0, y: 0}}
//                         style={styling.gradientBottom}
//                     />
//                 </>
//             )
//         }}
//         keyExtractor={(item, index) => index.toString()}/>
// </View>