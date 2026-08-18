import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function InscricoesScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Minhas Inscrições</Text>
            <Text>Acompanhe suas inscrições.</Text>
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