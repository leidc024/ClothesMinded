import { account } from "@/lib/appwrite";
import { addUserDocument } from '@/contexts/database.js';
import { OAuthProvider } from 'react-native-appwrite';
import { openAuthSessionAsync } from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';

export const handleGoogleAuth = async () => {
    try {
        const redirectUri = Linking.createURL('/'); // Redirect to back to the app at index screen

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
        // console.log(browserResult);
        
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

        const session = await account.createSession(userId, secret);

        if (!session) {
            throw new Error('Failed to create session');
        }

        const user = await account.get(); //Fetch user details
        if (user.prefs?.firstLogin === undefined) {
            // Mark first login in user's preferences (Optional)
            await account.updatePrefs({ firstLogin: false, hasAvatar: false });
            addUserDocument({
                userID: user.$id,
                name: user.name,
                email: user.email,
            });
            // Redirect to '/head'
            router.push('/(avatar)/head');
        } else if (user.prefs?.hasAvatar === false) {
            // Redirect to '/head'
            router.push('/(avatar)/head');
        }else {
            // Redirect to '/home'
            router.push('/home');
        }
        return true;

    } catch (error) {
        console.log(error)
        console.error(error);
        return false;
    }

};