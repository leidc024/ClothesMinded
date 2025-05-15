import React, { useCallback} from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import images from '@/assets/images';
import icons from '@/assets/icons';
import { handleGoogleAuth } from '@/contexts/googleAuth';
import { useUser } from '@/contexts/UserContext';

const { useEffect } = React;

const checkUserSession = async () => {
    const { current: user } = useUser(); // Import your UserContext
    try {
        console.log("User is logged in:", user);
        if (user.prefs?.hasAvatar === false){
            router.push('/(avatar)/head');
        }else{
            router.push('/(tabs)/home');
        }
    } catch (error) {
        console.log("No active session, user needs to authenticate.");
    }
};

const Signin = () => {
    //Checks if a session is already active, if true then redirect to home screen
    useEffect(() => {
        checkUserSession(); // Run this when the screen loads
    }, []);

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
                    onPress={handleGoogleAuth}
                    className="mt-5 w-[75%] rounded-full border border-[#747775] bg-[#FFFFFF] py-3 shadow-zinc-300"
                    activeOpacity={0.7}
                    >
                        <View className="flex flex-row items-center justify-center">
                            <Image         
                                source={icons.googleIcon} 
                                style={{ width: 20, height: 20 }} 
                                resizeMode="contain"
                            />
                            <Text className="font-roboto-medium text-black-300 ml-2 text-lg">Continue with Google</Text>
                        </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/(avatar)/clothes')}
                    className="mt-5 w-[75%] rounded-full border border-[#747775] bg-[#FFFFFF] py-3 shadow-zinc-300"
                    activeOpacity={0.7}
                >
                    <View className="flex flex-row items-center justify-center">
                       
                        <Text className="font-roboto-medium text-black-300 ml-2 text-lg">Clothes.tsx</Text>
                    </View>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

export default Signin;