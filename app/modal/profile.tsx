import { View, Text, Pressable, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileModal() {
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);
    const { current: user, logout } = useUser(); // Assuming you have a user context to get the current user

    useEffect(() => {
        const loadImage = async () => {
            try {
                const savedImage = await AsyncStorage.getItem('profileImage');
                if (savedImage) {
                    setImage(savedImage);
                }
            } catch (error) {
                console.error("Failed to load image from AsyncStorage", error);
            }
        };

        loadImage();
    }, []);

    const handleLogout = async () => {
        try {
            await logout(); // Call the logout function from context
            await AsyncStorage.removeItem('profileImage'); // Clear saved image
            router.replace('/'); // Redirect to home screen after logout
        } catch (error) {
            Alert.alert("Logout Failed", "There was an error logging out. Please try again.");
            console.error("Logout error:", error);
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission required", "Permission to access media library is needed!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            setImage(uri);
            try {
                await AsyncStorage.setItem('profileImage', uri);
            } catch (error) {
                console.error("Failed to save image URI to AsyncStorage", error);
            }
        }
    };

    return (
        <View className="bg-primary flex-1 items-center justify-center">
            <View className="w-full flex-1 items-center rounded-b-[40px] rounded-t-[40px] bg-amber-50 px-6 pb-10 pt-12">
                {/* Title */}
                <Text className="mb-6 text-2xl font-bold">Profile</Text>

                {/* Avatar - clickable */}
                <Pressable onPress={pickImage} className="mb-12 h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-gray-300">
                    {image ? (
                        <Image source={{ uri: image }} className="h-full w-full" resizeMode="cover" />
                    ) : (
                        <Text className="text-4xl">👤</Text>
                    )}
                </Pressable>

                {/* Info Box */}
                <View className="w-full flex-1 justify-center">
                    <View className="w-full rounded-2xl bg-[#DBC0A4] p-6">
                        <Text className="mb-4 text-lg font-bold">Name: {user?.name ?? ""}</Text>
                        <Text className="text-lg font-bold">Email: {user?.email ?? ""}</Text>
                    </View>
                </View>

                {/* Buttons */}
                <View className="mt-4 w-[75%]">
                    <Pressable onPress={handleLogout} className="mb-4 rounded-full bg-[#4B2E18] py-4">
                        <Text className="text-center text-lg font-bold text-white">Sign Out</Text>
                    </Pressable>

                    <Pressable onPress={() => router.back()} className="bg-[#4B2E18] rounded-full py-4">
                        <Text className="text-center text-lg font-bold text-white">Close</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
