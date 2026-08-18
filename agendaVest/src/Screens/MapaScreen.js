import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MapaScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mapa</Text>
            <Text>Localize os locais de prova.</Text>
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