import {createContext, useState} from 'react';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export const CreateCategoryContext = createContext();

export const CreateCategoryProvider = ({ children }) => {
    const [createCategory, setCreateCategory] = useState(false); // A bool which indicates whether the category creation modal is open or closed
    const [titleCategory, setTitleCategory] = useState(''); // String state for the title TO BE ASSIGNED to the category
    const [categoryList, setCategoryList] = useState([]); // Array state for the list of categories, we'll prob need to connect this to the database
    const [editCategory, setEditCategory] = useState(false); // A bool which indicates whether the category is being edited or not
    const [categoryId, getCategoryId] = useState(''); // String state for the ID of the category we want to access
    const [categorySelectionPop, setCategorySelectionPop] = useState(false); // A bool which indicates whether the category selection modal is open or closed
    const [categoryTitle, getCategoryTitle] = useState(''); // String state for the title of the category we want to access
    return (
        <CreateCategoryContext.Provider value={{ 
            createCategory, 
            setCreateCategory, 
            titleCategory, 
            setTitleCategory,
            categoryList,
            setCategoryList,
            editCategory,
            setEditCategory,
            categoryId,
            getCategoryId,
            categorySelectionPop,
            setCategorySelectionPop,
            categoryTitle,
            getCategoryTitle
        }}>
            {children}
        </CreateCategoryContext.Provider>
    );
};