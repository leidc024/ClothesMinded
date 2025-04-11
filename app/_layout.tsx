
import React, { useEffect } from 'react'
import { SplashScreen,Stack } from 'expo-router';
import "../global.css";
import {useFonts} from 'expo-font'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from '@/contexts/UserContext';


SplashScreen.preventAutoHideAsync();

const RootLayout = () => {

  const [fontsLoaded,error] = useFonts({
    'LeagueSpartan-Black': require('../assets/fonts/LeagueSpartan-Black.ttf'),
    'LeagueSpartan-Bold': require('../assets/fonts/LeagueSpartan-Bold.ttf'),
    'ABeeZee-Regular': require('../assets/fonts/ABeeZee-Regular.ttf'),
    'ABeeZee-Italic': require('../assets/fonts/ABeeZee-Italic.ttf'),
    'Roboto-Medium': require('../assets/fonts/Roboto-Medium.ttf'),
  });
  
  useEffect(() => {
    if (error) throw error;
  
    if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded,error])
  
  if(!fontsLoaded && !error){
    return null;
  }
  

  return (
    <UserProvider>
      <SafeAreaProvider>
        <Stack>
            <Stack.Screen name = "index" options={{headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(avatar)" options={{ headerShown: false }} />
            <Stack.Screen name = "(tabs)" options={{headerShown: false }} />
            <Stack.Screen name="modal/profile" options={{ presentation: 'fullScreenModal', headerShown: false, }} />
        </Stack>
      </SafeAreaProvider>
    </UserProvider>
  )
}

export default RootLayout;
  

  
