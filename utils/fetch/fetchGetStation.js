

export const fetchGetStation = async (counter = 0, variantLink = []) => {
    const controller = new AbortController();
    const signal = controller.signal;
    const timeOutPromise = new Promise((_, reject) =>
        setTimeout(() => {
            controller.abort();
            reject(new Error('Request timed out'));
        }, 3000)
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
        if (counter > variantLink.length) {
            alert('не получилось загрузить список радиостанций');
            return [];
        }
        return await fetchGetStation(counter, variantLink);
    }catch (e) {
        console.error(e.message)
        counter += 1;
        if (counter > variantLink.length) {
            alert('не получилось загрузить список радиостанций');
            return [];
        }
        return await fetchGetStation(counter, variantLink);
    }
}