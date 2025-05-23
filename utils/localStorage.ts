import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'wardrobe_images';

export const saveImagesToStorage = async (images: Record<string, string[]>) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    } catch (error) {
        console.error('Failed to save images', error);
    }
};

export const removeImagesStored = async () => {
    const images = {
                Shirts: [],
                Jackets: [],
                Dress: [],
                Shorts: [],
                Pants: []
            };
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    } catch (error) {
        console.error('Failed to save images', error);
    }
};

export const loadImagesFromStorage = async (): Promise<Record<string, string[]> | null> => {
    try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        return json != null ? JSON.parse(json) : null;
    } catch (error) {
        console.error('Failed to load images', error);
        return null;
    }
};