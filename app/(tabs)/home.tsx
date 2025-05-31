import { SafeAreaView, View, Text, Dimensions, TouchableOpacity, Modal } from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
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
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);

  const handleOpenModal = () => {
    if (!current) {
      setPermissionModalVisible(true);
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
    <SafeAreaView className="bg-primary flex-1">
      {/* Top Section */}
      <View className="flex-1 p-5">
        {/* Profile Button */}
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

      {/* Avatar Section (optional) */}
      {/* <View className="items-center justify-center">
        <Avatar />
      </View> */}

      {/* Bottom Section with Generate Button */}
      <View className="px-5 pb-5">
        <TouchableOpacity
          className="bg-secondary p-4 rounded-lg items-center justify-center"
          onPress={handleOpenModal}
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

      {/* Custom Permission Modal */}
      <Modal
        visible={permissionModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPermissionModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#f5eedc",
              borderRadius: 20,
              padding: 30,
              alignItems: "center",
              width: 300,
            }}
          >
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 15 }}>Oops</Text>
            <Text style={{ fontSize: 14, color: "#333", textAlign: "center", marginBottom: 30 }}>
              Account Required{"\n"}Please sign in to use this feature.
            </Text>
            <TouchableOpacity
              onPress={() => setPermissionModalVisible(false)}
              style={{
                backgroundColor: "#4b2e1e",
                paddingHorizontal: 24,
                paddingVertical: 10,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <StatusBar style="dark" />
      <NewUserNamePop />
    </SafeAreaView>
  );
};

export default Home;