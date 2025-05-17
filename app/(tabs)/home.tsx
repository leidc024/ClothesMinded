import { SafeAreaView, View, Text, Pressable, Modal, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons';

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

            <StatusBar style="dark" />
            <NewUserNamePop/>

        </SafeAreaView>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        paddingTop: 0,
        alignItems: 'center',
        backgroundColor: '#7F705F', // Updated background color
    },
    cameraContainer: {
        width: '75%', // Adjust width to focus on head only
        aspectRatio: 1/2, // Headshot-like aspect ratio
        borderRadius: 20, // Rounded corners
        overflow: 'hidden', // Ensures the camera view fits the rounded shape
        backgroundColor: 'black', // Placeholder background
        marginBottom: 10, // Space for text instructions below
    },
    permissionMessage: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
        marginBottom: 30,
        marginTop:20,
    },
    camera: {
        flex: 1,
    },
    instructions: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
        textAlign: 'center',
        marginBottom: 10, // Space between instructions and the button
    },
    button: {
        backgroundColor: '#6E5846', // Button color
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        zIndex: 2
    },
    buttonFlip: {
        backgroundColor: '#6E5846', // Button color
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        position: 'absolute',
        bottom: 20,
        right: 50,
        zIndex: 2
    },
    proceedButton:{
        backgroundColor: '#6E5846', // Button color
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        position: 'absolute',
        bottom: 15,
        left: 50,
        zIndex: 2
    },
    retryButton:{
        backgroundColor: '#6E5846', // Button color
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        position: 'absolute',
        bottom: 15,
        right: 50,
        zIndex: 2
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 1, // Above camera but below buttons
        opacity: 0.7, // Adjust transparency
        pointerEvents: 'none', // Allows touch through overlay
    },
    countdownContainer: {
        position: 'absolute',
        zIndex: 3,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    countdownText: {
        fontSize: 120,
        color: 'white',
        fontWeight: 'bold',
    },
});

