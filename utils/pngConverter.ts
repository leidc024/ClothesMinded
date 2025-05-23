import * as ImageManipulator from 'expo-image-manipulator';

export const convertToPNG = async (jpegUri: string) => {
  const pngImage = await ImageManipulator.manipulateAsync(
    jpegUri,
    [],
    { format: ImageManipulator.SaveFormat.PNG }
  );
  return pngImage.uri; // Now a PNG file
};