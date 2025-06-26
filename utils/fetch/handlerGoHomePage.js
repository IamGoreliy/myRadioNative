import {Linking} from "react-native";
// import {Linking} from "expo-linking"; // не работает. ошибка при импорте

export const handlerGoHomePage = async (url, nameStation) => {
    if (!url) {
        alert('нет ссылки на домашнею страницу радиостанции');
        return;
    }
    // const supported = await Linking.canOpenURL(url);
    // if (supported) {
    //     console.log('supported', supported)
        try {
            await Linking.openURL(url);
        } catch (e) {
            console.log(e)
            alert(`ошибка. Не удалось открыть ссылку ${nameStation}`);
        }
    // } else {
    //     alert(`Ошибка. Невозможно перейти на домашнею страницу ${nameStation}`);
    // }
}