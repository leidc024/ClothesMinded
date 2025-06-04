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
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons  } from "@expo/vector-icons";
import ChooseGenerate from "../modal/chooseGenerate";
import VirtualTryOnModal from "../modal/VirtualTryOnModal";
import Avatar from "../../components/Avatar";
import GuestAlertModal from "../../components/guest_modal";
import Constants from "expo-constants";
import { useUser } from "@/contexts/UserContext"; // ✅ import context

const { height } = Dimensions.get("window");

const Home = () => {
  const router = useRouter();
  const [guestAlertVisible, setGuestAlertVisible] = useState(false);
  const { current } = useUser(); // ✅ get current user
  const [modalVisible, setModalVisible] = useState(false);
  const [tryOnModalVisible, setTryOnModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]); // Changed to array
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAvatarOverride, setCurrentAvatarOverride] = useState<
    string | null
  >(null);
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
  console.log("Current user:", current);
  // If user is not logged in (guest), show guest alert
  if (!current) {
    setGuestAlertVisible(true);
    return;
  }
  // If you have a permission modal for something else, handle it separately if needed
  // If user is not guest, open the generate modal
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
        console.log(avatarUrl);
        throw new Error("Please select an avatar first");
      }

      let humanImage = avatarUrl;
      let clothImage = clothingImageUrl;

      console.log("avatar", avatarUrl, "clothing", clothingImageUrl);

      // Convert to base64 if they are URLs
      if (avatarUrl.startsWith("http")) {
        // humanImage = await convertImageToBase64(avatarUrl);
        console.log("done convert");
        console.log(avatarUrl);
      }

      if (clothingImageUrl.startsWith("http")) {
        // clothImage = await convertImageToBase64(clothingImageUrl);
        // console.log("here");
        // console.log(clothingImageUrl);
      }

      // const results = ["https://cdn.klingai.com/bs2/upload-kling-api/9823912225/virtualTryOn/Cjz0o2gmuJkAAAAABa5DYg-0.png"]
      const results = await generateVirtualTryOn(
        humanImage,
        clothImage,
        config
      );
      console.log("here again");
      setGeneratedImages(results); // Now setting an array of images
      // setAvatarUrl(results);
      setCurrentAvatarOverride(results[0]);
      console.log(results);
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

      <View className="mt-10">
        <Text className="text-center text-2xl font-bold">Home</Text>
      </View>

      {/* Floating Buttons - Absolute positioned */}
      <View className="absolute right-0 top-20 z-50">
        <View className="pr-4 pt-4">
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={handleRetry}
            disabled={isLoading}
          >
            <Ionicons name="person-circle-outline" size={40} color="#4D2A0A" />
          </TouchableOpacity>

            {/* Generate Button */}
        
          <View className="pr-4 pt-4">
            <TouchableOpacity
              className="items-center justify-center"
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                
                marginTop: 5,
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={handleOpenModal}
            >
              <Ionicons name="add-circle" size={40} color="#4C2A0A" />
            </TouchableOpacity>
          </View>
          {generatedImages.length > 0 && (

            <View className="pr-4 pt-4">
              <TouchableOpacity
                className="items-center justify-center"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  
                  marginTop: 5,
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={handleOpenModal}
              >
                <MaterialCommunityIcons  name="restart" size={40} color="#4C2A0A" />
              </TouchableOpacity>
            </View>
    )}
        </View>

         {/* Guest Alert Modal */}
      <GuestAlertModal
        visible={guestAlertVisible}
        onClose={() => setGuestAlertVisible(false)}
      />

        {/* <View>
          <TouchableOpacity
            className="absolute bottom-0 left-0 right-0 flex justify-center items-center z-50"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={handleOpenModal}
          >
            <Ionicons
              name="arrow-down-circle-outline"
              size={40}
              color="#4D2A0A"
            />
          </TouchableOpacity>
        </View> */}
      </View>

      {/* Content Area */}
      {(current && 
        <View className="flex-1 items-center justify-center">
          {generatedImages.length > 0 ? (
            <View className="relative">
              <Avatar source={generatedImages[generatedImages.length-1]} />
            </View>
          ) : (
            <View className="relative">
              <Avatar onImageLoaded={setAvatarUrl} />
            </View>
          )}
        </View>
      )}

      {/* Retry Button (only shown when there are results) */}

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
