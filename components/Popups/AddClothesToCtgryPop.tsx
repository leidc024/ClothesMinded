import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Search from '../Search';

const { width } = Dimensions.get('window');
const numColumns = 2;
const itemMargin = 8;

// THIS IS THE MASTER LIST OF ALL POSSIBLE ITEMS
const allPossibleItems: { id: string; title: string }[] = [
  { id: '1', title: 'Item 1' },
  { id: '2', title: 'Item 2' },
  { id: '3', title: 'Item 3' },
  { id: '4', title: 'Item 4' },
  { id: '5', title: 'Item 5' },
  { id: '6', title: 'Item 6' },
];

interface AddClothesToCtgryPopProps {
  visible: boolean;
  onClose: () => void;
  selectedItems: { id: string; title: string }[];
  onAddItem: (item: { id: string; title: string }) => void;
}

const AddClothesToCtgryPop: React.FC<AddClothesToCtgryPopProps> = ({ visible, onClose, selectedItems, onAddItem }) => {
  const [keyword, setKeyWord] = useState('');

  // Only show items not already selected
  const availableItems = useMemo(() => {
    return allPossibleItems.filter(
      (item) => !selectedItems.some((selected) => selected.id === item.id)
    );
  }, [selectedItems]);

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
                  style={{
                    width: itemSizeLocal,
                    height: itemSizeLocal,
                    backgroundColor: '#e5e7eb',
                    borderRadius: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  activeOpacity={0.7}
                  onPress={() => onAddItem(item)}
                >
                  <Ionicons name="add-circle" size={32} color="#D2B48C" />
                </TouchableOpacity>
                <Text className="text-base font-semibold text-center mt-2">{item.title}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

export default AddClothesToCtgryPop;
