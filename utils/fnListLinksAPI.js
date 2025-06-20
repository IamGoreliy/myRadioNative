export const variantArlLink = (value, search) => {

    return value === 'all'
    ? [
        `https://de1.api.radio-browser.info/json/stations/search?name=${search}`,
        `https://de2.api.radio-browser.info/json/stations/search?name=${search}`,
        `https://fi1.api.radio-browser.info/json/stations/search?name=${search}`,
    ]
    : [
        `https://de1.api.radio-browser.info/json/stations/search?name=${search}&countrycode=${value}`,
        `https://de2.api.radio-browser.info/json/stations/search?name=${search}&countrycode=${value}`,
        `https://fi1.api.radio-browser.info/json/stations/search?name=${search}&countrycode=${value}`,
    ]
    }