export const variantArlLink = (countrySearch, tagSearch, togglerSearch) => {
    const searchParamsByTag = new URLSearchParams({
        name: tagSearch,
    })
    const searchParamsByCountryCode = new URLSearchParams({
        countrycode: countrySearch,
    })

    return togglerSearch === 'category'
    ? tagSearch
            ? [
                `https://de1.api.radio-browser.info/json/stations/search?${searchParamsByTag}`,
                `https://de2.api.radio-browser.info/json/stations/search?${searchParamsByTag}`,
                `https://fi1.api.radio-browser.info/json/stations/search?${searchParamsByTag}`,
            ]
            : [
                "https://de1.api.radio-browser.info/json/stations/search?name=''",
                "https://de2.api.radio-browser.info/json/stations/search?name=''",
                "https://fi1.api.radio-browser.info/json/stations/search?name=''",
            ]
    : countrySearch
            ? [
                `https://de1.api.radio-browser.info/json/stations/search?${searchParamsByCountryCode}`,
                `https://de2.api.radio-browser.info/json/stations/search?${searchParamsByCountryCode}`,
                `https://fi1.api.radio-browser.info/json/stations/search?${searchParamsByCountryCode}`,
             ]
            : [
                "https://de1.api.radio-browser.info/json/stations/search?countrycode=''",
                "https://de2.api.radio-browser.info/json/stations/search?countrycode=''",
                "https://fi1.api.radio-browser.info/json/stations/search?countrycode=''",
            ]
    }