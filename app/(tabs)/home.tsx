import { SafeAreaView, View, Text, Pressable, Modal, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const Home = () => {
    const router = useRouter();

    return (
        <SafeAreaView className="bg-primary flex-1">
            {/* Top Section */}
            <View className="flex-1 p-5">
                {/* Profile Button (top right corner) */}
                <View className="flex-1 items-end justify-start p-5">
                    <TouchableOpacity
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        onPress={() => {
                            console.log("Pressed!");
                            router.push('./modal/profile');
                        }}
                    >
                        <Ionicons name="person-circle-outline" size={40} color="#4D2A0A" />
                    </TouchableOpacity>
                </View>

            </View>

            <StatusBar style="dark" />
        </SafeAreaView>
    );
};

export default Home;
