import {View, Text, TouchableOpacity} from 'react-native';
import {checkStorageValue} from "../../utils/workingWithStorageDevice";
import {useUserDataContext} from "../../utils/UserDataSaveContext";
const Settings = () => {
    const [userData, setUserData] = useUserDataContext();
    return (
        <View>
            <Text>Settings</Text>
            <TouchableOpacity
                onPress={checkStorageValue}
            >
                <Text>test get information on storage</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Settings;