import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'wardrobe_images';
const CATEGORIES_KEY = 'category_data';
const CATEGORY_ELEMENTS_KEY = 'category_element_data'

type data = { id: string; title: string; uri: string };

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


// function for saving all categories containing their each own elements
export const saveCategoryElementsToStorage = async (categoryElements: Array<{id: string; elements: data[]}>) => {
    try{
        await AsyncStorage.setItem(CATEGORY_ELEMENTS_KEY, JSON.stringify(categoryElements));
    } catch (error){
        console.error('Failed to save category elements', error);
    }
}

// function for inserting a new category with empty elements given title. Used when creating new categories
export const insertCategoryToStorage = async (categoryId: string) => {
    try{
        const existingCategories = await loadAllCategoryElementsFromStorage();
        existingCategories.push({id: categoryId, elements: []});
        await saveCategoryElementsToStorage(existingCategories);
    }catch(error){
        console.error('Failed to insert category', error);
    }
}

// function for loading the elements of a given category
export const loadCategoryElementsFromStorage = async (id: string): Promise<data[]> => {
    try{
        const existingCategories = await loadAllCategoryElementsFromStorage();
        if (existingCategories){
            const filtered = existingCategories.filter((item) => item.id === id);
            if (filtered){
                return (filtered[0].elements);
            }else return [];
        }
        return [];
    }catch(error){
        console.error('Failed to fetch category', error);
        return [];
    }
}

// function for loading all of the elements for all categories
export const loadAllCategoryElementsFromStorage = async (): Promise<Array<{id: string; elements: data[]}>> => {
    try {
        const json = await AsyncStorage.getItem(CATEGORY_ELEMENTS_KEY);
        // console.log(json)
        return json != null ? JSON.parse(json) : [];
    } catch (error) {
        console.error('Failed to load categories', error);
        return [];
    }
};

export const removeACategoryWithElements = async (id: string) => {
    try{
        const existing = await loadAllCategoryElementsFromStorage();
        const filtered = existing.filter((item) => item.id != id);
        await saveCategoryElementsToStorage(filtered);

    }catch(error){
        console.error("Failed to remove category", error);
    }
}

// function for removing the categories 
export const removeCategoryElementsStored = async () => {
    try {
        await AsyncStorage.setItem(CATEGORY_ELEMENTS_KEY, JSON.stringify([]));
    } catch (error) {
        console.error('Failed to remove categories', error);
    }
};
