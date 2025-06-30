import {Linking} from "react-native";
// import {Linking} from "expo-linking"; // не работает. ошибка при импорте

//переход на домашнюю страницу радио
export const handlerGoHomePage = async (url, nameStation) => {
    if (!url) {
        alert('нет ссылки на домашнею страницу радиостанции');
        return;
    }

    // *** этот код нужен для expo-linking проверка можно ли перейти по ссылке
    // const supported = await Linking.canOpenURL(url);
    // if (supported) {
    //     console.log('supported', supported)
    //***

        try {
            await Linking.openURL(url);
        } catch (e) {
            console.log(e)
            alert(`ошибка. Не удалось открыть ссылку ${nameStation}`);
        }
    // **** продолжение кода для библиотеки expo-linking
    // } else {
    //     alert(`Ошибка. Невозможно перейти на домашнею страницу ${nameStation}`);
    // }
    // **** конец кода для expo-linking
}