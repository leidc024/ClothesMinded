import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'; // Import insets hook
import { Stack } from 'expo-router';

const Avalayout = () => {
    const insets = useSafeAreaInsets();

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: '#7F705F',
                paddingTop: insets.top, // Apply safe area padding
                paddingBottom: insets.bottom,
            }}
        >
            {/* Render header */}
            <View
                style={{
                    alignItems: 'center',
                    paddingHorizontal: 16, // Equivalent to px-4
                    marginBottom: 15, // Equivalent to mb-3
                    marginTop: -20, // Move it closer to the top
                }}
            >
                <Text
                    style={{
                        fontFamily: 'serif',
                        fontWeight: 'bold',
                        fontSize: 28,
                        color: 'white',
                    }}
                >
                    ClothesMinded
                </Text>
                <Text
                    style={{
                        fontStyle: 'italic',
                        fontSize: 14,
                        color: 'white',
                        marginBottom: 20, // Equivalent to mb-5
                    }}
                >
                    Your Closet Becomes Your Personal Stylist
                </Text>
            </View>

            {/* Stack for routing */}
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="head" />
                <Stack.Screen name="body" />
                <Stack.Screen name="clothes" />
            </Stack>
        </SafeAreaView>
    );
};

export default Avalayout;
