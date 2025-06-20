import {Tabs} from "expo-router";
import {SearchRadioStationContext} from "../components/SearchRadioStationContext";

const TabsLayout = () => {
    return (
        <SearchRadioStationContext>
            <Tabs>
                <Tabs.Screen
                    name={'index'}
                    options={{
                        title: 'Home',
                        headerShown: false
                    }}
                />
                <Tabs.Screen
                    name={'station'}
                    options={{
                        title: 'Station',
                        headerShown: false
                    }}
                />
                <Tabs.Screen
                    name={'settings'}
                    options={{
                        title: 'Settings',
                        headerShown: false
                    }}
                />
            </Tabs>
        </SearchRadioStationContext>
    )
}

export default TabsLayout;