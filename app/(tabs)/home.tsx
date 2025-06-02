import React, { useState } from "react";
import {
  generateVirtualTryOn,
  convertImageToBase64,
} from "../../utils/old_klingApi";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Modal
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, Entypo } from "@expo/vector-icons";
import ChooseGenerate from "../modal/chooseGenerate";
import VirtualTryOnModal from "../modal/VirtualTryOnModal";
import Avatar from "../../components/Avatar";
import Constants from "expo-constants";
import { useUser } from "@/contexts/UserContext"; // ✅ import context

const { height } = Dimensions.get("window");

const Home = () => {
  const router = useRouter();
  const { current } = useUser(); // ✅ get current user
  const [modalVisible, setModalVisible] = useState(false);
  const [tryOnModalVisible, setTryOnModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]); // Changed to array
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSelectedClothing, setLastSelectedClothing] = useState<
    string | null
  >(null);

  // Get Kling API configuration from environment variables
  const config = {
    KLING_API_KEY_ID: Constants.expoConfig?.extra?.KLING_API_KEY_ID,
    KLING_API_SECRET: Constants.expoConfig?.extra?.KLING_API_SECRET,
  };

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
    setModalVisible(false);
    setSelectedCategory("Shirts"); // Default category
    setTryOnModalVisible(true);
  };

  const handleClothingSelect = async (clothingImageUrl: string) => {
    setTryOnModalVisible(false);
    setIsLoading(true);
    setLastSelectedClothing(clothingImageUrl);

    try {
      if (!config.KLING_API_KEY_ID || !config.KLING_API_SECRET) {
        throw new Error("Please configure API credentials in app.json");
      }

      if (!avatarUrl) {
        throw new Error("Please select an avatar first");
      }

      let humanImage = avatarUrl;
      let clothImage = clothingImageUrl;

      // Convert to base64 if they are URLs
      if (avatarUrl.startsWith("http")) {
        humanImage = await convertImageToBase64(avatarUrl);
      }
      if (clothingImageUrl.startsWith("http")) {
        clothImage = await convertImageToBase64(clothingImageUrl);
      }

      const results = await generateVirtualTryOn(
        humanImage,
        clothImage,
        config
      );
      setGeneratedImages(results); // Now setting an array of images
    } catch (error) {
      console.error("Virtual try-on error:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to generate outfit"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // const convertImageToBase64 = async (uri: string): Promise<string> => {
  //   const response = await fetch(uri);
  //   const blob = await response.blob();
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onerror = reject;
  //     reader.onload = () => {
  //       if (typeof reader.result === "string") {
  //         const base64String = reader.result.split(",")[1] || reader.result;
  //         resolve(base64String);
  //       } else {
  //         reject(new Error("Failed to read image as base64"));
  //       }
  //     };
  //     reader.readAsDataURL(blob);
  //   });
  // };

  const handleRetry = async () => {
    if (lastSelectedClothing && avatarUrl) {
      await handleClothingSelect(lastSelectedClothing);
    }
  };

  return (
    <SafeAreaView className="bg-[#F5EEDC] flex-1">
      {/* Loading Overlay */}
      {isLoading && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center z-10">
          <ActivityIndicator size="large" color="#4b2d10" />
          <Text className="text-white mt-4 text-lg">
            Generating your outfit...
          </Text>
        </View>
      )}

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

      {/* Generate Button */}
      <View className="items-center justify-center p-5">
        <TouchableOpacity
          className={`bg-secondary p-4 rounded-lg items-center justify-center ${
            isLoading ? "opacity-50" : ""
          }`}
          onPress={() => setModalVisible(true)}
          disabled={isLoading}
        >
          <Text className="text-white font-bold text-lg">Generate</Text>
        </TouchableOpacity>
      </View>

      {/* Results Display */}
      <View className="items-center justify-center flex-1">
        {generatedImages.length > 0 ? (
          <ScrollView horizontal className="w-full">
            {generatedImages.map((imageUrl, index) => (
              <Image
                key={index}
                source={{ uri: imageUrl }}
                className="h-[90vh] aspect-square mt-24 mx-2"
                resizeMode="contain"
              />
            ))}
          </ScrollView>
        ) : (
          <Avatar onImageLoaded={setAvatarUrl} />
        )}
      </View>

      {/* Retry Button (only shown when there are results) */}
      {generatedImages.length > 0 && (
        <View className="items-center p-4">
          <TouchableOpacity
            className="bg-secondary p-3 rounded-lg"
            onPress={handleRetry}
            disabled={isLoading}
          >
            <Text className="text-white font-bold">Regenerate</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modals */}
      <ChooseGenerate
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectClothingItem={handleSelectClothingItem}
        onSelectOutfit={() => console.log("Select Outfit")}
        onGenerateOutfit={() => console.log("Generate Outfit")}
      />

      <VirtualTryOnModal
        visible={tryOnModalVisible}
        onClose={() => setTryOnModalVisible(false)}
        onSelect={handleClothingSelect}
        category={selectedCategory}
      />
    </SafeAreaView>
  );
};

export default Home;