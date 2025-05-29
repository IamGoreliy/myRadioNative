import {Tabs} from "expo-router";

const TabsLayout = () => {
    return (
        <Tabs>
            <Tabs.Screen name={'index'} options={{title: 'home'}}/>
        </Tabs>
    )
}

export default TabsLayout;