import React from 'react';
import { Modal, ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default Loader = () => {
    return(
        <Modal transparent>
            <SafeAreaView style={styles.blurOverlay}>
                <View style={styles.container}>
                    <ActivityIndicator size={80} color="#fff" style={styles.loader} />
                    <Text style={styles.text}>Processing</Text>
                </View>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loader: {
        marginBottom: 20, // Add some space between loader and text
    },
    blurOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional dark overlay
    },
    text: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});