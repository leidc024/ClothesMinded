import React from 'react';
import { Stack } from 'expo-router';

const AuthLayout = () => {
  return (
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
  );
}

export default AuthLayout;