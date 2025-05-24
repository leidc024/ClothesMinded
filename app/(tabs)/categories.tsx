import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native'
import { useState, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { FontAwesome } from '@expo/vector-icons'

import ItemList from '../../components/ItemList'
import AddCategoryPop from '../../components/Popups/AddCategoryPop'
import CreateCategoryButton from '../../components/CreateCategoryButton'
import CategorySelection from '../../components/Popups/CategorySelectionPop'

import { CreateCategoryContext, CreateCategoryProvider } from '../../contexts/CreateCategoryContext';

const CategoriesComponent = () => {

    const [keyword, setKeyWord] = useState('');
    const [editMode, setEditMode] = useState(false);

    const { setEditCategory } = useContext(CreateCategoryContext);

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
        <SafeAreaView className=" bg-[#F5EEDC]">
            <StatusBar style='dark' />
            <View className='flex-row justify-between'>

            </View>

            {/* Header */}
            <View className="mt-2">
                <Text className="text-center text-2xl font-bold">Categories</Text>
            </View>

            {/* Search and Filter */}
            <View className="my-4 flex-row items-center justify-center">
                <View className="w-[70%] flex-row items-center rounded-full bg-white px-4 shadow-md">
                    <FontAwesome name="search" size={18} color="gray" />
                    <TextInput
                        placeholder="Search"
                        value={keyword}
                        onChangeText={setKeyWord}
                        className="ml-3 flex-1 text-lg"
                    />

                </View>

                <TouchableOpacity className="ml-3 rounded-lg border border-gray-400 bg-[#D2B48C] px-4 py-3 shadow-md" onPress={toggleEditCategory}>
                    <FontAwesome name="pencil" size={20} color="white" />
                </TouchableOpacity>

            </View>


            <View className = "mt-4">
                <CreateCategoryButton />
                <ItemList
                    keyword={keyword}
                />
                <AddCategoryPop />
            </View>
            <CategorySelection/>
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