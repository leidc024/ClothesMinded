import { databases } from '../lib/appwrite.js';
import { Query } from 'appwrite';

const databaseID = "67ad9e670028ece6ed36";
const userCollectionID = "67d3ea200018791dcc14";
const categoryCollectionID = "67d3c85800348c24a27b";

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

const addCategoryDocument = async ( data ) => {
  try {
    const response = await databases.createDocument(
      databaseID,
      categoryCollectionID,
      "unique()", // Auto-generate document ID
      data
    );
    console.log("Document added:", response);
    return response;
  } catch (error) {
    console.error("Error adding document:", error);
  }
};

async function getCategoryDocumentsByUserId(targetUserId) {
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

export { addUserDocument, addCategoryDocument, getCategoryDocumentsByUserId };