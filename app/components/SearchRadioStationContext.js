import {useState, createContext, useContext} from 'react'

const StationContext = createContext(null);

const initialState = {
    country: {
        flag: '',
        code: '',
        name: '',
        nameRu: '',
    },
    tag: '',
}

export const SearchRadioStationContext = ({children}) => {
    const [userSearchStation, setUserSearchStation] = useState(initialState)
    return (
        <StationContext.Provider value={[userSearchStation, setUserSearchStation]}>
            {children}
        </StationContext.Provider>
    )
}

export const    useSearchContext = () => {
    const context = useContext(StationContext);
    if (context === undefined) {
        throw new Error('контекст должен использоваться внутри StationContext.Provider');
    }
    return context
}