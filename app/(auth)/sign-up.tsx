import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Image, Alert } from "react-native";

import images from "@/assets/images";
import FormField from "@/components/FormField";

import { useUser } from "@/contexts/UserContext"; // Use context for authentication

const Signup = () => {
  const user = useUser(); // Get register function from UserContext
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
  });

  const handleSignUp = async () => {
    if (!form.email || !form.password || !form.username) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    setSubmitting(true);

    try {
      await user.register(form.email, form.password);
      Alert.alert("Success", "Account created successfully!");
      router.push("/home"); // Redirect to home after successful signup
    } catch (error) {
      Alert.alert("Signup Failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary flex-1 h-full">
      <ScrollView>
        <View
          className="my-6 flex h-full w-full justify-center px-4"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.logo}
            resizeMode="contain"
            className="mx-auto mb-10 h-40 w-40"
          />

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            secureTextEntry={true}
          />

          {/* Sign Up Button */}
          <View className="mt-20 items-center">
            <TouchableOpacity
              activeOpacity={0.7}
              className="mt-7 w-[75%] rounded-full bg-[#4D2A0A] px-6 py-3"
              onPress={handleSignUp}
              disabled={isSubmitting}
            >
              <Text className="w-full text-center text-lg font-semibold text-white">
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
