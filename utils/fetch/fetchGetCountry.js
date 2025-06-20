export const fetchGetListCountry = async (signal) => {
    try{
        const listCountry = await fetch('https://de1.api.radio-browser.info/json/countries', {signal});
        if (!listCountry.ok) {
            throw new Error('ошибка сервера');
        }
        return await listCountry.json();
    } catch (e) {
        if (e.name === 'AbortError') {
            console.error('fetch для получение стран отменен');
        } else {
            console.error('не удалось загрузить список стран', e);
        }
        throw e;
    }
}