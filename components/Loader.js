import React from 'react';
import { Modal, ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';

export default Loader = () => {
    return(
        <Modal transparent>
            <SafeAreaView style={styles.blurOverlay}>
                <ActivityIndicator size={80} color="#fff" style={styles.loader} />
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    loader: {
        position: "absolute",
        top: "40%",
        alignSelf: "center",
    },
    blurOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional dark overlay
    },
});