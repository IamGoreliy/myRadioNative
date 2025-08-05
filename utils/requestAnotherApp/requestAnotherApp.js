import SendIntentAndroid from "react-native-send-intent";
import {Alert, Linking} from "react-native";

//🥑🥑🥑функция для открытия Spotify или Apple music🥑🥑🥑

export const openApp = async (trackName, handlerCloseWindowAction, titleApp, packageName, linkOne, linkTwo, linkForDownloadApp) => {
    try {
        const isSpotifyInstalled = await SendIntentAndroid.isAppInstalled(packageName);
        if (isSpotifyInstalled) {
            const encoding = encodeURIComponent(trackName.trim());
            const urlOne = `${linkOne}${encoding}`;
            const urlTwo = `${linkTwo}${encoding}`;
            const canOpenLink = await Linking.canOpenURL(urlOne);
            if (canOpenLink) {
                await Linking.openURL(urlOne);
            } else {
                const canOpenLinkTwo = await Linking.canOpenURL(urlTwo);
                if (canOpenLinkTwo) {
                    await Linking.openURL(urlTwo);
                } else {
                    Alert.alert('не удалось открыть ссылку');
                }
            }
        } else {
            Alert.alert(
                `${titleApp} не установлен`,
                `желаете установить ${titleApp}`,
                [
                    {
                        text: 'Да',
                        onPress: () => Linking.openURL(linkForDownloadApp),
                    },
                    {
                        'text': 'нет',
                        style: 'cancel',
                    }

                ]
            );
        }
    } catch (e) {
        console.log(e.message);
    }
    handlerCloseWindowAction();
}

//открытие браузера с название песни
export const openBrows = async (nameTrack, handlerCloseWindowAction) => {
    try {
        const encoding = encodeURIComponent(nameTrack.trim());
        await Linking.openURL(`https://www.google.com/search?q=${encoding}`);
    } catch (e) {
        console.log(e.message);
    }
    handlerCloseWindowAction();
}