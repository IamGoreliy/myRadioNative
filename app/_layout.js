import {Stack} from "expo-router";
import {UserDataSaveContext} from "../utils/UserDataSaveContext";

const RootLayout = () => {
    return (
        <UserDataSaveContext>
            <Stack>
                <Stack.Screen
                    name='(tabs)'
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
        </UserDataSaveContext>
    )
}



export default RootLayout;