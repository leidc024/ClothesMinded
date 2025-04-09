import   { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as FaceDetector from "expo-face-detector";
import { useState, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import Loader from '@/components/Loader';
import { router } from 'expo-router';
import { toast } from '@/lib/toast';
import { account } from '@/lib/appwrite';

export default function App() {
    const [facing, setFacing] = useState<CameraType>('front'); // Use the front camera by default
    const[photoUri, setPhotoUri] = useState<string | null>(null);
    const [validPhoto, setValidPhoto] = useState<boolean>(false);
    const cameraRef = useRef<CameraView>(null);
    const [isDisabled, setIsDisabled] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();

    const takePhotoAndDetectFaces = async () => {
        setIsDisabled(true);
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            if (photo && photo.uri) {
                setPhotoUri(photo.uri);
                const faceData = await FaceDetector.detectFacesAsync(photo.uri, {
                    mode: FaceDetector.FaceDetectorMode.fast,
                    detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
                    runClassifications: FaceDetector.FaceDetectorClassifications.all,
                });
                setIsDisabled(false);
                if(faceData.faces.length > 0){
                    setValidPhoto(true);
                    account.updatePrefs({ firstLogin: false, hasAvatar: true }).then(() => {
                        console.log('User preferences updated successfully.');
                    }).catch((error) => {
                        console.error('Failed to update user preferences:', error);
                    });
                }else{
                    setPhotoUri(null)
                    toast('Unable to detect a face. Please retake photo with good lighting.');
                }
            }
        }
    };

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }
    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.permissionContainer}>
                <View style={styles.permissionBox}>
                   
                    <Text style={styles.permissionTitle}> ⚠️ Oops</Text>
                    <Text style={styles.permissionMessage}>
                        We need your permission to access the camera
                    </Text>
                    <TouchableOpacity
                        style={styles.permissionButton}
                        onPress={requestPermission}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.permissionButtonText}>Grant</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            
            {/* Blurred Background & Loader when taking a photo */}

            {isDisabled && (
                <Loader/>
            )}

            { validPhoto && photoUri ? (
                <>
                    <View style={styles.cameraContainer}>
                        <Image source={{ uri: photoUri }} style={ styles.preview }/>
                    </View>
                    <Text style={styles.instructions}>Photo Preview</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.push('./body')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <View style={styles.cameraContainer}>
                        { !photoUri ? (
                            <CameraView
                                style={styles.camera}
                                facing={facing}
                                ref={cameraRef}
                            />
                        ):(
                            <Image source={{ uri: photoUri }} style={ styles.preview }/>
                        )}
                    </View>
                    <Text style={styles.instructions}>Move your {"\n"} head from {"\n"} left to right</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={takePhotoAndDetectFaces}
                        activeOpacity={0.7}
                        disabled={isDisabled}
                    >
                        <Text style={styles.buttonText}>Take photo</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#7F705F', // Light background color
    },
    permissionBox: {
        width: '90%',
        backgroundColor: '#FCF9E8',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    
    permissionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000',
    },
    permissionMessage: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
        marginBottom: 30,
        marginTop:20,
    },
    permissionButton: {
        backgroundColor: '#6E5846', // Button color
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    permissionButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#7F705F', // Updated background color
    },
    cameraContainer: {
        width: '67%',
        aspectRatio: 2 / 2,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'black',
        marginBottom: 60,
       
    },
    camera: {
        flex: 1,
    },
    instructions: {
        fontSize: 30,
        fontWeight: '600',
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#6E5846',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop:5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    preview: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        transform: [{ scaleX: -1 }], // Flips the image horizontally
    },
});
