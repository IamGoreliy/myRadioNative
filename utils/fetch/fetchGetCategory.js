export const fetchGetListCategory = async (signal) => {
    try {
        const response = await fetch('https://de2.api.radio-browser.info/json/tags', {signal});
        if (!response.ok) {
            return;
        }
        return await response.json();
    } catch (e) {
        if (e.name === 'AbortError') {
            console.error('fetch для получения списка тегов отменен ')
        } else {
            console.error('не удалось загрузить список категорий', e);
        }
        throw e;
    }
}