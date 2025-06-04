import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

const GuestAlertModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
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
          backgroundColor: "#CBB59B",
          borderRadius: 20,
          padding: 30,
          alignItems: "center",
          width: 300,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 15 }}>
          Oops
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#333",
            textAlign: "center",
            marginBottom: 30,
          }}
        >
          Account Required{"\n"}Please sign in to use this feature.
        </Text>
        <TouchableOpacity
          onPress={onClose}
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
);

export default GuestAlertModal;