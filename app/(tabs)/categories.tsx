import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native'
import { useState, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { FontAwesome } from '@expo/vector-icons'

import ItemList from '../../components/ItemList'
import AddCategoryPop from '../../components/Popups/AddCategoryPop'
import CreateCategoryButton from '../../components/CreateCategoryButton'
import CategorySelection from '../../components/Popups/CategorySelectionPop'
import Search from '../../components/Search';

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
            <Search keyword={keyword} setKeyWord={setKeyWord} toggleEditCategory={toggleEditCategory} />
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