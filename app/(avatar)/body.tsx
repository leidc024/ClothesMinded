import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState, useEffect, useRef, useContext } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, ImageSourcePropType } from 'react-native';
import Loader from '@/components/Loader';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import { addAvatarDocument, addUserAvatar } from '@/contexts/database';
import { useUser } from '@/contexts/UserContext';
import { removeBackground } from "react-native-background-remover"
import { convertToPNG } from '@/utils/pngConverter';

export default function App() {
    const timer = 5;
    const [facing, setFacing] = useState<CameraType>('front'); // Use the front camera by default
    const [loadedAssets, setLoadedAssets] = useState<Asset[]>([]);
    const [poseNumber, setPoseNumber] = useState(0);
    const [permission, requestPermission] = useCameraPermissions();
    const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);

    const [isCountingDown, setIsCountingDown] = useState(false);
    const [countdown, setCountdown] = useState(timer);
    const cameraRef = useRef<CameraView>(null);
    const countdownInterval = useRef<number>(null);

    const [isProcessing, setIsProcessing] = useState(false);
    const [isBackgroundRemoved, setIsBackgroundRemoved] = useState(false);

    const { current: user, updatePreferences } = useUser();

    const assetPaths = [
        require('@/assets/poses/pose0.png'),
    ];



    useEffect(() => {
        const loadAssets = async () => {
            await Asset.loadAsync(assetPaths);
            setLoadedAssets(assetPaths.map(module => Asset.fromModule(module)));
        };
        loadAssets();
    }, []);

    // Add this effect for countdown
    useEffect(() => {
        if (isCountingDown) {
            countdownInterval.current = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        if (countdownInterval.current) {
                            clearInterval(countdownInterval.current);
                            setIsCountingDown(false);
                            takePicture(); // Call your photo capture function
                            return timer; // Reset countdown
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (countdownInterval.current) {
                clearInterval(countdownInterval.current);
            }
        };
    }, [isCountingDown]);

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 1,
                    skipProcessing: true,
                });
                if (photo && photo.uri) {
                    setPhotoUri(photo.uri);
                    console.log('Photo taken:', photo);
                }
                // Handle the photo (save, navigate, etc.)
                // router.replace('/(tabs)/home');
            } catch (error) {
                console.error('Failed to take picture:', error);
            }
        }
    };

    const handleProceed = async () => {
        if (!photoUri) {
            console.error('No photo URI available');
            return;
        }
        // Handle the proceed action (e.g., navigate to another screen)
        setIsProcessing(true);
        console.log("processing")


        if (!isBackgroundRemoved) {
            console.log("Removing background");
            const result = await removeBackground(photoUri);
            console.log(result);

            console.log("Converting to PNG");
            const pngResult = await convertToPNG(result);
            console.log(pngResult);
            
            setPhotoUri(pngResult);
            setIsBackgroundRemoved(true);
        }else{
            console.log('Proceeding with photo:', photoUri);
            const avatarID = await addUserAvatar(photoUri as string);
            if (avatarID && user.$id) {
                updatePreferences('hasAvatar', true);
                await addAvatarDocument({
                    userID: user.$id,
                    avatarID: avatarID,
                });
                setIsBackgroundRemoved(false);
                setIsProcessing(false);
                router.replace('/(tabs)/home');
            }
        }
        // addRemovedBackground(result);
        setIsProcessing(false);
    }

    const handleCameraPress = () => {
        setIsCountingDown(true); // Start countdown
    };

    const handleFacing = () => {
        setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
    }

    const handleRetry = () => {
        setIsBackgroundRemoved(false);
        setPhotoUri(undefined)
    }

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.permissionMessage}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isProcessing && <Loader />}
            { !photoUri ? (
                <>
                    { isCountingDown ? (
                        <Text style={styles.instructions}>Hold still!</Text>
                    ) : (
                        <Text style={styles.instructions}>Follow the pose below</Text>
                    )}
                </>
            ) : (
                <Text style={styles.instructions}>Photo Preview</Text>
            )}
            <View style={styles.cameraContainer}>
                { !photoUri ? (
                    <>
                        <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
                            {/* Overlay or additional features inside the camera view if needed */}
                        </CameraView>
                        {/* PNG Overlay - Absolute Positioning */}
                        <Image
                            source={loadedAssets[poseNumber] as ImageSourcePropType} // Local file
                            style={styles.overlay}
                            resizeMode="contain"
                        />
                    </>
                ) : (
                    <Image source={{ uri: photoUri }} style={getPreviewStyle(facing).preview}/>
                )}
                {/* Countdown display */}
                    {isCountingDown && (
                        <View style={styles.countdownContainer}>
                            <Text style={styles.countdownText}>{countdown}</Text>
                        </View>
                )}
            </View>
            {/* <Text style={styles.instructions}>Scan your body to{"\n"}make your real- {"\n"} life avatar</Text> */}
            
            
            { !isCountingDown && photoUri && (
                <>
                    <TouchableOpacity style={styles.proceedButton} onPress={handleProceed} activeOpacity={0.7}>
                        <Text style={styles.instructions}>Proceed</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.retryButton} onPress={handleRetry} activeOpacity={0.7}>
                        <Text style={styles.instructions}>Retake</Text>
                    </TouchableOpacity>
                </>
            )}

            {/* Camera button */}
            
            { !isCountingDown && !photoUri && (
                <TouchableOpacity style={styles.button} onPress={handleCameraPress} activeOpacity={0.7}>
                    <Ionicons name="camera-outline" size={30} color="#4D2A0A" />
                </TouchableOpacity>
            )}

            { !isCountingDown && !photoUri && (
                <TouchableOpacity style={styles.buttonFlip} onPress={handleFacing} activeOpacity={0.7}>
                    <Ionicons name="camera-reverse-outline" size={30} color="#4D2A0A" />
                </TouchableOpacity>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        paddingTop: 0,
        alignItems: 'center',
        backgroundColor: '#7F705F', // Updated background color
    },
    cameraContainer: {
        width: '75%', // Adjust width to focus on head only
        aspectRatio: 1/2, // Headshot-like aspect ratio
        borderRadius: 20, // Rounded corners
        overflow: 'hidden', // Ensures the camera view fits the rounded shape
        backgroundColor: 'black', // Placeholder background
        marginBottom: 10, // Space for text instructions below
    },
    permissionMessage: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
        marginBottom: 30,
        marginTop:20,
    },
    camera: {
        flex: 1,
    },
    instructions: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
        textAlign: 'center',
        marginBottom: 10, // Space between instructions and the button
    },
    button: {
        backgroundColor: '#6E5846', // Button color
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        zIndex: 2
    },
    buttonFlip: {
        backgroundColor: '#6E5846', // Button color
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        position: 'absolute',
        bottom: 20,
        right: 50,
        zIndex: 2
    },
    proceedButton:{
        backgroundColor: '#6E5846', // Button color
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        position: 'absolute',
        bottom: 15,
        left: 50,
        zIndex: 2
    },
    retryButton:{
        backgroundColor: '#6E5846', // Button color
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
        position: 'absolute',
        bottom: 15,
        right: 50,
        zIndex: 2
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 1, // Above camera but below buttons
        opacity: 0.7, // Adjust transparency
        pointerEvents: 'none', // Allows touch through overlay
    },
    countdownContainer: {
        position: 'absolute',
        zIndex: 3,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    countdownText: {
        fontSize: 120,
        color: 'white',
        fontWeight: 'bold',
    },
});

const getPreviewStyle = (facing: CameraType) => StyleSheet.create({
  preview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    transform: facing === 'front' ? [{ scaleX: -1 }] : []
  }
});
