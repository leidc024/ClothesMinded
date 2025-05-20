import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { useUser } from "@/contexts/UserContext";
import { Storage } from "react-native-appwrite";
import { client } from "@/lib/appwrite";

interface VirtualTryOnModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  category: string;
}

const VirtualTryOnModal: React.FC<VirtualTryOnModalProps> = ({
  visible,
  onClose,
  onSelect,
  category,
}) => {
  const [items, setItems] = useState<string[]>([]);
  const { getPreferences } = useUser();
  const storage = new Storage(client);
  const bucketId = "6825d9f500066a3dc28e";

  const loadWardrobeItems = async () => {
    try {
      const prefs = await getPreferences();
      if (prefs?.wardrobeItems?.[category]) {
        const urls = await Promise.all(
          prefs.wardrobeItems[category].map(async (fileId: string) => {
            return storage.getFileView(bucketId, fileId).href;
          })
        );
        setItems(urls);
      }
    } catch (error) {
      console.error("Error loading wardrobe items:", error);
    }
  };

  React.useEffect(() => {
    if (visible) {
      loadWardrobeItems();
    }
  }, [visible, category]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Select {category}</Text>

          <FlatList
            data={items}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => onSelect(item)}
              >
                <Image source={{ uri: item }} style={styles.itemImage} />
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#e2cdb5",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#4b2d10",
  },
  itemContainer: {
    width: 150,
    height: 150,
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#4b2d10",
    borderRadius: 25,
    padding: 10,
    width: 100,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
  },
});

export default VirtualTryOnModal;
