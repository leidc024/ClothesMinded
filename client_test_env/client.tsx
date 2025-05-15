import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { Storage, ID } from 'react-native-appwrite';
import { client } from '../lib/appwrite';

const storage = new Storage(client);

const uploadBundledImage = async () => {
  console.log("Uploading image...");

  try {
    // Load asset and get its local URI
    const [asset] = await Asset.loadAsync(require("./images/image1.jpg"));
    const fileUri = asset.localUri || asset.uri;

    console.log("File URI:", fileUri);

    // Create FormData
    const formData = new FormData();
    formData.append("image", {
      uri: fileUri,
      name: "image1.jpg",
      type: "image/jpeg",
    });

    // Send the request
    const response = await fetch("http://10.0.2.2:3000/remove-bg", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const result = await response.json();
    const base64String = result.base64;

    // Ensure the response directory exists in app-specific storage
    const responseDir = FileSystem.documentDirectory + "response/";
    console.log("Checking if response directory exists at:", responseDir);
    const dirInfo = await FileSystem.getInfoAsync(responseDir);
    if (!dirInfo.exists) {
      console.log("Response directory does not exist. Creating...");
      await FileSystem.makeDirectoryAsync(responseDir, { intermediates: true });
      console.log("Response directory created successfully.");
    } else {
      console.log("Response directory already exists.");
    }

    // Save the response to a file in app-specific storage using downloadAsync
    const responseFilePath = responseDir + "response_image.webp";
    console.log("Saving response to:", responseFilePath);

    const tempFileUri = FileSystem.cacheDirectory + "temp_response_image.webp";
    await FileSystem.writeAsStringAsync(tempFileUri, base64String, {
        encoding: FileSystem.EncodingType.Base64,
    });

    console.log('Encoding type:', FileSystem.EncodingType.Base64);

    await FileSystem.moveAsync({
      from: tempFileUri,
      to: responseFilePath,
    });

    const promise = storage.createFile(
        '6825d9f500066a3dc28e',
        ID.unique(),
        {
            name: 'image.jpg',
            type: 'image/jpeg',
            size: 1234567,
            uri: responseFilePath,
        }
    );

    promise.then(function (response) {
        console.log(response); // Success
    }, function (error) {
        console.log(error); // Failure
    });

    console.log("Response saved to app-specific storage at:", responseFilePath);
  } catch (error) {
    console.log("Upload error:", error);
  }
};

export default uploadBundledImage;