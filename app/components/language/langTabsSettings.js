const variantLanguages = [
    {
        countryCode: 'UA',
        appLang: {
            btnNav: [
                'радіо', 'пошук хвилі', 'налаштування',
            ],
            page: [
                {
                    name: 'index',
                    title: ['Країна', 'Категорія'],
                    inputPlaceholder: 'пошук'
                },
                {
                    name: 'station',
                    btnChange: ['Категорія', 'Країна'],
                    inputPlaceholder: 'пошук',
                },
                {
                    name: 'settings',
                    titleSelectLang: 'Оберіть мову',
                },

            ],
        }
    },
    {
        countryCode: 'USA',
        appLang: {
            btnNav: [
                'radio', 'search wave', 'settings',
            ],
            page: [
                {
                    name: 'index',
                    title: ['Country', 'Category'],
                    inputPlaceholder: 'search',
                },
                {
                    name: 'station',
                    btnChange: ['Category', 'Country'],
                    inputPlaceholder: 'search'
                },
                {
                    name: 'settings',
                    titleSelectLang: 'Select Language',
                },
                {
                    name: 'player',
                    alert: 'Radio wave is not chosen',
                    nameTrack: 'The name of the song',
                    loadingTrack: 'Loading the name of the track...',
                    btnGoHome: 'Go to home page',
                },
            ],
        }
    },
    {
        countryCode: 'RU',
        appLang: {
            btnNav: [
                'радио', 'поиск волны', 'настройки',
            ],
            page: [
                {
                    name: 'index',
                    title: ['Страна', 'Категория'],
                    inputPlaceholder: 'поиск',
                },
                {
                    name: 'station',
                    btnChange: ['Категория', 'Страна'],
                    inputPlaceholder: 'поиск'
                },
                {
                    name: 'settings',
                    titleSelectLang: 'Выбирите язык',
                },
                {
                    name: 'player',
                    alert: 'Радиоволна не выбрана',
                    nameTrack: 'Название песни',
                    loadingTrack: 'Загрузка названия трека...',
                    btnGoHome: 'Перейти на домашнюю страницу',
                },
            ],
        },
    }
];

export const userLanguage = (selectedLang) => {
    return variantLanguages.find(ele => ele.countryCode === selectedLang);
}

export const getCategoryTitles = (pageData, pageName = '') => {
    if (pageName === 'index') {
        return pageData[0];
    } else if (pageName === 'station') {
        return pageData[1];
    } else if (pageName === 'settings') {
        return pageData[2];
    } else if (pageName === 'player'){
        return pageData[3];
    } else {
        alert('ОШИБКА. внимательно посмотри на функцию getCategoryTitles данного сообщение не должно быть');
    }
}