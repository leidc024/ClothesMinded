import { account } from "@/lib/appwrite";
import { addUserDocument, getCategoryDocumentsByUserId } from '@/contexts/database.js';
import { OAuthProvider } from 'react-native-appwrite';
import { openAuthSessionAsync } from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { getRedirectUri } from "@/utils/redirectUri";
import { router } from 'expo-router';
import { getClothingItemsByUserID, getClothingURI, getClothesCategoriesItemsByCategoryIDs, getClothesMapWithClothingIDs } from "@/contexts/database.js";
import { saveCategoriesToStorage, saveImagesToStorage, saveCategoryElementsToStorage, saveClothesMap } from "@/utils/localStorage";


interface ImagesCollection {
  [key: string]: image[]; // All string keys will return string arrays
}

interface ClothesCategoryCollection {
    [key: string]: Array<{id: string; title: string; uri: string }>
}

interface image{id: string; uri: string};


export const handleGoogleAuth = async (init: any) => {
    try {
        // const redirectUri = Linking.createURL('/'); // Redirect to back to the app at index screen
        const redirectUri = getRedirectUri(); // Redirect to back to the app at index screen

        const response = await account.createOAuth2Token(
            OAuthProvider.Google,
            redirectUri
        );

        if(!response) {
            throw new Error('Failed to login');
        }

        const browserResult: any = await openAuthSessionAsync(
            response.toString(),
            redirectUri
        )

        //Console log browserResult to see what it returns
        console.log(browserResult);
        
        //browserResult will be equal to { type: 'dismiss'} when the user closes the browser (which even includes verifying their account via email) 
        //if account already exists, it will still throw this error

        /*
        if(browserResult.type != 'success') {
            throw new Error('Failed to login (1)');
        }
        */

        const url = new URL(browserResult.url);

        const secret = url.searchParams.get('secret')?.toString();
        const userId = url.searchParams.get('userId')?.toString();

        if (!secret || !userId) {
            throw new Error('Failed to login(2)');
        }
        
        try{
            if (await account.getSession('current')) {
                await account.deleteSession("current");
            }
        }catch (error) {
            console.log("No active session, user needs to authenticate.");
        }

        const session = await account.createSession(userId, secret);


        if (!session) {
            throw new Error('Failed to create session');
        }

        const user = await account.get(); //Fetch user details
        
        const clothesData = await getClothingItemsByUserID(user.$id); //Fetch clothing data
        const clothingIDs: string[] = []
        if (clothesData) {
            const clothingImages = await Promise.all(
                clothesData.map(async (item: any) => {
                    const id = item.clothingID;
                    const type = item.type;
                    const uri = await getClothingURI(item.clothingID);
                    return {id, type, uri};
                })
            );
            // console.log(clothingImages)
            // Save images to storage
            const images: ImagesCollection = {
                Shirts: [],
                Jackets: [],
                Dress: [],
                Shorts: [],
                Pants: []
            };


            clothingImages.forEach((item: any, index: number) => {
                const category = item.type;
                if (images[category]) {
                    images[category].push({
                        id: item.id,
                        uri: item.uri
                    });
                }
                clothingIDs.push(item.id)
            });
            console.log(images);
            saveImagesToStorage(images);
        }
        
        const [categoryData, clothesMapData] = await Promise.all([
            getCategoryDocumentsByUserId(user.$id),
            getClothesMapWithClothingIDs(clothingIDs)
        ]);

        console.log(clothesMapData);

        const categoryInfoToStoreInLocalStorage: Array<{id: string; title: string}> = []
        const categoryIDs: string[] = []
        const categoryElementsToStore: Array<{id: string; elements: {id: string; title: string; uri: string }[]}> = [];
        if(categoryData){
            categoryData.forEach((item) => {
                categoryInfoToStoreInLocalStorage.push({
                    id: item.$id,
                    title: item.categoryId
                });
                categoryIDs.push(item.$id);
            });

            const clothesCategoryData: ClothesCategoryCollection = await getClothesCategoriesItemsByCategoryIDs(categoryIDs);
            if (clothesCategoryData){
                categoryIDs.forEach((item) => {
                    categoryElementsToStore.push({
                        id: item,
                        elements: clothesCategoryData[item]
                    })
                })
            }

            console.log(categoryElementsToStore);
            await Promise.all ([
                saveClothesMap(clothesMapData),
                saveCategoriesToStorage(categoryInfoToStoreInLocalStorage),
                saveCategoryElementsToStorage(categoryElementsToStore)
            ]);
        }
        
        if (user.prefs?.firstLogin === undefined) {
            // Mark first login in user's preferences (Optional)
            await account.updatePrefs({ firstLogin: false, hasAvatar: false });
            addUserDocument({
                userID: user.$id,
                name: user.name,
                email: user.email,
            });
            // Redirect to '/head'
            router.push('/(avatar)/body');
        } else if (user.prefs?.hasAvatar === false || user.prefs?.hasAvatar === undefined) {
            // Redirect to '/head'
            router.push('/(avatar)/body');
        }else {
            // Redirect to '/home'
            router.push('/home');
        }
        init()
        return true;

    } catch (error) {
        console.log(error)
        console.error(error);
        return false;
    }

};