import React, { useState } from 'react';
import { FlatList, Text, View, Image, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ItemList = () => {
    const [list, setList] = useState<{ id: string; title: string }[]>([]);
    const [title, setTitle] = useState('');
    const [showInputs, setShowInputs] = useState(false); // State to toggle input visibility

    const { height } = Dimensions.get('window'); // Get screen height
    const ITEM_HEIGHT = height * 0.125; // % of screen height

    // Function to add item to the list
    const addItem = () => {
        if (title.trim()) {
            setList([...list, { id: Date.now().toString(), title }]);
            setTitle('');
        }
    };

    return (
        <View className="w-full flex-1 items-center justify-center mx-4">
            {/* Toggle Button */}
            <View style={{ height: ITEM_HEIGHT }} className="mt-4 flex-row items-center justify-center">
                <TouchableOpacity
                    className="rounded-3xl flex-row border-2 border-black w-[75%] h-full justify-center items-center"
                    onPress={() => setShowInputs(!showInputs)}
                >
                    <View style={{ aspectRatio: 1 }} className="rounded-2xl h-[75%] border-2 border-black justify-center items-center">
                        <Image
                            source={require('../assets/icons/Union.png')} // Local image
                            className="h-[25%]"
                            style={{ aspectRatio: 1 }} // Ensures square shape
                            resizeMode="contain"
                        />
                    </View>
                    <Text className="mx-3 text-center text-lg font-bold">Create Category</Text>
                    <View style={{ aspectRatio: 1 }} className="rounded-2xl h-[78%]" />
                </TouchableOpacity>
            </View>

            {/* Input Section (Hidden when showInputs is false) */}
            {showInputs && (
                <View className="mt-4 flex-row items-center justify-center w-[75%]">
                    <TextInput
                        className="flex-1 border border-gray-400 rounded-lg px-4"
                        placeholder="Enter title"
                        value={title}
                        onChangeText={setTitle}
                    />
                    <TouchableOpacity className="border border-black px-4 rounded-lg ml-4 h-full" onPress={addItem}>
                        <Text className="font-semibold">Add</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* List Section */}
            <View className="flex-1 w-full">
                <FlatList
                    data={list}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }} // Ensures scrolling
                    renderItem={({ item }) => (
                        <View style={{ height: ITEM_HEIGHT }} className="mt-4 flex-row items-center justify-center">
                            <TouchableOpacity className="rounded-3xl flex-row border-2 border-black w-[75%] h-full justify-center items-center px-4">
                                <View style={{ aspectRatio: 1 }} className="rounded-2xl h-[75%] border-2 border-black justify-center items-center">
                                    <Image
                                        source={require('../assets/icons/Union.png')} // Local image
                                        className="h-[25%]"
                                        style={{ aspectRatio: 1 }} // Ensures square shape
                                        resizeMode="contain"
                                    />
                                </View>

                                {/* Centering text */}
                                <Text className="flex-1 text-center text-lg font-bold">{item.title}</Text>

                                <View style={{ aspectRatio: 1 }} className="rounded-2xl h-[78%]" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

export default ItemList;
