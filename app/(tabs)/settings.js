import {View, Text, TouchableOpacity, ImageBackground, StyleSheet} from 'react-native';
import {checkStorageValue} from "../../utils/workingWithStorageDevice";
import {useUserDataContext} from "../../utils/UserDataSaveContext";
import {SelectLang} from "../components/settingsComponent/SelectLang";
import {background} from "./index";
import { NativeModules } from 'react-native';

const { LibVLC } = NativeModules;

async function testLibVLC() {
    if (!LibVLC) {
        console.error('❌ Модуль LibVLC не найден. Убедись, что он добавлен в MainApplication.kt и имя соответствует.');
        return;
    }

    try {
        const result = await LibVLC.initialize();
        console.log('✅ LibVLC initialized:', result);
    } catch (error) {
        console.error('❌ Ошибка при вызове LibVLC.initialize:', error);
    }
}

const Settings = () => {
    const [userData, setUserData] = useUserDataContext();
    return (
        <ImageBackground
            source={background}
            style={styling.main}
        >
            <SelectLang/>
            <TouchableOpacity
                onPress={() => testLibVLC()}
            >
                <Text>тут тестирую либу влс</Text>
            </TouchableOpacity>
        </ImageBackground>
    )
}

const styling = StyleSheet.create({
    main: {
        flex: 1
    }
})

export default Settings;