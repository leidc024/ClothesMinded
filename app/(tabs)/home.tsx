// import React, { useState } from "react";
// import { generateVirtualTryOn } from "../../utils/old_klingApi";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import { useRouter } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import ChooseGenerate from "../modal/chooseGenerate";
// import VirtualTryOnModal from "../modal/VirtualTryOnModal";
// import Avatar from "../../components/Avatar";

// import Constants from "expo-constants";

// const Home = () => {
//   const router = useRouter();
//   const [modalVisible, setModalVisible] = useState(false);
//   const [tryOnModalVisible, setTryOnModalVisible] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [generatedImage, setGeneratedImage] = useState<string | null>(null);
//   const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [lastSelectedClothing, setLastSelectedClothing] = useState<
//     string | null
//   >(null);

//   // Get Kling API configuration from environment variables
//   const config = {
//     KLING_API_KEY_ID: Constants.expoConfig?.extra?.KLING_API_KEY_ID,
//     KLING_API_SECRET: Constants.expoConfig?.extra?.KLING_API_SECRET,
//   };

//   const handleSelectClothingItem = () => {
//     setModalVisible(false);
//     setSelectedCategory("Shirts"); // Default category
//     setTryOnModalVisible(true);
//     console.log("reached here in HandleClothingSelect");
//   };

//   // Update the imports

//   // Update the handleClothingSelect function
//   const handleClothingSelect = async (clothingImageUrl: string) => {
//     setTryOnModalVisible(false);
//     setIsLoading(true);
//     setLastSelectedClothing(clothingImageUrl);

//     try {
//       if (!config.KLING_API_KEY_ID || !config.KLING_API_SECRET) {
//         throw new Error("Please configure API credentials in app.json");
//       }

//       if (!avatarUrl) {
//         throw new Error("Please select an avatar first");
//       }

//       // Check if the image is a URL or needs to be converted to base64
//       let humanImage = avatarUrl;
//       let clothImage = clothingImageUrl;
//       //   console.log(
//       //     "reached here lettign the avatarurl & clothingimageurl is gotten"
//       //   );
//       console.log(avatarUrl);
//       console.log(clothingImageUrl);
//       // If using local images, convert to base64
//       if (avatarUrl.startsWith("http")) {
//         console.log("before converting url to base64");
//         humanImage = await convertImageToBase64(avatarUrl);
//         // console.log("reached here in if http avatarurl");
//       }
//       if (clothingImageUrl.startsWith("http")) {
//         clothImage = await convertImageToBase64(clothingImageUrl);
//         // console.log("reached here in if http clothingImageurl");
//       }
//       console.log("before results");
//       const result = await generateVirtualTryOn(humanImage, clothImage, config);
//       console.log("after result");
//       setGeneratedImage(result);
//     } catch (error) {
//       console.log("setgenerated image unsucessful");
//       console.error("Virtual try-on error:", error);
//       Alert.alert(
//         "Error",
//         error instanceof Error ? error.message : "Failed to generate outfit"
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Add this helper function
//   const convertImageToBase64 = async (uri: string): Promise<string> => {
//     const response = await fetch(uri);
//     const blob = await response.blob();
//     return new Promise((resolve, reject) => {
//       console.log("reached here in convertImagetoBase64");
//       const reader = new FileReader();
//       reader.onerror = reject;
//       reader.onload = () => {
//         if (typeof reader.result === "string") {
//           // Remove the data URL prefix if present
//           const base64String = reader.result.split(",")[1] || reader.result;
//           resolve(base64String);
//         } else {
//           reject(new Error("Failed to read image as base64"));
//         }
//       };
//       reader.readAsDataURL(blob);
//     });
//   };

//   //   const handleClothingSelect = async (clothingImageUrl: string) => {
//   //     setTryOnModalVisible(false);
//   //     setIsLoading(true);

//   //     try {
//   //       const config = {
//   //         KLING_API_KEY_ID: Constants.expoConfig?.extra?.KLING_API_KEY_ID,
//   //         KLING_API_SECRET: Constants.expoConfig?.extra?.KLING_API_SECRET,
//   //       };

//   //       if (!config.KLING_API_KEY_ID || !config.KLING_API_SECRET) {
//   //         throw new Error("Please configure API credentials in app.json");
//   //       }

//   //       const result = await generateVirtualTryOn(
//   //         avatarUrl!,
//   //         clothingImageUrl,
//   //         config
//   //       );
//   //       setGeneratedImage(result);
//   //     } catch (error) {
//   //       Alert.alert(
//   //         "Error",
//   //         error instanceof Error ? error.message : "Failed to generate outfit"
//   //       );
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   };

//   const handleRetry = async () => {
//     if (lastSelectedClothing && avatarUrl) {
//       await handleClothingSelect(lastSelectedClothing);
//     }
//   };

//   return (
//     <View className="bg-primary flex-1">
//       {/* Loading Overlay */}
//       {isLoading && (
//         <View className="absolute inset-0 bg-black/50 justify-center items-center z-10">
//           <ActivityIndicator size="large" color="#4b2d10" />
//           <Text className="text-white mt-4 text-lg">
//             Generating your outfit...
//           </Text>
//         </View>
//       )}

//       {/* Profile Button */}
//       <View className="flex-row justify-end p-5">
//         <TouchableOpacity
//           onPress={() => router.push("../modal/profile")}
//           disabled={isLoading}
//         >
//           <Ionicons name="person-circle-outline" size={40} color="#4D2A0A" />
//         </TouchableOpacity>
//       </View>
//       {/* Generate Button */}
//       <View className="items-center justify-center p-5">
//         <TouchableOpacity
//           className={`bg-secondary p-4 rounded-lg items-center justify-center ${
//             isLoading ? "opacity-50" : ""
//           }`}
//           onPress={() => setModalVisible(true)}
//           disabled={isLoading}
//         >
//           <Text className="text-white font-bold text-lg">Generate</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Avatar Display */}
//       <View className="items-center justify-center flex-1">
//         {generatedImage ? (
//           <Image
//             source={{ uri: generatedImage }}
//             className="h-[90vh] aspect-square mt-24"
//             resizeMode="contain"
//           />
//         ) : (
//           <Avatar onImageLoaded={setAvatarUrl} />
//         )}
//       </View>

//       {/* Modals */}
//       <ChooseGenerate
//         isVisible={modalVisible}
//         onClose={() => setModalVisible(false)}
//         onSelectClothingItem={handleSelectClothingItem}
//         onSelectOutfit={() => console.log("Select Outfit")}
//         onGenerateOutfit={() => console.log("Generate Outfit")}
//       />

//       <VirtualTryOnModal
//         visible={tryOnModalVisible}
//         onClose={() => setTryOnModalVisible(false)}
//         onSelect={handleClothingSelect}
//         category={selectedCategory}
//       />
//     </View>
//   );
// };

// export default Home;
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
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ChooseGenerate from "../modal/chooseGenerate";
import VirtualTryOnModal from "../modal/VirtualTryOnModal";
import Avatar from "../../components/Avatar";
import Constants from "expo-constants";

const Home = () => {
  const router = useRouter();
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
    </View>
  );
};

export default Home;
