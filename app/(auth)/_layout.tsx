import { View, Text } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';

import { UserProvider } from '@/contexts/UserContext';

const AuthLayout = () => {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen 
          name='sign-in'
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name='loading'
          options={{ headerShown: false }}
        />
      </Stack>
    </UserProvider>
  );
}

export default AuthLayout;