import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, TouchableOpacity } from "react-native";

import images from "@/assets/images";
import FormField from "@/components/FormField";
import { StatusBar } from "expo-status-bar";



const SignIn = () => {
 
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
  });

  

  return (
    <SafeAreaView className="bg-primary h-full">
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
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            
          />

                  {/* Sign In button */}
                  <View className=' items-center justify-between'>
        <TouchableOpacity
                      className="mt-20 w-[75%] rounded-full bg-[#4D2A0A] px-6 py-3 pb-6"
        onPress={() => router.push('/home')}
        activeOpacity={0.7}
        >
        <Text className="w-full text-center text-lg font-semibold text-white">Sign In</Text>

        </TouchableOpacity>

                  </View>

          <View className="flex flex-row justify-center gap-2 pt-5">
            <Text className="font-pregular text-lg text-black">
              Don't have an account?
            </Text>
                      <Link
                          href="/sign-up"
                          className="font-psemibold text-secondary text-lg"
            >
              Signup
            </Link>
          </View>
        </View>
        <StatusBar style="light" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;