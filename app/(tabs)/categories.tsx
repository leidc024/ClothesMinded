import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Dimensions  } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { FontAwesome } from '@expo/vector-icons'

import ItemList from '../../components/ItemList'

const { height } = Dimensions.get('window'); // Get screen height
const ITEM_HEIGHT = height * 0.125; // % of screen height



const home = () => {
    return (
        <SafeAreaView>
            <StatusBar style='dark' />
            {/* Header */}
            <View className="mt-4">
                <Text className="text-center text-2xl font-bold">Categories</Text>
            </View>

            {/* Search and Filter */}
            <View className="mt-4 mb-4 flex-row items-center justify-center">
                <View className="w-[70%] flex-row items-center rounded-full  bg-white px-4 py-3 shadow-md">
                    <FontAwesome name="search" size={18} color="gray" />
                    <TextInput
                        placeholder="Search"
                        className="flex-1 ml-3 text-lg"
                    />
                    <TouchableOpacity>
                        <FontAwesome name="close" size={18} color="gray" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity className="ml-3 rounded-lg bg-[#D2B48C] px-4 py-3 shadow-md">
                    <FontAwesome name="filter" size={18} color="white" />
                </TouchableOpacity>
            </View>
            <View className = "h-[78%] w-[100%] items-center justify-center">
                <ItemList />
            </View>
        </SafeAreaView>
    )
}

export default home