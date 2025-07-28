import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Toggler} from "../../../utils/reusedAnimationComponent/Toggler";
import {useUserDataContext} from "../../../utils/UserDataSaveContext";
import {useCallback} from "react";
import {useDataLangContext} from "../../(tabs)/_layout";
import {getCategoryTitles} from "../language/langTabsSettings";

const CreateBtn = ({title, countryFlag, handler, isActive, countrySection, userData}) => {
    return (
        <TouchableOpacity
            onPress={handler}
            style={styling.btnSelectLangMain}
        >
            <View
                style={styling.btnLabelWrapper}
            >
                <View>
                    <Text
                        style={styling.btnLabel(countrySection, userData.selectLanguage)}
                    >
                        {title}
                    </Text>
                    <Text>
                        {countryFlag}
                    </Text>
                </View>
                <Toggler isSelect={isActive}/>
            </View>

        </TouchableOpacity>
    )
}

const variantLanguages = [
    {
        title: 'Українська',
        countryFlag: '🇺🇦',
        codeCountry: 'UA',
    },
    {
        title: 'English',
        countryFlag: '🇺🇸',
        codeCountry: 'USA',
    },
    {
        title: 'Русский',
        countryFlag: '🇷🇺',
        codeCountry: 'RU',
    },
];


export const SelectLang = () => {
    const [userData, setUserData] = useUserDataContext();
    const [dataLang] = useDataLangContext();

    const handlerChangeLanguage = useCallback((value) => {
        setUserData(prevState => {
            return {
                ...prevState,
                selectLanguage: value,
            }
        })
    }, []);

    return (
        <View
            style={styling.mainView}
        >
            <Text
                style={styling.titleSection}
            >
                {getCategoryTitles(dataLang, 'settings')['titleSelectLang']}
            </Text>
            {variantLanguages.map((ele, index) => {
                const handlerChangleLangWithValue = () => handlerChangeLanguage(ele.codeCountry);
                return (
                    <CreateBtn
                        key={index}
                        title={ele.title}
                        countryFlag={ele.countryFlag}
                        isActive={ele.codeCountry === userData.selectLanguage}
                        handler={handlerChangleLangWithValue}
                        countrySection={ele.codeCountry}
                        userData={userData}
                    />
                )
            })}
        </View>
    )
}

const styling = StyleSheet.create({
    mainView: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.65)',
        borderWidth: 1,
        padding: 10,
    },
    titleSection: {
        color: 'black',
        fontSize: 24,
        fontWeight: "bold"
    },
    btnSelectLangMain: {
        marginTop: 10,
    },
    btnLabelWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center"
    },
    btnLabel: (countrySection, countrySelect) => ({
        color: countrySection === countrySelect ? 'green' :  'black',
        fontSize: 18,
        fontWeight: 'bold',
    })
})