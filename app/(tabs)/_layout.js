import {Tabs} from "expo-router";
import {SearchRadioStationContext} from "../components/SearchRadioStationContext";
import {UserDataSaveContext} from "../../utils/UserDataSaveContext";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const TabsLayout = () => {
    return (
        <UserDataSaveContext>
            <SearchRadioStationContext>
                <Tabs
                    screenOptions={{
                        tabBarActiveTintColor: '#ff00f4'
                    }}
                >
                    <Tabs.Screen
                        name={'index'}
                        options={{
                            title: 'радио',
                            headerShown: false,
                            tabBarIcon: () => <MaterialIcons name="radio" size={24} color='black' />
                        }}
                    />
                    <Tabs.Screen
                        name={'station'}
                        options={{
                            title: 'поиск волны',
                            headerShown: false,
                            tabBarIcon: () => <MaterialCommunityIcons name="waveform" size={24} color="black" />
                        }}
                    />
                    <Tabs.Screen
                        name={'settings'}
                        options={{
                            title: 'настройки',
                            headerShown: false,
                            tabBarIcon: () => <Ionicons name="settings" size={24} color="black" />
                        }}
                    />
                </Tabs>
            </SearchRadioStationContext>
        </UserDataSaveContext>
    )
}

export default TabsLayout;