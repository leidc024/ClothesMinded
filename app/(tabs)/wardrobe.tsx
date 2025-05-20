import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { FontAwesome } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addClothingImage, addClothingDocument } from '@/contexts/database'
import { useUser } from '@/contexts/UserContext'

const STORAGE_KEY = 'wardrobe_images';

interface ImagesCollection {
  [key: string]: string[]; // All string keys will return string arrays
}

interface scrollComponent {
  [key: string]: number; // All string keys will return string arrays
}

const saveImagesToStorage = async (images: Record<string, string[]>) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    } catch (error) {
        console.error('Failed to save images', error);
    }
};

const loadImagesFromStorage = async (): Promise<Record<string, string[]> | null> => {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        return json != null ? JSON.parse(json) : null;
    } catch (error) {
        console.error('Failed to load images', error);
        return null;
    }
};

const Wardrobe = () => {
    const { current: user } = useUser();
    const [images, setImages] = useState<ImagesCollection>({
        Shirts: [],
        Jackets: [],
        Dress: [],
        Shorts: [],
        Pants: []
    });

    const [scrollPosition, setScrollPosition] = useState<scrollComponent>({
        Shirts: 0,
        Jackets: 0,
        Dress: 0,
        Shorts: 0,
        Pants: 0
    });

    useEffect(() => {
        const load = async () => {
            const stored = await loadImagesFromStorage();
            console.log(stored)
            if (stored) setImages(stored);
        };
        load();
    }, []);

    const handleAddImage = async (category: string) => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permission required", "Please allow access to your photos.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            const imageID = await addClothingImage(uri);
            if (imageID && user.$id){
                await addClothingDocument({
                    clothingID: imageID,
                    type: category,
                    userID: user.$id,
                });
                const updated = {
                    ...images,
                    [category]: [...images[category], uri]
                };
                setImages(updated);
                console.log(updated)
                await saveImagesToStorage(updated);
            }
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F5EEDC] px-4">
            <StatusBar style="dark" />
            <View className="mt-4">
                <Text className="text-center text-2xl font-bold">Wardrobe</Text>
            </View>

            <View className="mt-4 flex-row items-center justify-center">
                <View className="w-[70%] flex-row items-center rounded-full border border-gray-300 bg-white px-4 shadow-md">
                    <FontAwesome name="search" size={18} color="gray" />
                    <TextInput placeholder="Search" className="ml-3 flex-1 text-lg" />
                </View>
                <TouchableOpacity
                    onPress={() => router.push('/camera')}
                    className="ml-3 rounded-lg border border-gray-400 bg-[#D2B48C] px-4 py-3 shadow-md">
                    <FontAwesome name="camera" size={18} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView className="mt-6" showsVerticalScrollIndicator={false}>
                {Object.keys(images).map((category) => (
                    <CategorySection
                        key={category}
                        title={category}
                        imagesByCategory={images[category]}
                        scrollPosition={scrollPosition[category]}
                        setScrollPosition={(val: number) =>
                            setScrollPosition(prev => ({ ...prev, [category]: val }))
                        }
                        onAddImage={() => handleAddImage(category)}
                        onDeleteImage={(indexToDelete: number) => {
                            const updatedCategory = images[category].filter((_, idx) => idx !== indexToDelete);
                            const updatedImages = {
                                ...images,
                                [category]: updatedCategory
                            };
                            setImages(updatedImages);
                            saveImagesToStorage(updatedImages);
                        }}
                    />
                ))}
                <View className="h-20" />
            </ScrollView>
            
        </SafeAreaView>
    );
};

const CategorySection = ({
    title,
    imagesByCategory,
    scrollPosition,
    setScrollPosition,
    onAddImage,
    onDeleteImage
}: {
    title: string;
    imagesByCategory: string[];
    scrollPosition: number;
    setScrollPosition: (val: number) => void;
    onAddImage: () => void;
    onDeleteImage: (indexToDelete: number) => void;
}) => {
    return (
        <View className="mb-6">
            <Text className="text-xl font-semibold">{title}</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={true}
                onScroll={(e) => {
                    let offset = e.nativeEvent.contentOffset.x;
                    let totalWidth = e.nativeEvent.contentSize.width - e.nativeEvent.layoutMeasurement.width;
                    setScrollPosition((offset / totalWidth) * 100 || 0);
                }}
                scrollEventThrottle={16}
                className="mt-2"
                contentContainerStyle={{
                    paddingRight: 20,
                    minWidth: '100%',
                }}
            >
                <TouchableOpacity onPress={onAddImage}>
                    <View className="mx-2 flex h-32 w-24 items-center justify-center rounded-2xl border-2 border-black bg-white">
                        <Text className="text-4xl">+</Text>
                    </View>
                </TouchableOpacity>

                {imagesByCategory.map((img, i) => (
                    <ClothingItem
                        key={i}
                        image={img}
                        onDelete={() => {
                            Alert.alert(
                                'Delete Image',
                                'Are you sure you want to delete this image?',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    {
                                        text: 'Delete',
                                        style: 'destructive',
                                        onPress: () => onDeleteImage(i)
                                    }
                                ]
                            );
                        }}
                    />
                ))}
            </ScrollView>

            <View className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-300">
                <View
                    style={{ width: `${scrollPosition}%` }}
                    className="h-full rounded-full bg-black"
                />
            </View>
        </View>
    );
};



const ClothingItem = ({ image, onDelete }: { image: string, onDelete: () => void }) => (
    <TouchableOpacity onLongPress={onDelete}>
        <View className="mx-2 flex h-32 w-24 items-center justify-center rounded-2xl border bg-white">
            <Image
                source={{ uri: image }}
                className="h-full w-full rounded-2xl"
                resizeMode="contain"
            />
        </View>
    </TouchableOpacity>
);

export default Wardrobe;
