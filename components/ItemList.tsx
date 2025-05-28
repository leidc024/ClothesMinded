import React, { useState, useContext, useEffect, useRef } from 'react';
import { FlatList, Text, View, Image, TouchableOpacity, Dimensions, Animated, Button } from 'react-native';
import { CreateCategoryContext } from '../contexts/CreateCategoryContext';
import { saveCategoriesToStorage, loadCategoriesFromStorage, insertCategoryToStorage } from '@/utils/localStorage';
import { addCategoryDocument, generateID, removeCategoryDocument } from '@/contexts/database';
import { useUser } from '@/contexts/UserContext';
import { router } from "expo-router";

//icons
import AntDesign from '@expo/vector-icons/AntDesign';

type ItemListProps = {
    keyword: string;
};

const ItemList = ({ keyword }: ItemListProps) => {
    const {current: user} = useUser();
    const { 
        titleCategory, //current title of the category
        setTitleCategory, 
        categoryList, 
        setCategoryList,
        editCategory,
        getCategoryId,
        setCreateCategory,          
        setCategorySelectionPop,
        getCategoryTitle,
    } = useContext(CreateCategoryContext);

    const { height, width } = Dimensions.get('window');
    const ITEM_HEIGHT = height * 0.125;
    const DELETE_BUTTON_WIDTH = width * 0.15;

    useEffect(() => {
        const load = async () => {
            const savedCategories = await loadCategoriesFromStorage();
            console.log(savedCategories);
            setCategoryList(savedCategories);
        };
        load();
    }, []);

    // Handle adding to list
    useEffect(() => {
        if (titleCategory.trim() !== '') {
            const newItem = { id: generateID(), title: titleCategory.trim() };
            setCategoryList((prev: { id: string; title: string }[]) => [...prev, newItem]);
            insertCategoryToStorage(newItem.id);
            if(user != null){
                addCategoryDocument(newItem.id, {categoryId: newItem.title, userID: user.$id});
            }
            setTitleCategory('');
        }
    }, [titleCategory]);

    // Separate effect to handle saving when categoryList changes
    useEffect(() => {
        const saveCategories = async () => {
            await saveCategoriesToStorage(categoryList);
        };
        saveCategories();
    }, [categoryList]); // Runs whenever categoryList changes

    const filteredAndSortedList = categoryList
        .filter((item: { id: string; title: string }) => item.title.toLowerCase().includes(keyword.toLowerCase()))
        .sort((a: { id: string; title: string }, b: { id: string; title: string }) => a.title.localeCompare(b.title));

    return (
        <View className='h-4/5 items-center justify-center'>
            <View className="w-full flex-1 pb-16">
                <FlatList
                    data={filteredAndSortedList}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={{
                                height: ITEM_HEIGHT,
                            }}
                            className="mt-5 flex-row items-center justify-center"
                        >
                            
                            {editCategory && (
                                <TouchableOpacity
                                    style={{
                                        width: DELETE_BUTTON_WIDTH,
                                        height: '100%',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: 5,
                                        backgroundColor: '#ff8080',
                                        borderRadius: 10,
                                    }}
                                    onPress={() => {
                                        removeCategoryDocument(item.id);
                                        setCategoryList((prevList: { id: string; title: string }[]) => prevList.filter(listItem => listItem.id !== item.id));
                                    }}
                                >
                                    <AntDesign 
                                        name="delete" 
                                        size={DELETE_BUTTON_WIDTH * 0.45} 
                                        color="black" 
                                    />
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity className="h-full w-3/4 flex-row items-center justify-center rounded-3xl border-2 bg-[#D2B48C] px-4"
                                onPress={() => {
                                    if (editCategory) {
                                        // Perform edit action
                                        getCategoryId(item.id);
                                        setCreateCategory(true);
                                        console.log('Edit action triggered for:', item.title);
                                    } else {
                                        // IDK WHY THIS IS GIVING AN ERROR BUT IT WORKS AHAHAHAHAHAHA
                                        router.push(`/${item.title}/${item.id}`);
                                        getCategoryTitle(item.title);
                                        console.log('Default action triggered for:', item.title);
                                    }
                                }}
                            >
                                <View style={{ aspectRatio: 1 }} className="h-3/4 items-center justify-center rounded-2xl border-2">
                                    <Image
                                        source={require('../assets/icons/Union.png')}
                                        className="h-1/4"
                                        style={{ aspectRatio: 1 }}
                                        resizeMode="contain"
                                    />
                                </View>
                                <Text className="ml-4 flex-1 text-lg font-bold">{item.title}</Text>

                                {editCategory && (
                                    <AntDesign 
                                        name="edit" 
                                        size={ITEM_HEIGHT * 0.25} 
                                        color="black" 
                                    />
                                )}

                            </TouchableOpacity>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    );
};

export default ItemList;
