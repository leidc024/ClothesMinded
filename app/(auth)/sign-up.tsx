import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Image } from "react-native";

import images from "@/assets/images";
import FormField from "@/components/FormField";

import { useUser } from "@/contexts/UserContext";

const Signup = () => {

  const user = useUser();
 
  //const [isSubmitting, setSubmitting] = useState(false); Does this need to be used???
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [password, checkPassword] = useState('');

  

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
            handleChangeText={(e) => setForm({ 
              ...form, 
              password: e 
            })}
          />

          <FormField
            title="Confirm Password"
            value={form.password}
            handleChangeText={(e) => setForm({ 
              ...form, 
              password: e 
            })}
          />

          <View className='mt-20 items-center'>
              <TouchableOpacity activeOpacity={0.7} className="mt-7 w-[75%] rounded-full bg-[#4D2A0A] px-6 py-3"
                  onPress={() => {
                    router.push('/head'); 
                    user.register(form.email, form.password, form.username);
                  }}
              >
                <Text className="w-full text-center text-lg font-semibold text-white">Sign Up</Text>
              </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default Signup;