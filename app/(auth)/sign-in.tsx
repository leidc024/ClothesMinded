import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, TouchableOpacity } from "react-native";

import images from "@/assets/images";
import FormField from "@/components/FormField";
import { StatusBar } from "expo-status-bar";
import { useUser } from '@/contexts/UserContext';

const SignIn = () => {

/*
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
  });
*/

const user = useUser();
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');



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
            value={email}
            handleChangeText={setEmail}
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={password}
            handleChangeText={setPassword}  
          />

            {/* Sign In button */}
            <View className=' items-center justify-between'>
              <TouchableOpacity className="mt-20 w-[75%] rounded-full bg-[#4D2A0A] px-6 py-3 pb-6" 
                onPress={async () => 
                  {
                    await user.login(email, password); // Log in the user first
                    router.push('/home'); // Navigate to home after successful login
                  }
                }  
                activeOpacity={0.7}>
                <Text className="w-full text-center text-lg font-semibold text-white">Sign In</Text>
              </TouchableOpacity>
            </View>

          <View className="flex flex-row justify-center gap-2 pt-5">
            <Text className="font-pregular text-lg text-black">
              Don't have an account?
            </Text>
            <Link href="/sign-up" className="font-psemibold text-secondary text-lg">
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