import { makeRedirectUri } from 'expo-auth-session';
import Constants from 'expo-constants';

export const getRedirectUri = () => {
    // For Expo Go
    if (Constants.appOwnership === 'expo') {
      return makeRedirectUri({
        path: 'loading/'
      });
    }
    
    // For development/production builds
    return makeRedirectUri({
      scheme: 'myapp', // Replace with your actual app scheme
      path: 'loading/'
    });
};