import { View, Text, Modal, TouchableOpacity, FlatList, StatusBar, StyleSheet, Image, Dimensions } from 'react-native';
import { useState, useContext } from 'react';
import { CreateCategoryContext } from '../../contexts/CreateCategoryContext';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import Feather from '@expo/vector-icons/Feather';

const { width } = Dimensions.get('window');
const ITEM_MARGIN = 8;
const NUM_COLUMNS = 2;
const ITEM_WIDTH = (width - 40 * 2 - ITEM_MARGIN * (NUM_COLUMNS * 2)) / NUM_COLUMNS; // 16 is paddingHorizontal from styles.row

const CategorySelection = () => {

    const { categorySelectionPop, setCategorySelectionPop, categoryTitle } = useContext(CreateCategoryContext);

    const DATA = [
        { id: '1', title: 'First Item' },
        { id: '2', title: 'Second Item' },
        { id: '3', title: 'Third Item' },
        { id: '4', title: 'Fourth Item' },
        { id: '5', title: 'Fifth Item' },
        { id: '6', title: 'Sixth Item' },
        { id: '7', title: 'Eighth Item' },
        { id: '8', title: 'Ninth Item' },
    ];

    type ItemProps = { title: string };

    const Item = ({ title }: ItemProps) => (
        <View>
            <TouchableOpacity style={styles.item}>
                <Image
                    source={require('../../assets/icons/Union.png')}
                    className="h-1/4"
                    style={{ aspectRatio: 1 }} // Ensures square shape
                    resizeMode="contain"
                />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
        </View>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 justify-center items-center">
                <Modal 
                    animationType="slide"
                    transparent={true}
                    visible={categorySelectionPop}
                    onRequestClose={() => {
                        setCategorySelectionPop(!categorySelectionPop);
                    }}
                >
                    <View className="flex-1 justify-center items-center">
                        <View className="h-3/4 w-[90%] bg-[#D2B48C] rounded-2xl">
                            <TouchableOpacity 
                                className="self-end"
                                onPress={() => setCategorySelectionPop(false)}
                            >
                                <Feather name="x" size={24} style={[styles.exit]} color="black" />
                            </TouchableOpacity>
                            <Text style={[styles.categoryTitle]}>{categoryTitle}</Text>
                            <FlatList
                                data={DATA}
                                renderItem={({ item }) => <Item title={item.title} />}
                                keyExtractor={item => item.id}
                                numColumns={2}
                                columnWrapperStyle={styles.row}
                            />
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    },
    row: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    },
    item: {
    backgroundColor: 'white',
    padding: ITEM_WIDTH * 0.13, // ~13% of item width for padding
    marginVertical: ITEM_MARGIN,
    flex: 1,
    marginHorizontal: ITEM_MARGIN,
    borderRadius: ITEM_WIDTH * 0.1, // 10% of item width
    height: ITEM_WIDTH, // make it square and responsive
    minWidth: ITEM_WIDTH,
    maxWidth: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    },
    title: {
    fontSize: 18,
    textAlign: 'center',
    },
    categoryTitle: {
    textAlign: 'center',
    fontSize: 24, // 2xl
    fontWeight: 'bold',
    marginBottom: 8, // mb-2 (8px)
    },

    exit: {
        marginRight: 0.04 * width, // 4% of screen width
        marginTop: 0.04 * width, // 4% of screen width
    },
});


export default CategorySelection;