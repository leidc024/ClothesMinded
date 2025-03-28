import { View, Text, TextInput, TouchableOpacity} from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { FontAwesome } from '@expo/vector-icons'

import ItemList from '../../components/ItemList'

const home = () => {

    const [keyword, setKeyWord] = useState('')

    return (
        <SafeAreaView >
            <StatusBar style='dark' />
            {/* Header */}
            <View className="mt-4">
                <Text className="text-center text-2xl font-bold">Categories</Text>
            </View>

            {/* Search and Filter */}
            <View className="my-4 flex-row items-center justify-center">
                <View className="w-[70%] flex-row items-center rounded-full  bg-white px-4 py-3 shadow-md">
                    <FontAwesome name="search" size={18} color="gray" />
                    <TextInput
                        placeholder="Search"
                        value = {keyword}
                        onChangeText = {setKeyWord}
                        className="flex-1 ml-3 text-lg"
                    />
                    <TouchableOpacity onPress={() => setKeyWord('')}>
                        <FontAwesome name="close" size={18} color="gray" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity className="ml-3 rounded-lg bg-[#D2B48C] px-4 py-3 shadow-md">
                    <FontAwesome name="filter" size={18} color="white" />
                </TouchableOpacity>
            </View>
        
            <ItemList 
                keyword={keyword}
            />
       
        </SafeAreaView>
    )
}

export default home