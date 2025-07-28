import {View, Text, TouchableOpacity, ImageBackground, StyleSheet} from 'react-native';
import {checkStorageValue} from "../../utils/workingWithStorageDevice";
import {useUserDataContext} from "../../utils/UserDataSaveContext";
import {SelectLang} from "../components/settingsComponent/SelectLang";
import {background} from "./index";
const Settings = () => {
    const [userData, setUserData] = useUserDataContext();
    return (
        <ImageBackground
            source={background}
            style={styling.main}
        >
            <SelectLang/>
        </ImageBackground>
    )
}

const styling = StyleSheet.create({
    main: {
        flex: 1
    }
})

export default Settings;