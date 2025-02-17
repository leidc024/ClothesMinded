import { useState } from "react";
import { TouchableOpacity, Image } from "react-native";
import icons from "@/assets/icons";
import React from "react";
import {
  Text,
  TextInput,
  View,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from "react-native";

type FormFieldProps = {
  title: string;
  value: string;
  handleChangeText: (text: string) => void;
  otherStyles?: StyleProp<ViewStyle>;
} & TextInputProps;

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="py-3 text-sm text-black">{title}</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#CBB59B",
          borderRadius: 12,
          height: 48,
           paddingHorizontal: 16,

        }}
      >
        <TextInput
          value={value}
          onChangeText={handleChangeText}
          placeholderTextColor="#A38F7A"
          secureTextEntry={(title === "Password" || title === "Confirm Password") && !showPassword}
          style={{
            flex: 1,
            color: "#4B2A1F",
            fontSize: 16,
          }}
          {...props}
        />
        {title === "Password" && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ padding: 8 }}
          >
            <Image
              source={!showPassword ? icons.eyeHide : icons.eye}
              style={{
                width: 24,
                height: 24,
                tintColor: "#4B2A1F", // Adjust color to fit your theme
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        {title === "Confirm Password" && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ padding: 8 }}
          >
            <Image
              source={!showPassword ? icons.eyeHide : icons.eye}
              style={{
                width: 24,
                height: 24,
                tintColor: "#4B2A1F", // Adjust color to fit your theme
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
