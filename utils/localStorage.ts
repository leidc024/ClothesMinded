import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'wardrobe_images';

export const saveImagesToStorage = async (images: Record<string, string[]>) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    } catch (error) {
        console.error('Failed to save images', error);
    }
};