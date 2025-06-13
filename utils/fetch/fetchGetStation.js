

export const fetchGetStation = async (search = 'rock', countryName= '', counter = 0, variantLink = []) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const timeOutPromise = new Promise((_, reject) =>
        setTimeout(() => {
            controller.abort();
            reject(new Error('Request timed out'));
        }, 10000)
    )
    try {
        const response = await Promise.race([
            fetch(variantLink[counter], {signal}),
            timeOutPromise,
        ])
        if (response.ok) {
            return await response.json();

        }
        counter += 1;
        if (counter > 2) {
            alert('не получилось загрузить список радиостанций');
            return [];
        }
        return await fetchGetStation(search, countryName, counter, variantLink);
    }catch (e) {
        console.error(e)
        counter += 1;
        if (counter > variantLink.length) {
            alert('не получилось загрузить список радиостанций');
            return [];
        }
        return await fetchGetStation(search, countryName, counter, variantLink);

    }
}