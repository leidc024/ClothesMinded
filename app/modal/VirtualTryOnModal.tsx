import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface VirtualTryOnModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
  category: string;
}

const STORAGE_KEY = "wardrobe_images";

const VirtualTryOnModal: React.FC<VirtualTryOnModalProps> = ({
  visible,
  onClose,
  onSelect,
  category,
}) => {
  const [items, setItems] = useState<string[]>([]);

  const loadWardrobeItems = async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        const stored = JSON.parse(json);
        if (stored && stored[category]) {
          setItems(stored[category]);
        }
      }
    } catch (error) {
      console.error("Error loading wardrobe items:", error);
    }
  };

  useEffect(() => {
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

          {items.length > 0 ? (
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
          ) : (
            <Text style={styles.emptyText}>
              No items found in this category
            </Text>
          )}

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
  emptyText: {
    fontSize: 16,
    color: "#4b2d10",
    marginVertical: 20,
  },
});

export default VirtualTryOnModal;
