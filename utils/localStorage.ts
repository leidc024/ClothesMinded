import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'wardrobe_images';
const CATEGORIES_KEY = 'category_data';
const CATEGORY_ELEMENTS_KEY = 'category_element_data'
const CLOTHES_MAP_KEY = 'clothes_map_key'

type data = {id: string; title: string; uri: string };
type image = {id: string; uri: string};
// mapping of clothes to the categories they were stored
export type ClothesMap = {[id: string]: string[]};

export const saveImagesToStorage = async (images: Record<string, image[]>) => {
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

export const loadImagesFromStorage = async (): Promise<Record<string, image[]> | null> => {
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

// function that takes only 
export const saveOneCategoryElementsToStorage = async (categoryElements: {id: string; elements: data[]}) => {
    try {
        const existing = await loadAllCategoryElementsFromStorage();
        // console.log('Existing array:', JSON.stringify(existing, null, 2));
        // Update the array
        const updated = existing.map(item => 
                item.id === categoryElements.id 
                    ? { ...item, elements: categoryElements.elements }
                    : item
            );
        // console.log('Updated array:', JSON.stringify(updated, null, 2));
        await saveCategoryElementsToStorage(updated);
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
            if (filtered && filtered[0]){
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

// Modified function
export const removeElementEverywhere = async (elementID: string) => {
    const existing = await loadAllCategoryElementsFromStorage();
    
    // Pre-allocate array and use for-loop (faster than map+filter)
    const updatedCategories = [];
    for (let i = 0; i < existing.length; i++) {
        const category = existing[i];
        const elements = [];
        
        // Manual filter (avoids .filter() closure overhead)
        for (let j = 0; j < category.elements.length; j++) {
            if (category.elements[j].id !== elementID) {
                elements.push(category.elements[j]);
            }
        }
        updatedCategories.push({ ...category, elements });
    }

    await saveCategoryElementsToStorage(updatedCategories);
};

export const removeElementFromCategories = async (elementID: string, categoryIDs: string[] ) => {
    if (!categoryIDs?.length) return; // Exit early if no categories to update

    // 1. Load only if needed
    const existing = await loadAllCategoryElementsFromStorage();

    // 2. Update SPECIFIC categories (no full scan)
    const updatedCategories = existing.map(category => 
        categoryIDs.includes(category.id)
        ? {
            ...category,
            elements: category.elements.filter(e => e.id !== elementID)
        }
        : category // Unaffected categories pass through
    );

    // 3. Save changes
    await saveCategoryElementsToStorage(updatedCategories);
};

// function for removing the categories 
export const removeCategoryElementsStored = async () => {
    try {
        await AsyncStorage.setItem(CATEGORY_ELEMENTS_KEY, JSON.stringify([]));
    } catch (error) {
        console.error('Failed to remove categories', error);
    }
};

export const loadClothesMap = async (): Promise<ClothesMap | null> => {
    try {
        const json = await AsyncStorage.getItem(CLOTHES_MAP_KEY);
        return json != null ? JSON.parse(json) : null;
    } catch (error) {
        console.error('Failed to load categories', error);
        return null;
    }
}

export const saveClothesMap = async(clothesMap: ClothesMap) => {
    try {
        await AsyncStorage.setItem(CLOTHES_MAP_KEY, JSON.stringify(clothesMap));
    } catch (error) {
        console.error('Failed to save clothes map', error);
    }
}

export const removeClothesMap = async () => {
    try{
        await AsyncStorage.setItem(CLOTHES_MAP_KEY, JSON.stringify({}))
    } catch (error) {
        console.log('Failed to remove clothes map', error);
    }
}