import { View, Text, TouchableOpacity, Dimensions, Image} from 'react-native'
import { useContext } from 'react';

import { CreateCategoryContext } from '../contexts/CreateCategoryContext';

const { height } = Dimensions.get('window'); // Get screen height
const ITEM_HEIGHT = height * 0.125; // % of screen height
           
const CreateCategoryButton = () => {

    const {setCreateCategory, setEditCategory} = useContext(CreateCategoryContext);

    return(
        <View style={{ height: ITEM_HEIGHT }} className='w-full items-center justify-center'>
            <TouchableOpacity
                className="h-full w-3/4 flex-row items-center justify-center rounded-3xl border-2 bg-white px-4"
                onPress={() => {
                    setCreateCategory(true); 
                    setEditCategory(false);
                } }
            >
                <View style={{ aspectRatio: 1 }} className="h-3/4 items-center justify-center rounded-2xl border-2">
                    <Image
                        source={require('../assets/icons/Union.png')} // Local image
                        className="h-1/4"
                        style={{ aspectRatio: 1 }} // Ensures square shape
                        resizeMode="contain"
                    />
                </View>
                <Text className="ml-4 flex-1 text-lg font-bold">Create Category</Text>
            </TouchableOpacity>
        </View>
    );
}

export default CreateCategoryButton;
