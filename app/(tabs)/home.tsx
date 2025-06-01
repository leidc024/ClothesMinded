import { SafeAreaView, View, Text, Dimensions, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import NewUserNamePop from "../../components/Popups/NewUserNamePop";
import ChooseGenerate from "../modal/chooseGenerate";
import Avatar from "../../components/Avatar";
import { useUser } from "@/contexts/UserContext"; // ✅ import context

const { height } = Dimensions.get("window");

const Home = () => {
  const router = useRouter();
  const { current } = useUser(); // ✅ get current user
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => {
    if (!current) {
      Alert.alert("Account Required", "Please sign in to use this feature.");
      return;
    }
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
    <SafeAreaView className="bg-[#F5EEDC] flex-1">

      {/* Profile Button */}
      <View className="mt-10">
        <Text className="text-center text-2xl font-bold">Home</Text>
      </View>

      <View className="flex-row justify-end mt-10 mr-10">
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

      <View className="flex-row justify-end mt-2 mb-4 mr-10">
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={handleOpenModal}
        >
          <Entypo name="arrow-with-circle-down" size={36} color="#4D2A0A" />
        </TouchableOpacity>
      </View>

      {/* Avatar Section (optional) */}
      <View className="items-center justify-center h-[70vh]">
        <Avatar />
      </View> 

      {/* Bottom Section with Generate Button */}


      <StatusBar style="dark" />
      <NewUserNamePop />

      <ChooseGenerate
        isVisible={modalVisible}
        onClose={handleCloseModal}
        onSelectClothingItem={handleSelectClothingItem}
        onSelectOutfit={handleSelectOutfit}
        onGenerateOutfit={handleGenerateOutfit}
      />
    </SafeAreaView>
  );
};

export default Home;
