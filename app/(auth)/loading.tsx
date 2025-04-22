import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useUser } from "@/contexts/UserContext"; // Import your UserContext
import LottieView from "lottie-react-native";
import { useRouter } from "expo-router";

const LoadingScreen = () => {
    const [loadingText, setLoadingText] = useState("Boost your confidence...");
    const { current: user } = useUser();
    const router = useRouter();

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
            if (user == null){
                router.push("/sign-in");                 // Navigate using Expo Router
            }else if(user.prefs?.hasAvatar === "false" || user.prefs?.hasAvatar === undefined){
                router.push('/(avatar)/head');
            }else{
                router.push('/(tabs)/home');
            }
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