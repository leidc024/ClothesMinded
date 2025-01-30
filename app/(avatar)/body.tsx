import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

export default function App() {
    const [facing, setFacing] = useState<CameraType>('back'); // Use the front camera by default
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }



    return (
        <View style={styles.container}>
            <View style={styles.cameraContainer}>
                <CameraView style={styles.camera} facing={facing}>
                    {/* Overlay or additional features inside the camera view if needed */}
                </CameraView>
            </View>
            <Text style={styles.instructions}>Scan your body to{"\n"}make your real- {"\n"} life avatar</Text>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/clothes')} activeOpacity={0.7}>
                <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#7F705F', // Updated background color
    },
    cameraContainer: {
        width: '67%', // Adjust width to focus on head only
        aspectRatio: 3 / 4, // Headshot-like aspect ratio
        borderRadius: 20, // Rounded corners
        overflow: 'hidden', // Ensures the camera view fits the rounded shape
        backgroundColor: 'black', // Placeholder background
        marginBottom: 30, // Space for text instructions below
    },
    camera: {
        flex: 1,
    },
    instructions: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
        textAlign: 'center',
        marginBottom: 20, // Space between instructions and the button
    },
    button: {
        backgroundColor: '#6E5846', // Button color
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
});
