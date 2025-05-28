import type React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

interface ChooseGenerateProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectClothingItem: () => void;
  onSelectOutfit: () => void;
  onGenerateOutfit: () => void;
}

const ChooseGenerate: React.FC<ChooseGenerateProps> = ({
  isVisible,
  onClose,
  onSelectClothingItem,
  onSelectOutfit,
  onGenerateOutfit,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Choose</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={onSelectClothingItem}
          >
            <Text style={styles.buttonText}>Select Clothing Item</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={onSelectOutfit}>
            <Text style={styles.buttonText}>Select Outfit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={onGenerateOutfit}>
            <Text style={styles.buttonText}>Generate Outfit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get("window");
const modalWidth = width * 0.8;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: modalWidth,
    maxWidth: 280,
    backgroundColor: "#e2cdb5",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "#4b2d10",
    marginBottom: 24,
  },
  button: {
    width: "100%",
    backgroundColor: "#4b2d10",
    borderRadius: 50,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
});

export default ChooseGenerate;
