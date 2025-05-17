import { SafeAreaView, View, Image, Pressable, Modal, TouchableOpacity, Dimensions, Text } from 'react-native';
import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

import NewUserNamePop from '../../components/Popups/NewUserNamePop'

const { height } = Dimensions.get('window'); // Get screen height

const Home = () => {
    const router = useRouter();

    return (
        <SafeAreaView className="bg-primary items-center justify-center flex-1">    
            {/* Top Section */}

            <View className="w-full flex-row justify-end mt-20 mr-20">
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
            <View className="items-center justify-center">
                <Image  
                    source={require('../../avatar_test/avatar.jpg')}
                    className="h-[90vh] aspect-square mt-24"
                    resizeMode='contain'
                />
            </View>
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: 40, // distance from the bottom
                    alignSelf: 'center', // center horizontally
                    zIndex: 10, // ensure it's above other content
                }}
            >
                <Text className="text-black text-2xl font-bold mt-4">Generate Avatar</Text>
            </TouchableOpacity>
            <StatusBar style="dark" />
            <NewUserNamePop/>

        </SafeAreaView>
    );
};


export default Home;
