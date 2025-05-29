import { databases } from '../lib/appwrite.js';
import { ID } from 'react-native-appwrite';
import { Query } from 'appwrite';
import { storage } from '../lib/appwrite';

const databaseID = "67ad9e670028ece6ed36";
const userCollectionID = "67d3ea200018791dcc14";
const categoryCollectionID = "67d3c85800348c24a27b";
const avatarCollectionID = "67d3c8cd002354dcef59";
const clothingCollectionID = "67d3c99a0027096bb0c2";
const clothesCategoriesCollectionID = "6827fcc800130b16ad1a";

const avatarStorageID = "6825d9f500066a3dc28e"; // Storage ID
const clothesStorageID = "6828105b000b23c42ebe"; // Clothes Storage ID

export const generateID = () => ID.unique();

const addClothingImage = async (id = ID.unique(), filePath) => {
  console.log(filePath);
  try {
    // 1. Upload the file
    const result = await storage.createFile(
      clothesStorageID,
      id,
      {
        name: 'clothing.jpg',
        type: 'image/jpg',
        size: 1234567,
        uri: filePath
      }
    );

    // 2. Get the file preview URL
    const fileUrl = await getClothingURI(id);
    return { id, uri: fileUrl };
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}

const getClothingURI = async (fileId) => {
  try {
    // Get file metadata first (optional)
    const file = await storage.getFile(clothesStorageID, fileId);
    console.log('File metadata:', file);
    
    // Get the file preview/URI
    const result = storage.getFileView(clothesStorageID, fileId);
    // OR for download URL:
    // const result = storage.getFileDownload(bucketId, fileId);
    
    return result.href; // This is the URI/URL you can use
  } catch (error) {
    console.error('Error getting file URI:', error);
    return null;
  }
};

const removeClothingImageByID = async (fileId) => {
  try {
    await storage.deleteFile(bucketId, fileId);
    console.log('File deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

const getAvatarUriByUserID = async (userID) => {
  try {
    // Get file metadata first (optional)
    const avatarID = await getAvatarInfoByUserID(userID)
    console.log('Avatar ID:', avatarID[0].avatarID);
    const file = await storage.getFile(avatarStorageID, avatarID[0].avatarID);
    console.log('File metadata:', file);
    // Get the file preview/URI
    const result = await storage.getFileView(avatarStorageID, avatarID[0].avatarID);
    console.log(result);
    // OR for download URL:
    // const result = storage.getFileDownload(bucketId, fileId);
    
    return result.href; // This is the URI/URL you can use
  } catch (error) {
    console.error('Error getting file URI:', error);
    return null;
  }
};

const addUserAvatar = async ( filePath ) => {
  const id = ID.unique();
  console.log(filePath);
  try {
    const result = await storage.createFile(
      '6825d9f500066a3dc28e', // bucketId
      id, // fileId
      {
        name: 'image.png',
        type: 'image/png',
        size: 1234567,
        uri: filePath
      }, // file
    );
    console.log(result); // Success
    return id;
  } catch (error) {
    console.error(error); // Failure
    return null;
  }
}

const addClothingDocument = async ( data ) => {
  try {
    const response = await databases.createDocument(
      databaseID,
      clothingCollectionID,
      "unique()", // Auto-generate document ID
      data
    );
    console.log("Document added:", response);
    return response;
  } catch (error) {
    console.error("Error adding document:", error);
  }
}

const addAvatarDocument = async ( data ) => {
  try {
    const response = await databases.createDocument(
      databaseID,
      avatarCollectionID,
      "unique()", // Auto-generate document ID
      data
    );
    console.log("Document added:", response);
    return response;
  } catch (error) {
    console.error("Error adding document:", error);
  }
}

const addUserDocument = async ( data ) => {
  try {
    const response = await databases.createDocument(
      databaseID,
      userCollectionID,
      "unique()", // Auto-generate document ID
      data
    );
    console.log("Document added:", response);
    return response;
  } catch (error) {
    console.error("Error adding document:", error);
  }
};

const addCategoryDocument = async ( id, data ) => {
  try {
    const response = await databases.createDocument(
      databaseID,
      categoryCollectionID,
      id, // Auto-generate document ID
      data
    );
    console.log("Document added:", response);
    return response;
  } catch (error) {
    console.error("Error adding document:", error);
  }
};

const addClothesCategoriesDocument = async (data) => {
  try {
    const response = await databases.createDocument(
      databaseID,
      clothesCategoriesCollectionID,
      "unique()", // Auto-generate document ID
      data
    );
    console.log("Document added:", response);
    return response;
  } catch (error) {
    console.error("Error adding document:", error);
  }
}

const getCategoryDocumentsByUserId = async (targetUserId) => {
  try {
      const response = await databases.listDocuments(
          databaseID,
          categoryCollectionID,
          [
              Query.equal('userID', targetUserId)
          ]
      );

      const results = response.documents;
      console.log('Documents with userID:', results);
      return results;
      // response.documents will be an array of document objects that have the specified userID.
  } catch (error) {
      console.error('Error getting documents:', error);
      // Handle the error appropriately.
  }
}

const getClothingItemsByUserID = async (userID) => {
  try {
      const response = await databases.listDocuments(
          databaseID,
          clothingCollectionID,
          [
              Query.equal('userID', userID)
          ]
      );

      const results = response.documents;
      console.log('Documents with userID:', results);
      return results;
      // response.documents will be an array of document objects that have the specified userID.
  } catch (error) {
      console.error('Error getting documents:', error);
      // Handle the error appropriately.
  }
}

const getAvatarInfoByUserID = async (userID) => {
  try {
      const response = await databases.listDocuments(
          databaseID,
          avatarCollectionID,
          [
              Query.equal('userID', userID)
          ]
      );

      const results = response.documents;
      console.log('Documents with userID:', results);
      return results;
      // response.documents will be an array of document objects that have the specified userID.
  } catch (error) {
      console.error('Error getting documents:', error);
      // Handle the error appropriately.
  }
}

const getClothingItemsByClothingImageID = async (imageID) => {
    try {
      const response = await databases.listDocuments(
          databaseID,
          clothingCollectionID,
          [
              Query.equal('clothingID', imageID)
          ]
      );

      const results = response.documents;
      console.log('Clothing Items with Clothing Image ID:', results);
      return results;
      // response.documents will be an array of document objects that have the specified userID.
  } catch (error) {
      console.error('Error getting documents:', error);
      // Handle the error appropriately.
  }
}

const getClothesCategoriesItemsByCategoryIDs = async (categoryIDs) => {
    try {
        const response = await databases.listDocuments(
            databaseID,
            clothesCategoriesCollectionID,
            [
                Query.equal('categoryID', categoryIDs),
                Query.limit(50)
            ]
        );

        const results = response.documents;
        
        // Group documents by categoryID and remove categoryID from each item
        const groupedByCategory = results.reduce((acc, document) => {
            const category = document.categoryID;
            if (!acc[category]) {
                acc[category] = [];
            }
            // Create new object without categoryID
            acc[category].push({
                id: document.clothingDocumentID,
                title: document.title,
                uri: document.uri
            });
            return acc;
        }, {});

        console.log('Grouped documents without categoryID:', groupedByCategory);
        return groupedByCategory;
        
    } catch (error) {
        console.error('Error getting documents:', error);
        throw error;
    }
}
const getIDofClothesCategoriesItem = async(categoryID, clothingUri) => {
    try {
      const response = await databases.listDocuments(
          databaseID,
          clothesCategoriesCollectionID,
          [
              Query.equal('categoryID', categoryID),
              Query.equal('clothingDocumentID', clothingUri),
              Query.limit(50)
          ]
      );

      const results = response.documents;
      console.log('Documents with userID:', results);
      return results;
      // response.documents will be an array of document objects that have the specified userID.
  } catch (error) {
      console.error('Error getting documents:', error);
      // Handle the error appropriately.
  }
}

const removeCategoryDocument = async (id) => {
  // Delete a document
  databases.deleteDocument(
    databaseID,    // Your database ID
    categoryCollectionID,  // Your collection ID
    id     // ID of document to delete
  ).then(response => {
    console.log('Document deleted:', response);
  }).catch(error => {
    console.error('Error deleting document:', error);
  });
}

const removeClothingDocument = async (categoryID) => {
  const clothingDocument = await getClothingItemsByClothingImageID(categoryID);
  const item = clothingDocument.pop();
  if (!item){
    return;
  }
  databases.deleteDocument(
    databaseID,    // Your database ID
    clothingCollectionID,  // Your collection ID
    item.$id     // ID of document to delete
  ).then(response => {
    console.log('Document deleted:', response);
  }).catch(error => {
    console.error('Error deleting document:', error);
  });
}

const removeClothesCategoriesDocumentWithClothingID = async (categoryID, clothingID) => {
  const clothesCategoryDocument = await getIDofClothesCategoriesItem(categoryID, clothingID);
  const item = clothesCategoryDocument.pop();
  if (!item){
    return;
  }
  databases.deleteDocument(
    databaseID,    // Your database ID
    clothesCategoriesCollectionID,  // Your collection ID
    item.$id     // ID of document to delete
  ).then(response => {
    console.log('Document deleted:', response);
  }).catch(error => {
    console.error('Error deleting document:', error);
  });
}

export { addUserDocument, addCategoryDocument, addClothingDocument, getCategoryDocumentsByUserId, getClothingItemsByUserID, addAvatarDocument, addUserAvatar, addClothingImage, getClothingURI, getAvatarUriByUserID, addClothesCategoriesDocument, getClothesCategoriesItemsByCategoryIDs };
export { removeCategoryDocument, removeClothingImageByID, removeClothingDocument, removeClothesCategoriesDocumentWithClothingID }