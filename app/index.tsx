import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import images from '../assets/images';

const App = () => {
    return (
        <SafeAreaView className="flex-1 bg-[#FCF9E8]">
            <View className="flex-1 items-center justify-center">
                {/* Logo */}
                <Image
                    source={images.logo} 
                    className="mb-6 h-1/4"
                    resizeMode="contain"
                />

                {/* Title and Subtitle */}
                <View className="mb-10 items-center">
                  
                    <Text className=" font-spartan mt-10 text-center text-lg font-semibold text-[#4D2A0A]">
                        Your Closet Becomes {"\n"}
                        Your Personal Stylist
                    </Text>
                </View>

                {/* Buttons */}

                <TouchableOpacity
                    className=" mt-10 w-[75%] rounded-full bg-[#4D2A0A] px-6 py-3"
                    onPress={() => router.push('./sign-in')}
                    activeOpacity={0.7}


                >
                    <Text className="  text-center text-lg font-semibold text-white">Log-In</Text>

                </TouchableOpacity>

                <TouchableOpacity
                    className=" mt-5 w-[75%] rounded-full bg-[#4D2A0A] px-6 py-3 text-white"
                    onPress={() => router.push('/sign-up')}
                    activeOpacity={0.7}


                >
                    <Text className="text-center text-lg font-semibold text-white">Sign-Up</Text>

                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};


export default App;