import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity, FlatList, Dimensions, Image, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react';
import Search from '../../components/Search';
import AddClothesToCtgryPop from '../../components/Popups/AddClothesToCtgryPop';
import { useFocusEffect } from '@react-navigation/native';
import { type ClothesMap, loadCategoryElementsFromStorage, saveOneCategoryElementsToStorage,  saveClothesMap, loadClothesMap} from "@/utils/localStorage";
import { addClothesCategoriesDocument, removeClothesCategoriesDocumentWithClothingID } from "@/contexts/database";
import { useUser } from "@/contexts/UserContext";
import ImageViewing from 'react-native-image-viewing';

const { width } = Dimensions.get('window');
const numColumns = 3;
const itemMargin = 8;
const itemSize = (width - (numColumns + 1) * itemMargin) / numColumns;

type data = { id: string; title: string; uri: string };

const CategorySelection = () => {
    const { categoryTitle, categoryId } = useLocalSearchParams();
    const router = useRouter();
    const [items, setItems] = useState<data[]>([]);
    const [deleteMode, setDeleteMode] = useState(false);
    const [keyword, setKeyWord] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const {current: user} = useUser();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewerVisible, setViewerVisible] = useState(false);
    const [clothesMap, setClothesMap] = useState<ClothesMap>({});

    // Filter items based on keyword and sort alphanumerically
    const filteredItems = useMemo(() => {
        let result = items;
        if (keyword) {
            result = result.filter(item => item.title.toLowerCase().includes(keyword.toLowerCase()));
        }
        return result.slice().sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' }));
    }, [keyword, items]);

    const handleDeleteItem = async (id: string) => {
        if(user){
            removeClothesCategoriesDocumentWithClothingID(categoryId as string, id);
        }
        removeCategoryFromClothesMap(id, categoryId as string);
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const addCategoryToClothesMap = (itemId: string, categoryId: string) => {
        setClothesMap(prevMap => {
            const updated = {
                ...prevMap,
                [itemId]: [...(prevMap[itemId] || []), categoryId]
            }
            saveClothesMap(updated)
            return updated;
        });
    };

    const removeCategoryFromClothesMap = (itemId: string, categoryIdToRemove: string) => {
        setClothesMap(prevMap => {
            const updated = {
                ...prevMap,
                [itemId]: (prevMap[itemId] || []).filter(
                    categoryId => categoryId !== categoryIdToRemove
                ),
            }
            saveClothesMap(updated);
            return updated
        });
    };

    const handleAddItem = async (item: data) => {
        const data = {
            categoryID: categoryId as string,
            clothingDocumentID: item.id,
            title: item.title,
            uri: item.uri
        }
        if(user){
            addClothesCategoriesDocument(data);
        }
        addCategoryToClothesMap(item.id, categoryId as string);
        setItems((prev) => [...prev, item]);
    };

    React.useEffect(() => {
        const loadItems = async () => {
            try {
                // const saved = await AsyncStorage.getItem(`category-items-${categoryId}`);
                const [savedClothingItems, savedClothesMap] = await Promise.all([
                    loadCategoryElementsFromStorage(categoryId as string),
                    loadClothesMap()
                ]);

                if (savedClothingItems) setItems(savedClothingItems);
                if (savedClothesMap) setClothesMap(savedClothesMap);

            } catch (e) {
                // handle error
            }
        };
        loadItems();
    }, [categoryId]);

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                console.log("hey");
                console.log(items);
                // AsyncStorage.setItem(`category-items-${categoryId}`, JSON.stringify(items));
                saveOneCategoryElementsToStorage({id: categoryId as string, elements: items});
            };
        }, [items, categoryId])
    );

    return (
        <SafeAreaView className='bg-[#F5EEDC] flex-1'>
            <AddClothesToCtgryPop
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                selectedItems={items}
                onAddItem={handleAddItem}
            />
            <View className="flex-row items-center p-4 justify-between">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <Ionicons name="arrow-back" size={28} color="black" />
                    </TouchableOpacity>
                </View>
                <View className="flex-row items-center space-x-2">
                    <TouchableOpacity onPress={() => setDeleteMode(!deleteMode)} className="ml-2">
                        <Ionicons name="trash" size={28} color={deleteMode ? 'red' : 'black'} />
                    </TouchableOpacity>
                    <View className="w-2"></View>
                    <TouchableOpacity onPress={() => {
                            setShowAddModal(true);
                            setDeleteMode(false);
                        }} className="ml-2">
                        <Ionicons name="add" size={28} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            <View className="w-full items-center justify-center">
                <Text className="text-4xl font-bold">{categoryTitle}</Text>
            </View>
            <Search keyword={keyword} setKeyWord={setKeyWord} />
            <FlatList
                data={filteredItems}
                keyExtractor={item => item.id}
                numColumns={numColumns}
                contentContainerStyle={{ padding: itemMargin }}
                columnWrapperStyle={{ gap: itemMargin, marginBottom: itemMargin }}
                renderItem={({ item }) => (
                    <View style={{ alignItems: 'center', width: itemSize }} className="mb-2">
                        <View style={{ position: 'relative', width: itemSize, alignItems: 'center' }}>
                            <TouchableOpacity
                                className="w-24 h-32 bg-white rounded-2xl justify-center items-center "
                                activeOpacity={1}
                                onPress={() => {
                                    setCurrentIndex(filteredItems.findIndex(i => i.id === item.id));
                                    setViewerVisible(true);
                                }}
                            >
                                {deleteMode && (
                                    <TouchableOpacity
                                        onPress={() => handleDeleteItem(item.id)}
                                        style={{ position: 'absolute', top: 6, right: 6, zIndex: 2 }}
                                    >
                                        <Ionicons name="close-circle" size={28} color="red" />
                                    </TouchableOpacity>
                                )}
                                <Image
                                    source={{ uri: item.uri }}
                                    className="w-full h-full rounded-2xl border-2"
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-base font-semibold text-center mt-2"> </Text>
                    </View>
                )}
            />
            
            <ImageViewing
                images={filteredItems.map(item => ({ uri: item.uri }))}
                imageIndex={currentIndex}
                visible={viewerVisible}
                onRequestClose={() => setViewerVisible(false)}
            />
        </SafeAreaView>

    );
}

export default CategorySelection;