import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const clothingOptions = ['Shirt', 'Jacket', 'Dress', 'Shorts', 'Pants'];
const { width: screenWidth } = Dimensions.get('window');

const Clothes = () => {
    const [selected, setSelected] = useState('Shirt');
    const router = useRouter();

    const handleSelect = (option: string) => {
        setSelected(option);
        router.push({
            pathname: '/camera',
            params: { clothingType: option },
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#7F705F' }}>
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 40,
                    paddingHorizontal: 20,
                }}
            >
                <View
                    style={{
                        width: screenWidth * 0.9,
                        borderRadius: 10,
                        backgroundColor: '#f8f6f1',
                        padding: 24,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                    }}
                >
                    <Text style={{ marginBottom: 16, textAlign: 'center', fontSize: 18, fontWeight: '600' }}>
                        Clothing Type:
                    </Text>

                    {clothingOptions.map((option) => (
                        <TouchableOpacity
                            key={option}
                            onPress={() => handleSelect(option)}
                            style={{
                                paddingVertical: 14,
                                paddingHorizontal: 20,
                                borderRadius: 8,
                                marginBottom: 16,
                                backgroundColor: '#ffffff',
                                borderColor: '#5c3a1c',
                                borderWidth: 1,
                                minWidth: screenWidth * 0.6,
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontWeight: '500',
                                    color: '#5c3a1c',
                                }}
                            >
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <StatusBar style="dark" />
        </SafeAreaView>
    );
};

export default Clothes;
