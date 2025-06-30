import {Tabs} from "expo-router";
import {SearchRadioStationContext} from "../components/SearchRadioStationContext";
import {UserDataSaveContext} from "../../utils/UserDataSaveContext";

const TabsLayout = () => {
    return (
        <UserDataSaveContext>
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
        </UserDataSaveContext>
    )
}

export default TabsLayout;