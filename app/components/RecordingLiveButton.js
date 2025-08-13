import {NativeModules, PermissionsAndroid, Platform, TouchableOpacity, View, StyleSheet} from "react-native";
import {useCallback, useState, useEffect} from "react";
const {VlcRecordingModule} = NativeModules;
import DocumentPicker  from 'react-native-document-picker';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const RecordingLiveButton = ({radioWave, sx}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [radioWaveURL, setRadioWaveURL] = useState('');
    const [selectFolderUri, setSelectFolderUri] = useState(null);


    useEffect(() => {
        if (radioWave) {
            setRadioWaveURL(radioWave['url_resolved']);
        }
    }, [radioWave]);

    const selectFolder = useCallback(async () => {
        try {
            const result = await DocumentPicker.pickDirectory()
            setSelectFolderUri(result.uri)
            alert('путь к папке:' + ' ' + result.uri)
        }catch (e) {
            if (DocumentPicker.isCancel(e)) {
                alert('выбор папки отменен')
            } else {
                console.log(e.message);
            }
            return null;
        }
    }, [])

    const requestStoragePermission = async () => {
        if (Platform.Version >= 33) {
            return true;
        }
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

        let folderUri = selectFolderUri;
        if (!folderUri) {
            folderUri = await selectFolder();
            if (!folderUri) return;
        }

        const hasPermission = await requestStoragePermission();
        if (!hasPermission && Platform.Version < 33) {
            alert('вы не предоставили разрещение на запись');
            return;
        }
        const stationName = radioWave['name'].trim().replace(/[^a-zA-Z0-9]/g, '_');
        const timesTamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/g, '');
        const fileName = `${stationName}_${timesTamp}.mp3`;

        try {
            const result = await VlcRecordingModule.startRecording(radioWaveURL, fileName, folderUri);
            console.log(result);
            setIsRecording(true);
            alert('запись началась');
        } catch (e) {
            console.log(e.message);
            alert('Ошибка начала записи');
        }
    }, [radioWaveURL, selectFolderUri])

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
        <View
            style={[styling.main, sx]}
        >
            <TouchableOpacity
                onPress={isRecording ? stopRecording : handlerStartRecording}
            >
                <FontAwesome5 name="record-vinyl" size={34} color={isRecording ? "red" : "black"} />
            </TouchableOpacity>
        </View>
    )
}

const styling = StyleSheet.create({
    main: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default RecordingLiveButton;