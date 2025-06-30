import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITE_KEY = 'saveMyFavoriteStation';
export const loadFavorite = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(FAVORITE_KEY);
        return jsonValue !== null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error('ошибка загрузки данных с хранилища', e);
    }
}

export const saveFavorite = async (userData) => {
    try {
        const jsonValue = JSON.stringify(userData);
        await AsyncStorage.setItem(FAVORITE_KEY, jsonValue);
    }catch (e) {
        console.error('ошибка при записи на хранилище устройства', e);
    }
}

export const checkStorageValue = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(FAVORITE_KEY);
        const testvalue = JSON.parse(jsonValue);
        console.log(testvalue);
    } catch (e) {
        console.log('не получилось извлечь данные с хранилища', e);
    }
}