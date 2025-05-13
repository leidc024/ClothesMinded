import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import { useState, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { FontAwesome } from '@expo/vector-icons'

import ItemList from '../../components/ItemList'
import AddCategoryPop from '../../components/Popups/AddCategoryPop'
import CreateCategoryButton from '../../components/CreateCategoryButton'
import { CreateCategoryContext, CreateCategoryProvider } from '../../contexts/CreateCategoryContext';

const CategoriesComponent = () => {

    const [keyword, setKeyWord] = useState('');
    const [editMode, setEditMode] = useState(false);
    const {setEditCategory} = useContext(CreateCategoryContext);

    const toggleEditCategory = () => {

        setEditMode(prev => !prev);

        if (editMode) {
            setEditCategory(true);
        }
        else {
            setEditCategory(false);
        }
    };

    return (
        <SafeAreaView >
            <StatusBar style='dark' />
            <View className='flex-row justify-between'>
                <TouchableOpacity className="border border-black rounded-lg px-4">
                    <Text 
                        className="font-semibold"
                        onPress={toggleEditCategory}
                    >Edit</Text>
                </TouchableOpacity>

            </View>
        
            {/* Header */}
            <View className="mt-2">
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

            
            <View>
                <CreateCategoryButton/>
                <ItemList
                    keyword={keyword}
                />
                <AddCategoryPop/>
            </View>       
        </SafeAreaView>
    )
}

export default function categories() {
    return (
        <CreateCategoryProvider>
            <CategoriesComponent />
        </CreateCategoryProvider>
    );
}