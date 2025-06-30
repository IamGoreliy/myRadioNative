import {createContext, useContext, useState, useEffect, useRef} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {loadFavorite, saveFavorite} from "./workingWithStorageDevice";

//информация с настройками пользователя (поиск радиостанций)
const userDataInitialState = {
    searchCountry: '',
    searchCategory: '',
    saveStation: [],
};
//*** создание контекста для управления
const UserDataContext = createContext({});

//*** обертка контекста
export const UserDataSaveContext = ({children}) => {
    const [state, setState] = useState(userDataInitialState);
    const firstLoad = useRef(false);

    useEffect(() => {
        loadFavorite()
            .then(res => {
                const value = res !== null ? res : userDataInitialState
                setState(value);
            })
            .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        if (!firstLoad.current) {
            firstLoad.current = true;
            return;
        }
        saveFavorite(state)
            .catch(error => console.log(error))

    }, [firstLoad.current, state])



    return (
        <UserDataContext.Provider value={[state, setState]} >
            {children}
        </UserDataContext.Provider>
    )
}

//*** создание хука контекста для удобства
export const useUserDataContext = () => {
    const context = useContext(UserDataContext);
    if (context === undefined) {
        console.log('нет контекста');
        throw new Error ('нет контекста');
    }

    return context;
}