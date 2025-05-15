import { SafeAreaView, View, Text, Pressable, Modal, TouchableOpacity } from 'react-native';
import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons';
import uploadBundledImage from '../../client_test_env/client';

import { useRouter } from 'expo-router';

import NewUserNamePop from '../../components/Popups/NewUserNamePop'

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
                            router.push('../modal/profile');
                        }}
                    >
                        <Ionicons name="person-circle-outline" size={40} color="#4D2A0A" />
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity className='border border-black flex-1 items-center justify-center' 
                onPress={async () => {
                    await uploadBundledImage(); // Await the async function
                    console.log("Pressed!");
                }}
            >
                <Text className="text-xl font-bold text-black">PRESS THIS TO SEND PICTURES</Text>
            </TouchableOpacity>

            <StatusBar style="dark" />
            <NewUserNamePop/>

        </SafeAreaView>
    );
};

export default Home;
