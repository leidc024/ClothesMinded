// apiService.ts
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const api = axios.create({
  baseURL: 'http://172.16.18.101:3000', // Replace with your actual backend URL
  timeout: 100000, // 30 seconds timeout for image processing
});

export const get = async () =>{
  api.get('/').then((res) => {
    console.log('Response:', res.data);
    return res.data;
  }).catch((err) => {
    console.error('Error:', err);
  });
  return "None"
}

export const removeBackground = async (imageUri: string) => {
  const formData = new FormData();
  
  // Extract filename and type from URI
  const filename = imageUri.split('/').pop() || 'image.jpg';
  const type = Platform.OS === 'android' ? 
    `image/${filename.split('.').pop()}` : 
    `image/jpeg`; // iOS typically uses jpeg

  formData.append('image', {
    uri: imageUri,
    name: filename,
    type: type,
  } as any);

  console.log('FormData:', formData.getAll('image'));
  try {
    const response = await api.post('/remove-bg', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const base64Data = response.data.base64;
    if (!base64Data) {
      throw new Error('No base64 data received from API');
    }

    // 3. Create a temporary file
    const tempUri = `${FileSystem.cacheDirectory}process${Date.now()}.webp`;

    const fileInfo = await FileSystem.getInfoAsync(tempUri);
    
    // 2. Remove if exists
    if (fileInfo.exists) {
      console.log('Existing file found, removing...');
      await FileSystem.deleteAsync(tempUri);
    }

    await FileSystem.writeAsStringAsync(tempUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return tempUri; // returns something like: file:///path/to/image.webp
  } catch (error) {
    console.error('Background removal error:', error);
    throw error;
  }
};