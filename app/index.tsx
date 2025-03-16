import React, { useCallback} from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import images from '../assets/images';
import icons from '../assets/icons';
import { account } from "@/lib/appwrite"; //for testing purposes, will delete later
import { handleGoogleAuth } from '@/contexts/googleAuth';

const { useEffect } = React;

const checkUserSession = async () => {
    try {
        const user = await account.get();
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

const App = () => {
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
                    className=" mt-10 w-[75%] rounded-full bg-[#4D2A0A] px-6 py-3"
                    // onPress={() => router.push('./sign-in')}
                    onPress={() => router.push('/(auth)/sign-in')}
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

                <TouchableOpacity
                    onPress={handleGoogleAuth}
                    className="w-[75%] bg-[#FFFFFF] border border-[#747775] shadow-zinc-300 rounded-full py-3 mt-5"
                    activeOpacity={0.7}
                    >
                        <View className="flex flex-row items-center justify-center">
                            <Image         
                                source={icons.googleIcon} 
                                style={{ width: 20, height: 20 }} 
                                resizeMode="contain"
                            />
                            <Text className="font-roboto-medium text-lg text-black-300 ml-2">Continue with Google</Text>
                        </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default App;