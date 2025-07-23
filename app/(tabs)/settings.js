import {View, Text, TouchableOpacity} from 'react-native';
import {checkStorageValue} from "../../utils/workingWithStorageDevice";
import {useUserDataContext} from "../../utils/UserDataSaveContext";
const Settings = () => {
    const [userData, setUserData] = useUserDataContext();
    return (
        <View>
        </View>
    )
}

export default Settings;