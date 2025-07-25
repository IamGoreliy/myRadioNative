import {View, Text, TouchableOpacity} from 'react-native';
import {checkStorageValue} from "../../utils/workingWithStorageDevice";
import {useUserDataContext} from "../../utils/UserDataSaveContext";
import {SelectLang} from "../components/settingsComponent/SelectLang";
const Settings = () => {
    const [userData, setUserData] = useUserDataContext();
    return (
        <View>
            <SelectLang/>
        </View>
    )
}

export default Settings;