export const fetchGetListCountry = async () => {
    try{
            const listCountry = await fetch('https://fi1.api.radio-browser.info/json/countries');
        if (!listCountry.ok) {
            throw new Error('ошибка сервера');
        }
        return await listCountry.json();
    } catch (e) {
        console.error('не удалось загрузить список стран', e);
        return []
    }
}