import React, { useState, useEffect } from 'react';
import { Alert, Modal, Text, Pressable, View, TextInput } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { account } from "../lib/appwrite";
import { useUser } from '@/contexts/UserContext';

const NewUserNamePop = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [text, onChangeText] = useState('');
  const { current: user } = useUser(); 

  useEffect(() => {
    const checkUserPrefs = async () => {
      try {
        if (user?.prefs?.hasUserName === undefined ) {
          console.log("Creating new username.");
          setModalVisible(true);
        } else {
          console.log("User already has username.");
        }
      } catch (error) {
        console.log("No active session, user needs to authenticate.");
      }
    };
  
    checkUserPrefs();
  }, [user]);

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 justify-center items-center">
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}
        >
            <View className="flex-1 justify-center items-center">
                <View className="m-5 bg-white rounded-2xl p-9 items-center shadow-lg">
                <TextInput
                  onChangeText={onChangeText}
                  value={text}
                  className="border border-gray-300 rounded-md px-4 py-2 w-64 mb-4"
                  placeholder="Enter your username"
                />
                <Pressable
                    className="rounded-xl px-4 py-2 bg-[#D2B48C] "
                    onPress={async () => {
                        try {
                        await account.updatePrefs({ hasUserName: true });
                        setModalVisible(false);
                        const result = await account.updateName(text); // Assuming `text` is the new username
                        console.log('Username updated:', result);
                        } catch (err) {
                        console.error('Failed to update username:', err);
                        }
                    }}
                >
                    <Text className="text-white font-bold text-center">Confirm</Text>
                </Pressable>
                </View>
            </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default NewUserNamePop;
