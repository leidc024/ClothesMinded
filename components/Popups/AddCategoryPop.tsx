import React, { useState, useContext, useEffect } from 'react';
import { Modal, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { CreateCategoryContext } from '../../contexts/CreateCategoryContext';

const AddCategoryPop = () => {
    const {
        createCategory,
        setCreateCategory,
        setTitleCategory,
        categoryList,
        categoryId,
        editCategory,
        setCategoryList
    } = useContext(CreateCategoryContext);

    const [title, setTitle] = useState(() => {
        const item = categoryList.find((item: { id: string; title: string }) => item.id === categoryId);
        return item ? item.title : '';
    });

    const [isDuplicate, setIsDuplicate] = useState(false);

    useEffect(() => {
        const duplicate = categoryList.some(
            (item: { title: string }) => item.title.trim() === title.trim()
        );

        setIsDuplicate(duplicate);
    }, [title, categoryList]);

    const handleConfirm = () => {
        if (editCategory) {
            setCategoryList((prev: { id: string; title: string }[]) =>
                prev.map((item) =>
                    item.id === categoryId ? { ...item, title: title.trim() } : item
                )
            );
        } else if (!isDuplicate && title.trim() !== '') {
            setTitleCategory(title.trim());
        }

        setCreateCategory(false);
        setTitle('');
    };

    const handleCancel = () => {
        setCreateCategory(false);
        setTitle('');
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 items-center justify-center">
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={createCategory}
                >
                    <View className="flex-1 items-center justify-center bg-black/40">
                        <View className="w-80 items-center rounded-2xl border border-black bg-[#D2B48C] p-6">
                            <Text className="mb-2 text-2xl font-bold">Category</Text>
                            <Text className="mb-4 text-center text-gray-800">Enter the name of the new category</Text>

                            <TextInput
                                onChangeText={setTitle}
                                value={title}
                                className="mb-4 w-full rounded-md border border-black bg-[#f5f7fa] px-4 py-2"
                                placeholder="Enter title"
                                maxLength={18}
                                placeholderTextColor="#888"
                            />

                            {isDuplicate && (
                                <Text className="mb-2 text-sm text-red-500">Title already exists!</Text>
                            )}

                            <View className="mt-2 w-full flex-row justify-between space-x-4">

                                <TouchableOpacity
                                    className="flex-1 items-center rounded-full bg-[#4B2E1E] px-4 py-2"
                                    onPress={handleCancel}
                                >
                                    <Text className="font-bold text-white">Cancel</Text>
                                </TouchableOpacity>


                                <TouchableOpacity
                                    className={`flex-1 items-center rounded-full px-4 py-2 ${isDuplicate || title.trim() === '' ? 'bg-gray-400' : 'bg-[#4B2E1E]'
                                        }`}
                                    disabled={isDuplicate || title.trim() === ''}
                                    onPress={handleConfirm}
                                >
                                    <Text className="font-bold text-white">Confirm</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default AddCategoryPop;
