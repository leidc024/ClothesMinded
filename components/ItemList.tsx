import React, { useState, useContext, useEffect, useRef } from 'react';
import { FlatList, Text, View, Image, TouchableOpacity, Dimensions, Animated, Button } from 'react-native';
import { CreateCategoryContext } from '../contexts/CreateCategoryContext';

//icons
import AntDesign from '@expo/vector-icons/AntDesign';

type ItemListProps = {
    keyword: string;
};

const ItemList = ({ keyword }: ItemListProps) => {

    const { 
        titleCategory, //current title of the category
        setTitleCategory, 
        categoryList, 
        setCategoryList,
        editCategory,
        getCategoryId,
        setCreateCategory,
    } = useContext(CreateCategoryContext);

    const { height, width } = Dimensions.get('window');
    const ITEM_HEIGHT = height * 0.125;
    const DELETE_BUTTON_WIDTH = width * 0.15;

    useEffect(() => {

        if (titleCategory.trim() !== '') {
            const newItem = { id: Date.now().toString(), title: titleCategory.trim() };
            setCategoryList((prev: { id: string; title: string }[]) => [...prev, newItem]);
            setTitleCategory('');
        }
    }, [titleCategory]);

    const filteredAndSortedList = categoryList
        .filter((item: { id: string; title: string }) => item.title.toLowerCase().includes(keyword.toLowerCase()))
        .sort((a: { id: string; title: string }, b: { id: string; title: string }) => a.title.localeCompare(b.title));

    return (
        <View className='h-4/5 justify-center items-center'>
            <View className="flex-1 pb-16 w-full">
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
                                        backgroundColor: '#ddd',
                                        borderRadius: 10,
                                    }}
                                    onPress={() => {
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
                            <TouchableOpacity className="rounded-3xl flex-row border-2 w-3/4 h-full justify-center items-center px-4"
                                onPress={() => {
                                    if (editCategory) {
                                        // Perform edit action
                                        getCategoryId(item.id);
                                        setCreateCategory(true);
                                        console.log('Edit action triggered for:', item.title);
                                    } else {
                                        // Perform default action
                                        console.log('Default action triggered for:', item.title);
                                    }
                                }}
                            >
                                <View style={{ aspectRatio: 1 }} className="rounded-2xl h-3/4 border-2 justify-center items-center">
                                    <Image
                                        source={require('../assets/icons/Union.png')}
                                        className="h-1/4"
                                        style={{ aspectRatio: 1 }}
                                        resizeMode="contain"
                                    />
                                </View>
                                <Text className="flex-1 text-lg font-bold ml-4">{item.title}</Text>

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
