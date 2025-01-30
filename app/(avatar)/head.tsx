import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

export default function App() {
    const [facing, setFacing] = useState<CameraType>('front'); // Use the front camera by default
    const [permission, requestPermission] = useCameraPermissions();

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
            <View style={styles.cameraContainer}>
                <CameraView style={styles.camera} facing={facing} />
            </View>
            <Text style={styles.instructions}>Move your {"\n"} head from {"\n"} left to right</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('./body')}
                activeOpacity={0.7}
            >
                <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
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
});
