import React, { memo, useContext } from 'react';
import { Tabs } from 'expo-router';
import icons from '@/assets/icons';
import { View, Image, ImageSourcePropType } from 'react-native';

type TabIconProps = {
    icon: ImageSourcePropType; // Icon source type
    name: string;
    focused: boolean; // Whether the tab is currently focused
};

const TabIcon: React.FC<TabIconProps> = memo(({ icon, focused }) => (
    <View className="flex items-center justify-center">
        <View
            style={{
                width: 40, // Width of the circle
                height: 40, // Height of the circle
                borderRadius: 25, // Makes it circular
                backgroundColor: focused ? '#BB8860' : 'white', // Different color for focused
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2, // Optional: Add border for styling
                borderColor: 'black',
                marginTop:30// Border color
            }}
        >
            <Image
                source={icon}
                resizeMode="contain"
                style={{
                    width: 24,
                    height: 24,
                    tintColor: focused ? 'white' : 'black',
                    // Icon color changes on focus
                }}
            />
        </View>
    </View>
));

const Tabslayout: React.FC = () => {
    const commonOptions = (title: string, icon: ImageSourcePropType) => ({
        title,
        tabBarIcon: ({ focused }: { color: string; focused: boolean }) => (
            <TabIcon icon={icon} focused={focused} />
        ),
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
            backgroundColor: '#DBC0A4',
            height: 70, // Adjust the height of the tab bar
            paddingHorizontal: 30, // Widen the tab bar
            borderTopLeftRadius: 25, // Round the top-left corner
            borderTopRightRadius: 25, // Round the top-right corner
            position: 'absolute', // Make it float if needed
            bottom: 0, // Ensure it's at the bottom of the screen
        },

        tabBarItemStyle: {
            
            justifyContent: "center", // ✅ vertically center the icon
            alignItems: "center",
        },
    });

    return (
        <Tabs>
            <Tabs.Screen name="wardrobe" options={commonOptions('Wardrobe', icons.wardrobe)} />
            <Tabs.Screen name="home" options={commonOptions('Home', icons.home)} />
            <Tabs.Screen name="categories" options={commonOptions('Categories', icons.categories)} />
        </Tabs>
    );
};

export default Tabslayout;