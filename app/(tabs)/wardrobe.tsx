import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { FontAwesome } from '@expo/vector-icons'

const Wardrobe = () => {
    // State to track scroll position for custom indicator
    const [scrollPositionShirts, setScrollPositionShirts] = useState(0);
    const [scrollPositionJackets, setScrollPositionJackets] = useState(0);
    const [scrollPositionPants, setScrollPositionPants] = useState(0);
    const [scrollPositionDress, setScrollPositionDress] = useState(0);
    const [scrollPositionShorts, setScrollPositionShorts] = useState(0);

    return (
        <SafeAreaView className="flex-1 bg-[#F5EEDC] px-4">
            <StatusBar style="dark" />

            {/* Header */}
            <View className="mt-4">
                <Text className="text-center text-2xl font-bold">Wardrobe</Text>
            </View>

            {/* Search and Filter */}
            <View className="mt-4 flex-row items-center justify-center">
                <View className="w-[70%] flex-row items-center rounded-full border border-gray-300 bg-white px-4 py-3 shadow-md">
                    <FontAwesome name="search" size={18} color="gray" />
                    <TextInput
                        placeholder="Search"
                        className="flex-1 ml-3 text-lg"
                    />
                    <TouchableOpacity>
                        <FontAwesome name="close" size={18} color="gray" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity className="ml-3 rounded-lg border border-gray-400 bg-[#D2B48C] px-4 py-3 shadow-md">
                    <FontAwesome name="filter" size={18} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView className="mt-6" showsVerticalScrollIndicator={false}>
                {/* Category: Shirts */}
                <CategorySection
                    title="Shirts"
                    scrollPosition={scrollPositionShirts}
                    setScrollPosition={setScrollPositionShirts}
                    images={[
                        "https://example.com/shirt1.png",
                        "https://example.com/shirt2.png",
                        "https://example.com/shirt3.png"
                    ]}
                />

                {/* Category: Jackets */}
                <CategorySection
                    title="Jackets"
                    scrollPosition={scrollPositionJackets}
                    setScrollPosition={setScrollPositionJackets}
                    images={[
                        "https://example.com/jacket1.png",
                        "https://example.com/jacket2.png",
                        "https://example.com/jacket3.png"
                    ]}
                />

                {/* Category: Pants */}
                <CategorySection
                    title="Dress"
                    scrollPosition={scrollPositionDress}
                    setScrollPosition={setScrollPositionDress}
                    images={[
                        "https://example.com/pants1.png",
                        "https://example.com/pants2.png",
                        "https://example.com/pants3.png"
                    ]}
                />

                {/* Category: Shorts */}
                <CategorySection
                    title="Shorts"
                    scrollPosition={scrollPositionShorts}
                    setScrollPosition={setScrollPositionShorts}
                    images={[
                        "https://example.com/pants1.png",
                        "https://example.com/pants2.png",
                        "https://example.com/pants3.png"
                    ]}
                />


                {/* Category: Pants */}

                <CategorySection
                    title="Pants"
                    scrollPosition={scrollPositionPants}
                    setScrollPosition={setScrollPositionPants}
                    images={[
                        "https://example.com/pants1.png",
                        "https://example.com/pants2.png",
                        "https://example.com/pants3.png"
                    ]}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

// Component for a category section with custom scroll indicator
const CategorySection = ({ title, images, scrollPosition, setScrollPosition }) => {
    return (
        <View className="mb-6">
            <Text className="text-xl font-semibold">{title}</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => {
                    let contentOffset = e.nativeEvent.contentOffset.x;
                    let contentWidth = e.nativeEvent.contentSize.width;
                    let scrollViewWidth = e.nativeEvent.layoutMeasurement.width;
                    setScrollPosition((contentOffset / (contentWidth - scrollViewWidth)) * 100);
                }}
                scrollEventThrottle={16}
                className="mt-2"
            >
                <CategoryItem />
                {images.map((img, index) => (
                    <ClothingItem key={index} image={img} />
                ))}
            </ScrollView>

            {/* Custom Scroll Indicator */}
            <View className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-300">
                <View
                    style={{ width: `${scrollPosition}%` }}
                    className="h-full rounded-full bg-black"
                />
            </View>
        </View>
    );
}

// Component for the "+" add item with rounded border
const CategoryItem = () => (
    <View className="border-2 mx-2 flex h-32 w-24 items-center justify-center rounded-2xl border-black">
        <Text className="text-4xl">+</Text>
    </View>
);

// Component for clothing items with rounded border
const ClothingItem = ({ image }) => (
    <View className="mx-2 flex h-32 w-24 items-center justify-center rounded-2xl border bg-white">
        <Image
            source={{ uri: image }}
            className="h-full w-full rounded-2xl"
            resizeMode="contain"
        />
    </View>
);

export default Wardrobe;
