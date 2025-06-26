import {View, Text, TouchableOpacity} from 'react-native';
import {testGetNameTrack} from "../../utils/fetch/testGetNameTrack";
const Settings = () => {
    return (
        <View>
            <Text>Settings</Text>
            <TouchableOpacity
                onPress={testGetNameTrack}
            >
                <Text>test fetch get name track</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Settings;