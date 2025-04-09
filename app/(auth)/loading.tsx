import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";
import { account } from "@/lib/appwrite"; //for testing purposes, will delete later

const router = useRouter();

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
        router.push("/sign-in"); // Navigate using Expo Router
        console.log("No active session, user needs to authenticate.");
    }
};


const LoadingScreen = async () => {
    const [loadingText, setLoadingText] = useState("Boost your confidence...");

    useEffect(() => {
        const textSequence = [
            "Manage your Outfits...",
            "Generate your own avatar...",
            "Virtually try-on clothes..."
        ];
        let index = 0;
        const interval = setInterval(() => {
            setLoadingText(textSequence[index]);
            index++;
            if (index === textSequence.length) clearInterval(interval);
        }, 1500);

        const timer = setTimeout(() => {
            checkUserSession(); // Run this when the screen loads
        }, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FCF9E8" }}>
            <LottieView
                source={require("@/assets/images/clothes.json")} // Replace with your Lottie animation file
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
            />
            <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 20 }}>{loadingText}</Text>
          
        </View>
    );
};

export default LoadingScreen;
