import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'wardrobe_images';
const CATEGORIES_KEY = 'category_data';

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
        console.error('Failed to remove images', error);
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

export const saveCategoriesToStorage = async (categories: Array<{id: string; title: string}>) => {
    try {
        console.log(categories);
        await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch (error) {
        console.error('Failed to save categories', error);
    }
};

export const loadCategoriesFromStorage = async (): Promise<Array<{id: string; title: string}>> => {
    try {
        const json = await AsyncStorage.getItem(CATEGORIES_KEY);
        return json != null ? JSON.parse(json) : [];
    } catch (error) {
        console.error('Failed to load categories', error);
        return [];
    }
};

export const removeCategoriesStored = async () => {
    try {
        await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify([]));
    } catch (error) {
        console.error('Failed to remove categories', error);
    }
};