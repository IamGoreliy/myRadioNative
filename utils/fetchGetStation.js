export const fetchGetStation = async (search = 'rock') => {
    try {
        const resultStation = await fetch(`https://de1.api.radio-browser.info/json/stations/search?name=${search}`);
        return await resultStation.json();
    }catch (e) {
        console.log(e)
    }
}