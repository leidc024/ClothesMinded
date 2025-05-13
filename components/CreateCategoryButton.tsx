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
                className="rounded-3xl flex-row border-2 w-3/4 h-full justify-center items-center px-4"
                onPress={() => {
                    setCreateCategory(true); 
                    setEditCategory(false);
                } }
            >
                <View style={{ aspectRatio: 1 }} className="rounded-2xl h-3/4 border-2 justify-center items-center">
                    <Image
                        source={require('../assets/icons/Union.png')} // Local image
                        className="h-1/4"
                        style={{ aspectRatio: 1 }} // Ensures square shape
                        resizeMode="contain"
                    />
                </View>
                <Text className="flex-1 text-lg font-bold ml-4">Create Category</Text>
            </TouchableOpacity>
        </View>
    );
}

export default CreateCategoryButton;
