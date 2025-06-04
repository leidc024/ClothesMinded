import React, { useEffect, useState } from "react";
import { Image, View, StyleSheet, ActivityIndicator } from "react-native";
import { getAvatarUriByUserID } from "@/contexts/database";
import { useUser } from "@/contexts/UserContext";

interface AvatarProps {
  onImageLoaded?: (url: string) => void;
  source?: string | null; // Add this line
}

const Avatar: React.FC<AvatarProps> = ({ onImageLoaded, source }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { current: user } = useUser();

  useEffect(() => {
    if (source){
      setImageUrl(source);
      return
    } 
    async function fetchAvatarId() {
      if (!user) return;
      const url = await getAvatarUriByUserID(user.$id);
      setImageUrl(url);
      if (url && onImageLoaded) {
        onImageLoaded(url); // Call the callback with the image URL
      }
    }
    fetchAvatarId();
  }, [user, onImageLoaded]);

  return (
    <View>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          className="h-full aspect-square"
          resizeMode="contain"
        />
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
};

export default Avatar;