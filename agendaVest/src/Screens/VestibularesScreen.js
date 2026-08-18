import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function VestibularesScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vestibulares</Text>
            <Text>Encontre os principais vestibulares.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8EFF8',
        alignItems: 'center',
        justifyContent: 'center',
    },

    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#285E73',
    },
});