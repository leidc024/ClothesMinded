import { storage } from "../lib/appwrite"; // Import from your appwrite config

/**
 * Fetches a file from Appwrite Storage and converts it to base64.
 * @param {string} bucketId - The bucket ID where the file is stored.
 * @param {string} fileId - The ID of the file to fetch.
 * @returns {Promise<string>} - Base64 string of the file (with data URL prefix).
 */
export const getFileAsBase64 = async (bucketId, fileId) => {
  try {
    const blob = await storage.getFileView(bucketId, fileId);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result); // Full data URL (e.g., "data:image/png;base64,...")
        } else {
          reject(new Error("Failed to read file as base64."));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error in getFileAsBase64:", error);
    throw error; // Re-throw to handle in the calling function
  }
};
