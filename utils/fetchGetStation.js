

export const fetchGetStation = async (search = 'rock', counter = 0) => {
    const variant = [
        'https://de1.api.radio-browser.info/json/stations/search?name=',
        'https://de2.api.radio-browser.info/json/stations/search?name=',
        'https://fi1.api.radio-browser.info/json/stations/search?name=',
    ];
    try {
        const response = await fetch(`${variant[counter]}${search}`);
        if (response.ok) {
            return await response.json();

        }
        counter += 1;
        if (counter > 2) {
            alert('не получилось загрузить список радиостанций');
            return;
        }
        return await fetchGetStation(search, counter);
    }catch (e) {
        console.error(e)
    }
}