import { databases } from '../lib/appwrite.js';

const addDocument = async (databaseId, collectionId, data) => {
    try {
      const response = await databases.createDocument(
        databaseId,
        collectionId,
        "unique()", // Auto-generate document ID
        data
      );
      console.log("Document added:", response);
      return response;
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

export { addDocument };