import React, { useState, useContext, useEffect } from 'react';
import { Modal, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

//local imports
import { CreateCategoryContext } from '../../contexts/CreateCategoryContext';

const AddCategoryPop = () => {
    const {
        createCategory, //treat as a bool
        setCreateCategory, 
        setTitleCategory, //treat as a string
        categoryList, //list of categories
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
            setCategoryList((prev: { id: string; title: string }[]) => {
                return prev.map((item) => {
                    if (item.id === categoryId) {
                        return { ...item, title: title.trim() };
                    }
                    return item;
                });
            });
        }
        else if (!isDuplicate && title.trim() !== '') {
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
            <SafeAreaView className="flex-1 justify-center items-center">
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={createCategory}
                >
                    <View className="flex-1 justify-center items-center">
                        <View className="m-5 bg-white rounded-2xl p-9 items-center shadow-lg w-80">
                            <TextInput
                                onChangeText={setTitle}
                                value={title}
                                className="border border-gray-300 rounded-md px-4 py-2 w-64 mb-2"
                                placeholder="Enter title"
                                maxLength={18}
                            />
                            {isDuplicate && (
                                <Text className="text-red-500 mb-2 text-sm">Title already exists!</Text>
                            )}
                            <View className="flex-row space-x-4 mt-2">
                                {/* Confirm */}
                                <TouchableOpacity
                                    className={`rounded-xl px-4 py-2 ${isDuplicate || title.trim() === '' ? 'bg-gray-400' : 'bg-[#D2B48C]'}`}
                                    disabled={isDuplicate || title.trim() === ''}
                                    onPress={handleConfirm}
                                >
                                    <Text className="text-white font-bold text-center">Confirm</Text>
                                </TouchableOpacity>

                                {/* Cancel */}
                                <TouchableOpacity
                                    className="rounded-xl px-4 py-2 bg-[#D2B48C]"
                                    onPress={handleCancel}
                                >
                                    <Text className="text-white font-bold text-center">Cancel</Text>
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
