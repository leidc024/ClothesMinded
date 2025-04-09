import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from '../assets/images';

const App = () => {
    return (
        <SafeAreaView className="bg-primary h-full pt-2">
            <ScrollView contentContainerStyle={{ height: "100%" }}>
                <View className="flex h-full w-full items-center justify-center px-4">
                    {/* Logo */}
                    <Image
                        source={images.logo}
                        className="mb-4 mt-2 h-[120px] w-[200px]"
                        resizeMode="contain"
                    />

                    {/* Outfit Cards */}
                    <Image
                        source={images.cards}
                        className=" h-[350px] w-[300px]"
                        resizeMode="contain"
                    />

                    {/* App Name */}
                    <Text className="font-spartan-black text-center text-5xl font-bold text-[#8B5E3B]">
                      ClothesMinded
                    </Text>

                    {/* Tagline */}
                    <Text className=" text-secondary mt-2 text-center text-sm">
                        Your closet becomes your personal stylist
                    </Text>

                    {/* Get Started Button */}
                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/loading')}
                        className="w-[50%] mt-20 bg-[#C4A484] py-3 px-8 rounded-full"
                    >
                        <Text className="text-center text-lg font-bold text-white">
                            Get Started
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <StatusBar style="light" />
        </SafeAreaView>
    );
};

export default App;