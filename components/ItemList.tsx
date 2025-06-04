import React, { useState, useContext, useEffect } from 'react';
import { FlatList, Text, View, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CreateCategoryContext } from '../contexts/CreateCategoryContext';
import { saveCategoriesToStorage, loadCategoriesFromStorage, insertCategoryToStorage, removeACategoryWithElements } from '@/utils/localStorage';
import { addCategoryDocument, generateID, removeCategoryDocument } from '@/contexts/database';
import { useUser } from '@/contexts/UserContext';
import { router } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import { RelativePathString } from 'expo-router';

type Category = { id: string; title: string; iconUri?: string };
type ItemListProps = { keyword: string };

const ItemList = ({ keyword }: ItemListProps) => {
    const {current: user} = useUser();
    const { 
        titleCategory,
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
            setCategoryList(savedCategories || []);
        };
        load();
    }, []);

    // Handle adding to list
    useEffect(() => {
        if (titleCategory.trim() !== '') {
            const newItem: Category = { id: generateID(), title: titleCategory.trim() };
            setCategoryList((prev: Category[]) => [...prev, newItem]);
            insertCategoryToStorage(newItem.id);
            if(user != null){
                addCategoryDocument(newItem.id, {categoryId: newItem.title, userID: user.$id});
            }
            setTitleCategory('');
        }
    }, [titleCategory]);

    // Save categories when categoryList changes
    useEffect(() => {
        const saveCategories = async () => {
            await saveCategoriesToStorage(categoryList);
        };
        saveCategories();
    }, [categoryList]);

    // Image picker logic
    const pickImage = async (categoryId: string) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setCategoryList((prev: Category[]) =>
                prev.map(cat =>
                    cat.id === categoryId ? { ...cat, iconUri: uri } : cat
                )
            );
        }
    };

    const filteredAndSortedList = categoryList
        .filter((item: Category) => item.title.toLowerCase().includes(keyword.toLowerCase()))
        .sort((a: Category, b: Category) => a.title.localeCompare(b.title));

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
                                        if (user != null){
                                            removeCategoryDocument(item.id);
                                        }
                                        removeACategoryWithElements(item.id);
                                        setCategoryList((prevList: Category[]) => prevList.filter(listItem => listItem.id !== item.id));
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
                                        getCategoryId(item.id);
                                        setCreateCategory(true);
                                    } else {
                                        const path = `/${item.title}/${item.id}` as RelativePathString;
                                        router.push(path);
                                        getCategoryTitle(item.title);
                                    }
                                }}
                            >
                                <TouchableOpacity
                                    onPress={() => pickImage(item.id)}
                                    style={{ aspectRatio: 1 }}
                                    className="h-3/4 items-center justify-center rounded-2xl border-2 overflow-hidden bg-white"
                                >
                                    {item.iconUri ? (
                                        <Image
                                            source={{ uri: item.iconUri }}
                                            style={{ width: '100%', height: '100%' }}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <Image
                                            source={require('../assets/icons/Union.png')}
                                            className="h-1/4"
                                            style={{ aspectRatio: 1 }}
                                            resizeMode="contain"
                                        />
                                    )}
                                </TouchableOpacity>
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