import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ChooseGenerate from "../modal/chooseGenerate";
import VirtualTryOnModal from "../modal/VirtualTryOnModal";
import Avatar from "../../components/Avatar";
import { generateVirtualTryOn } from "../(auth)/klingApi";
import Constants from "expo-constants";

const Home = () => {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [tryOnModalVisible, setTryOnModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSelectedClothing, setLastSelectedClothing] = useState<
    string | null
  >(null);

  // Get Kling API configuration from environment variables
  const klingConfig = {
    KLING_API_KEY_ID: Constants.expoConfig?.extra?.KLING_API_KEY_ID,
    KLING_API_SECRET: Constants.expoConfig?.extra?.KLING_API_SECRET,
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
      // Validate inputs
      if (!avatarUrl || !clothingImageUrl) {
        throw new Error("Both model and clothing images are required");
      }

      if (!klingConfig.KLING_API_KEY_ID || !klingConfig.KLING_API_SECRET) {
        throw new Error("API credentials not configured");
      }

      const result = await generateVirtualTryOn(
        avatarUrl,
        clothingImageUrl,
        klingConfig
      );
      setGeneratedImage(result);
    } catch (error) {
      console.error("Virtual try-on failed:", error);
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "Failed to generate outfit"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    if (lastSelectedClothing && avatarUrl) {
      await handleClothingSelect(lastSelectedClothing);
    }
  };

  return (
    <View className="bg-primary flex-1">
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
      <View className="flex-row justify-end p-5">
        <TouchableOpacity
          onPress={() => router.push("../modal/profile")}
          disabled={isLoading}
        >
          <Ionicons name="person-circle-outline" size={40} color="#4D2A0A" />
        </TouchableOpacity>
      </View>

      {/* Avatar Display */}
      <View className="items-center justify-center flex-1">
        {generatedImage ? (
          <Image
            source={{ uri: generatedImage }}
            className="h-[90vh] aspect-square mt-24"
            resizeMode="contain"
          />
        ) : (
          <Avatar onImageLoaded={setAvatarUrl} />
        )}
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
    </View>
  );
};

export default Home;

// import {
//   SafeAreaView,
//   View,
//   Image,
//   Pressable,
//   Modal,
//   TouchableOpacity,
//   Dimensions,
//   Text,
// } from "react-native";
// import React, { useState } from "react";
// import { StatusBar } from "expo-status-bar";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import NewUserNamePop from "../../components/Popups/NewUserNamePop";
// import ChooseGenerate from "../modal/chooseGenerate";
// import Avatar from "../../components/Avatar";

// const { height } = Dimensions.get("window"); // Get screen height

// const Home = () => {
//   const router = useRouter();
//   const [modalVisible, setModalVisible] = useState(false);

//   const handleOpenModal = () => {
//     setModalVisible(true);
//   };

//   const handleCloseModal = () => {
//     setModalVisible(false);
//   };
//   const handleSelectClothingItem = () => {
//     console.log("Select clothing item pressed");
//     setModalVisible(false);
//     // Add your logic here
//   };

//   const handleSelectOutfit = () => {
//     console.log("Select outfit pressed");
//     setModalVisible(false);
//     // Add your logic here
//   };
//   const handleGenerateOutfit = () => {
//     console.log("Generate outfit pressed");
//     setModalVisible(false);
//     // Add your logic here
//   };

//   return (
//     <SafeAreaView className="bg-primary flex-1 ">
//       {/* Top Section */}
//       <View className="flex-1 p-5">
//         {/* Profile Button (top right corner) */}
//         <View className="flex-row justify-end p-5">
//           <TouchableOpacity
//             hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//             onPress={() => {
//               console.log("Pressed!");
//               router.push("../modal/profile");
//             }}
//           >
//             <Ionicons name="person-circle-outline" size={40} color="#4D2A0A" />
//           </TouchableOpacity>
//         </View>
//       </View>
//       <View className="items-center justify-center">
//         <View>
//           <TouchableOpacity
//             className="bg-secondary p-4 rounded-lg items-center justify-center"
//             onPress={handleOpenModal} // Move onPress here only
//           >
//             <Text className="text-white font-bold text-lg">Generate</Text>
//           </TouchableOpacity>
//           <ChooseGenerate
//             isVisible={modalVisible}
//             onClose={handleCloseModal}
//             onSelectClothingItem={handleSelectClothingItem}
//             onSelectOutfit={handleSelectOutfit}
//             onGenerateOutfit={handleGenerateOutfit}
//           />
//         </View>
//         <Avatar />
//       </View>

//       {/* Bottom Section with Generate Button */}

//       <StatusBar style="dark" />
//       <NewUserNamePop />
//     </SafeAreaView>
//   );
// };

// export default Home;
