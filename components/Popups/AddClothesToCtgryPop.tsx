import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, Modal, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Search from '../Search';
import { loadImagesFromStorage } from '@/utils/localStorage';
import { generateID } from '@/contexts/database';

const { width } = Dimensions.get('window');
const numColumns = 2;
const itemMargin = 8;

type data = { id: string; title: string; uri: string };
const uri = "https://cloud.appwrite.io/v1/storage/buckets/6828105b000b23c42ebe/files/682841e40013e79ea00d/view?project=67ad0aec0002e74ec57d"
// THIS IS THE MASTER LIST OF ALL POSSIBLE ITEMS

const allPossibleItems: data[] = [
  // { id: '1', title: 'Item 1', uri: uri },
  { id: '2', title: 'Item 2', uri: uri },
  { id: '3', title: 'Item 3', uri: uri },
  { id: '4', title: 'Item 4', uri: uri },
  { id: '5', title: 'Item 5', uri: uri },
  { id: '6', title: 'Item 6', uri: uri },
];

interface AddClothesToCtgryPopProps {
  visible: boolean;
  onClose: () => void;
  selectedItems: data[];
  onAddItem: (item: data) => void;
}

const AddClothesToCtgryPop: React.FC<AddClothesToCtgryPopProps> = ({ visible, onClose, selectedItems, onAddItem }) => {
  const [keyword, setKeyWord] = useState('');
  const [allPossibleItems, setAllPossibleItems] = useState<data[]>([]);

  useEffect(()=>{
    const loadImages = async () => {
      const temp: data[] = []
      const clothingItems = await loadImagesFromStorage();
      if (clothingItems){
        const mergedUrls = Object.values(clothingItems).flat();
        mergedUrls.forEach( (item, index) => {
          temp.push({id: item.id, title: `Item ${index}`, uri: item.uri});
        });
        setAllPossibleItems(temp);
      }
    }
    loadImages();
  }, [])

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
        <View style={{ width: modalWidth, height: "80%" }} className="bg-[#D2B48C] rounded-2xl p-4">
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
                    backgroundColor: '#transparent',
                    borderRadius: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden'
                  }}
                  activeOpacity={0.7}
                  onPress={() => onAddItem(item)}
                >
                  <Image
                    source = {{uri: item.uri}}
                    style = {styles.image}
                    resizeMode = "contain"
                  />
                </TouchableOpacity>
                <Text className="text-base font-semibold text-center mt-2"> </Text>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

export default AddClothesToCtgryPop;


const styles = StyleSheet.create({
    image:{ 
        aspectRatio: 1,    // Ensures square shape (width = height)
        height:'100%',    
        resizeMode: 'contain'
    }
});