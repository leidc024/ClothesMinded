import React, { useState } from 'react';
import { FlatList, Text, View, Image, TextInput, TouchableOpacity, Dimensions } from 'react-native';

type ItemListProps = {
    keyword: string;
};

const ItemList = ({keyword}: ItemListProps) => {
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

    // Filter and sort the list based on the keyword
    const filteredAndSortedList = list
        .filter(item => item.title.toLowerCase().includes(keyword.toLowerCase())) // Filter by keyword
        .sort((a, b) => a.title.localeCompare(b.title)); // Sort in ascending order

    return (
        <View className='h-4/5 justify-center items-center'>
            {/* Toggle Button */}
            <View style={{ height: ITEM_HEIGHT }} className='w-full items-center justify-center'>
                <TouchableOpacity
                    className="rounded-3xl flex-row border-2 w-3/4 h-full justify-center items-center px-4"
                    onPress={() => setShowInputs(!showInputs)}
                >
                    <View style={{ aspectRatio: 1 }} className="rounded-2xl h-3/4 border-2 justify-center items-center">
                        <Image
                            source={require('../assets/icons/Union.png')} // Local image
                            className="h-1/4"
                            style={{ aspectRatio: 1 }} // Ensures square shape
                            resizeMode="contain"
                        />
                    </View>
                    <Text className="flex-1 text-lg font-bold ml-4">Create Category</Text>
                </TouchableOpacity>
            </View>

            {/* Input Section (Hidden when showInputs is false) */}
            {showInputs && (
                <View style={{ height: ITEM_HEIGHT / 3 }} className="flex-row w-3/4 mt-4">
                    <TextInput
                        className="flex-1 border border-gray-400 rounded-lg px-4"
                        placeholder={`Enter title`}
                        value={title}
                        maxLength={18} // Prevents more than 18 characters
                        onChangeText={(text) => setTitle(text.slice(0, 18))} // Ensures the limit
                    />
                    <TouchableOpacity 
                        className="h-full border border-black rounded-lg ml-4 px-4 items-center justify-center" 
                        onPress={addItem}
                    >
                        <Text className="font-semibold">Add</Text>
                    </TouchableOpacity>
                </View>
            
            )}

            {/* List Section */}
            <View className="flex-1 pb-16 w-full">
                <FlatList
                    data={filteredAndSortedList} // Use filtered and sorted list
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={{ height: ITEM_HEIGHT }} className="mt-4 flex-row items-center justify-center">
                            <TouchableOpacity className="rounded-3xl flex-row border-2 w-3/4 h-full justify-center items-center px-4">
                                <View style={{ aspectRatio: 1 }} className="rounded-2xl h-3/4 border-2 justify-center items-center">
                                    <Image
                                        source={require('../assets/icons/Union.png')} // Local image
                                        className="h-1/4"
                                        style={{ aspectRatio: 1 }} // Ensures square shape
                                        resizeMode="contain"
                                    />
                                </View>

                                {/* Centering text */}
                                <Text className="flex-1 text-lg font-bold ml-4">{item.title}</Text>

                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

export default ItemList;
