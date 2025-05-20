import React, { useEffect, useState } from "react";
import { Image, View, ActivityIndicator } from "react-native";
import { Storage } from "react-native-appwrite";
import { client } from "../lib/appwrite";
import { useUser } from "@/contexts/UserContext";

interface AvatarProps {
  onImageLoaded?: (url: string) => void;
}

const Avatar: React.FC<AvatarProps> = ({ onImageLoaded }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { getPreferences } = useUser();

  useEffect(() => {
    const storage = new Storage(client);
    const bucketId = "6825d9f500066a3dc28e";

    async function fetchAvatarId() {
      const prefs = await getPreferences();
      if (prefs) {
        const fileId = prefs.avatarId;
        const url = storage.getFileView(bucketId, fileId).href;
        setImageUrl(url);
        if (onImageLoaded) onImageLoaded(url);
      }
    }
    fetchAvatarId();
  }, []);

  return (
    <View>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          className="h-[90vh] aspect-square mt-24"
          resizeMode="contain"
        />
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
};

export default Avatar;
