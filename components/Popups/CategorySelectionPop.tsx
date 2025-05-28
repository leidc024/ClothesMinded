import { View, Text, Modal, TouchableOpacity, FlatList, StatusBar, StyleSheet, Image, Dimensions } from 'react-native';
import { useState, useContext, useEffect } from 'react';
import { CreateCategoryContext } from '../../contexts/CreateCategoryContext';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import Feather from '@expo/vector-icons/Feather';
import { loadCategoryElementsFromStorage } from '@/utils/localStorage';

const { width } = Dimensions.get('window');
const ITEM_MARGIN = 8;
const NUM_COLUMNS = 2;
const ITEM_WIDTH = (width - 40 * 2 - ITEM_MARGIN * (NUM_COLUMNS * 2)) / NUM_COLUMNS; // 16 is paddingHorizontal from styles.row

const CategorySelection = () => {

    const { categorySelectionPop, setCategorySelectionPop, categoryTitle, categoryList, categoryElements, setCategoryElements } = useContext(CreateCategoryContext);
    
    useEffect(()=>{
        if (!categorySelectionPop){
            return;
        }

        const fetchElements = async () => {
            const categoryID = (()=>{
                const filter = categoryList.filter((item: any) => item.title === categoryTitle);
                if(filter[0]){
                    console.log(filter[0].id);
                    return filter[0].id;
                }else return null;
            })();
            
            console.log(categoryID);
            const elements = await loadCategoryElementsFromStorage(categoryID);
            setCategoryElements(elements);
        }

        fetchElements();
    }, [categorySelectionPop]);

    const [DATA, setDATA] = useState([
        { id: '0', uri: 'Zeroeth Item' },
        { id: '1', uri: 'https://cloud.appwrite.io/v1/storage/buckets/6828105b000b23c42ebe/files/682841e40013e79ea00d/view?project=67ad0aec0002e74ec57d' },
    ]);

    
    const handleAddItem = () => {
        return;
    }

    type ItemProps = { uri: string; id: string; onPress?: () => void };

    const Item = ({ uri, id, onPress }: ItemProps) => (
        <View>
            <TouchableOpacity style={styles.item} onPress={onPress}>
                <Image
                    source={(id === '0') ? require('../../assets/icons/Union.png') : {uri: uri}}
                    style={[
                        { 
                        aspectRatio: 1,    // Ensures square shape (width = height)
                        height: (id === '0') ? '25%' : '100%',    
                        resizeMode: 'contain'
                        }
                    ]}
                    resizeMode="contain"
                />
            </TouchableOpacity>
            <Text style={styles.title}>{id === '0' ? "Add Item" : ""}</Text>
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
                                renderItem={({ item }) => <Item id={item.id} uri={item.uri} 
                                                onPress={()=>{
                                                    if (item.id != '0') return;
                                                    handleAddItem()
                                                }
                                            }/>}
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
        padding: ITEM_WIDTH * 0, // ~13% of item width for padding
        marginVertical: ITEM_MARGIN,
        flex: 1,
        marginHorizontal: ITEM_MARGIN,
        borderRadius: ITEM_WIDTH * 0.1, // 10% of item width
        height: ITEM_WIDTH, // make it square and responsive
        minWidth: ITEM_WIDTH,
        maxWidth: ITEM_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
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