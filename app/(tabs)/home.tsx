import { SafeAreaView, View, Image, Pressable, Modal, TouchableOpacity, Dimensions, Text } from 'react-native';
import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

import NewUserNamePop from '../../components/Popups/NewUserNamePop'
import Avatar from '../../components/Avatar';

const { height } = Dimensions.get('window'); // Get screen height

const Home = () => {
    const router = useRouter();

    return (
        <SafeAreaView className="bg-primary items-center justify-center flex-1">    

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
                <Avatar />
            </View>
            <StatusBar style="dark" />
            <NewUserNamePop/>

        </SafeAreaView>
    );
};


export default Home;
