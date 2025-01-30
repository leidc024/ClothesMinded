import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
const home = () => {
    return (
        <SafeAreaView>
            <View>
                <Text className='text-xl'>home</Text>
            </View>
            <StatusBar style='dark' />
        </SafeAreaView>
    )
}

export default home