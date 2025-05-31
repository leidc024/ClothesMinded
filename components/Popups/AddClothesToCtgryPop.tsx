import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Search from '../Search';
import { loadImagesFromStorage } from '@/utils/localStorage';
import { generateID } from '@/contexts/database';

const { width } = Dimensions.get('window');
const numColumns = 3;
const itemMargin = 14;

type data = { id: string; title: string; uri: string };

interface AddClothesToCtgryPopProps {
  visible: boolean;
  onClose: () => void;
  selectedItems: data[];
  onAddItem: (item: data) => void;
  category: string;
}

const AddClothesToCtgryPop: React.FC<AddClothesToCtgryPopProps> = ({ visible, onClose, selectedItems, onAddItem, category }) => {
  const [keyword, setKeyWord] = useState('');
  const [allPossibleItems, setAllPossibleItems] = useState<data[]>([]);
  const [customName, setCustomName] = useState('');

  useEffect(() => {
    const loadImages = async () => {
      const temp: data[] = [];
      const clothingItems = await loadImagesFromStorage();
      if (clothingItems) {
        const mergedUrls = Object.values(clothingItems).flat();
        mergedUrls.forEach((item) => {
          temp.push({ id: item.id, title: '', uri: item.uri }); // leave title blank
        });
        setAllPossibleItems(temp);
      }
    };
    loadImages();
  }, [category]);

  // Only show items not already selected
  const availableItems = useMemo(() => {
    return allPossibleItems.filter(
      (item) => !selectedItems.some((selected) => selected.id === item.id)
    );
  }, [selectedItems, allPossibleItems]);

  // Modal width/height relative to window
  const modalWidth = width * 0.85;
  const modalHeight = '80%';
  const itemSizeLocal = (modalWidth - (numColumns + 3) * itemMargin) / numColumns;

  const filteredItems = useMemo(() => {
    let result = availableItems;
    if (keyword) {
      result = result.filter(item => item.title.toLowerCase().includes(keyword.toLowerCase()));
    }
    // Sort alphanumerically by title
    return result.slice().sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' }));
  }, [keyword, availableItems]);

  // Set the title based on the number of items already in the category
  const handleAddItem = (item: data) => {
    const newIndex = selectedItems.length + 1;
    const newItem = { ...item, title: `${category} ${newIndex}` };
    onAddItem(newItem);
    setCustomName('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: modalWidth, maxHeight: modalHeight }} className="bg-[#D2B48C] rounded-2xl p-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-2xl font-bold">Add Items</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="black" />
            </TouchableOpacity>
          </View>
          <Search keyword={keyword} setKeyWord={setKeyWord} />
          <FlatList
            data={filteredItems}
            keyExtractor={item => item.id}
            numColumns={numColumns}
            contentContainerStyle={{ padding: itemMargin }}
            columnWrapperStyle={{ gap: itemMargin, marginBottom: itemMargin }}
            renderItem={({ item }) => (
              <View style={{ alignItems: 'center', width: itemSizeLocal }} className="mb-2">
                <TouchableOpacity
                  className='w-24 h-32 bg-white rounded-2xl justify-center items-center '
                  activeOpacity={0.7}
                  onPress={() => handleAddItem(item)}
                >
                  <Image
                    source={{ uri: item.uri }}
                    className='w-full h-full rounded-2xl border-2'
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

export default AddClothesToCtgryPop;