import { SafeAreaView, View, Text, Dimensions, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import NewUserNamePop from "../../components/Popups/NewUserNamePop";
import ChooseGenerate from "../modal/chooseGenerate";
import Avatar from '../../components/Avatar';

const { height } = Dimensions.get('window'); // Get screen height

const Home = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const handleSelectClothingItem = () => {
    console.log("Select clothing item pressed");
    setModalVisible(false);
    // Add your logic here
  };

  const handleSelectOutfit = () => {
    console.log("Select outfit pressed");
    setModalVisible(false);
    // Add your logic here
  };

  const handleGenerateOutfit = () => {
    console.log("Generate outfit pressed");
    setModalVisible(false);
    // Add your logic here
  };

  return (
    <SafeAreaView className="bg-primary flex-1 ">
      {/* Top Section */}
      <View className="flex-1 p-5">
        {/* Profile Button (top right corner) */}
        <View className="flex-row justify-end p-5">
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => {
              console.log("Pressed!");
              router.push("../modal/profile");
            }}
          >
            <Ionicons name="person-circle-outline" size={40} color="#4D2A0A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Section with Generate Button */}
      <View className="px-5 pb-5">
        <TouchableOpacity
          className="bg-secondary p-4 rounded-lg items-center justify-center"
          onPress={handleOpenModal} // Move onPress here only
        >
          <Text className="text-white font-bold text-lg">Generate</Text>
        </TouchableOpacity>
        <ChooseGenerate
          isVisible={modalVisible}
          onClose={handleCloseModal}
          onSelectClothingItem={handleSelectClothingItem}
          onSelectOutfit={handleSelectOutfit}
          onGenerateOutfit={handleGenerateOutfit}
        />
      </View>
      <View className="items-center justify-center">
        <Avatar />
      </View>

      <StatusBar style="dark" />
      <NewUserNamePop />
    </SafeAreaView>
  );
};


export default Home;
