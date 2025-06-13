export const fetchGetListCategory = async () => {
    try {
        const response = await fetch('https://de2.api.radio-browser.info/json/tags');
        if (!response.ok) {
            return;
        }
        return await response.json();
    } catch (e) {
        console.error('не удалось загрузить список категорий', e);
    }
}