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
                {
                    headerSelectCategory: {
                        category: 'Категорія не обрана',
                        country: 'Країна не обрана',
                    },
                    countryList: {
                        windowPending: 'Завантаження',
                        message: 'ні ця країна не заслуговує щоб її слухали. ЗАБЛОКОВАНО',
                    }
                },
                {
                    messageListNotFount: 'Вибачте, нічого не знайдено. Спробуйте змінити країну/категорію або додайте щось до улюбленого.',
                }
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
                    headerSelectCategory: {
                        country: 'The country is not chosen',
                        category: 'The category is not chosen',
                    },
                    countryList: {
                        windowPending: 'Loading',
                        message: 'This country is blocked',
                    },
                },
                {
                    messageListNotFount: 'Sorry, nothing found. Try to change the country/category or add something to your favorites.',
                }
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
                    headerSelectCategory: {
                        category: 'категория не выбрана',
                        country: 'страна не выбрана',
                    },
                    countryList: {
                        windowPending: 'Загрузка',
                        message: 'Та неее. Выбири другую страну и слушай нормальное радио',
                    },
                },
                {
                    messageListNotFount: 'Извините, ничего не найдено. Попробуйте изменить страну/категорию или добавьте что-то в избранное.',
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