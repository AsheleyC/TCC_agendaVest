import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ImageBackground } from 'react-native';

import { useNavigation } from '@react-navigation/native';

export default function App() {

    return (
        <ImageBackground source={require("../../assets/fundo1.jpg")} resizeMode="cover" style={styles.container}>

            

        </ImageBackground >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
        marginTop: 40,
    },
    
});
