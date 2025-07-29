import {Tabs} from "expo-router";
import {useUserDataContext} from "../../utils/UserDataSaveContext";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import {createContext, useEffect, useState, useContext} from "react";
import {userLanguage} from "../components/language/langTabsSettings";
import {StatusBar} from "expo-status-bar";
import {View} from "react-native";
import Constants from 'expo-constants';

const LanguageContext = createContext([]);

const initialStateLangData = [
    {
        name: 'index',
        title: ['Країна', 'Категорія'],
        inputPlaceholder: 'пошук'
    },
    {
        name: 'station',
        btnChange: ['Категорія', 'Країна'],
    },
    {
        name: 'settings',
        titleSelectLang: 'Оберіть мову',
    }
];


const TabsLayout = () => {
    const [userData] = useUserDataContext();
    const [langNavBtn, setLangNavBtn] = useState(['радіо', 'пошук хвилі', 'налаштування']);
    const [langDataForPage, setLangDataForPage] = useState(initialStateLangData);

    useEffect(() => {
        const {appLang: {btnNav, page}} = userLanguage(userData.selectLanguage);
        setLangNavBtn(btnNav);
        setLangDataForPage(page);
    }, [userData.selectLanguage]);

    return (
            <View style={{flex: 1, paddingTop: Constants.statusBarHeight, backgroundColor: '#191919'}}>
                <StatusBar
                    style="light"
                />
                <LanguageContext.Provider value={[langDataForPage]}>
                    <Tabs
                        screenOptions={{
                            tabBarActiveTintColor: '#ff00f4',
                            tabBarStyle: {
                                backgroundColor: '#191919',
                                borderTopColor: '#333333', // Добавим легкую границу сверху
                                borderTopWidth: 1,
                            },
                        }}
                    >
                        <Tabs.Screen
                            name={'index'}
                            options={{
                                title: langNavBtn[0],
                                headerShown: false,
                                tabBarIcon: () => <MaterialIcons name="radio" size={24} color='white' />
                            }}
                        />
                        <Tabs.Screen
                            name={'station'}
                            options={{
                                title: langNavBtn[1],
                                headerShown: false,
                                tabBarIcon: () => <MaterialCommunityIcons name="waveform" size={24} color="white" />
                            }}
                        />
                        <Tabs.Screen
                            name={'settings'}
                            options={{
                                title: langNavBtn[2],
                                headerShown: false,
                                tabBarIcon: () => <Ionicons name="settings" size={24} color="white" />
                            }}
                        />
                    </Tabs>
                </LanguageContext.Provider>
            </View>
    )
}
export default TabsLayout;

export const useDataLangContext = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('контекст должен использоваться внутри StationContext.Provider');
    }
    return context
}