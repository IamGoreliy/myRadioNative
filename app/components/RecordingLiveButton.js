import {NativeModules, PermissionsAndroid, Platform, TouchableOpacity, View} from "react-native";
import {useCallback, useState, useEffect} from "react";
const {VlcRecordingModule} = NativeModules;
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const RecordingLiveButton = ({radioWave}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [radioWaveURL, setRadioWaveURL] = useState('');

    useEffect(() => {
        if (radioWave) {
            setRadioWaveURL(radioWave['url_resolved']);
        }
    }, [radioWave]);

    const requestStoragePermission = async () => {
        try {
            const  granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Permission to access storage',
                    message: 'App needs access to your storage to save recordings.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            console.log('granted', granted);
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (e) {
            console.log(e.message);
            return false;
        }


    }


    const handlerStartRecording = useCallback(async () => {
        if (!radioWaveURL) {
            alert('радиоволна не выбрана');
            return;
        }
        const hasPermission = await requestStoragePermission();
        if (!hasPermission) {
            alert('вы не предоставили разрещение на запись');
            return;
        }
        const stationName = radioWave['name'].trim().replace(/[^a-zA-Z0-9]/g, '_');
        const timesTamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/g, '');
        const fileName = `${stationName}_${timesTamp}.mp3`;

        try {
            const result = await VlcRecordingModule.startRecording(radioWaveURL, fileName);
            console.log(result);
            setIsRecording(true);
            alert('запись началась');
        } catch (e) {
            console.log(e.message);
            alert('Ошибка начала записи');
        }
    }, [radioWaveURL])

    const stopRecording = useCallback(async () => {
        try {
            const result = await VlcRecordingModule.stopRecording();
            console.log(result);
            setIsRecording(false);
            alert('Запись остановлена. Проверте папку Music');
        }catch (e) {
            console.log(e.message);
            alert('ошибка остановки записи')
        }
    }, [])

    return(
        <View>
            <TouchableOpacity
                onPress={isRecording ? stopRecording : handlerStartRecording}
            >
                <FontAwesome5 name="record-vinyl" size={44} color="red" />
            </TouchableOpacity>
        </View>
    )
}

export default RecordingLiveButton;