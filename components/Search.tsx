import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// Props for the Search component
interface SearchProps {
  keyword: string;
  setKeyWord: (text: string) => void;
  toggleEditCategory?: () => void;
}

const Search: React.FC<SearchProps> = ({ keyword, setKeyWord, toggleEditCategory }) => {
  return (
    <View className="my-4 flex-row items-center justify-center">
      <View className="w-[70%] flex-row items-center rounded-full bg-white px-4 shadow-md">
        <FontAwesome name="search" size={18} color="gray" />
        <TextInput
          placeholder="Search"
          value={keyword}
          onChangeText={setKeyWord}
          className="ml-3 flex-1 text-lg"
        />
      </View>
      {toggleEditCategory && (
        <TouchableOpacity className="ml-3 rounded-lg border border-gray-400 bg-[#D2B48C] px-4 py-3 shadow-md" onPress={toggleEditCategory}>
          <FontAwesome name="pencil" size={20} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Search;