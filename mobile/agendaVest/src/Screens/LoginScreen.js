import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ImageBackground } from 'react-native';

import { useNavigation } from '@react-navigation/native';

export default function App() {

    return (
        <ImageBackground source={require("../../assets/fundo1.jpg")} resizeMode="cover" style={styles.container}>

            <View style={styles.topContainer}>
                <View style={styles.imagem} />
            </View>

            <View style={styles.bottomContainer}>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>E-MAIL</Text>
                    <TextInput style={styles.input} />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>SENHA</Text>
                    <TextInput style={styles.input} secureTextEntry />
                </View>

                <Text style={styles.forgot}>Esqueceu a senha?</Text>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>

            </View>

        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-evenly',
      alignItems: 'center',
      paddingVertical: 60,
    },
  
    topContainer: {
      alignItems: 'center',
      marginTop: 40,
    },
  
    imagem: {
      width: 150,
      height: 150,
      borderRadius: 100,
      backgroundColor: '#5f7f95',
    },
  
    bottomContainer: {
      width: '80%',
    },
  
    inputGroup: {
      marginBottom: 25,
    },
  
    label: {
      color: '#3b5b7a',
      fontSize: 14,
      marginBottom: 5,
      fontWeight: '500',
    },
  
    input: {
      borderBottomWidth: 2,
      borderBottomColor: '#8fb3c9',
      paddingVertical: 5,
      fontSize: 16,
      color: '#2c3e50',
    },
  
    forgot: {
      alignSelf: 'flex-end',
      color: '#3b5b7a',
      fontSize: 12,
      marginTop: -10,
      marginBottom: 30,
      textDecorationLine: 'underline',
    },
  
    button: {
      width: '60%',
      alignSelf: 'center',
      backgroundColor: 'rgba(200, 210, 220, 0.7)',
      paddingVertical: 12,
      borderRadius: 25,
      alignItems: 'center',
    },
  
    buttonText: {
      color: '#3b5b7a',
      fontSize: 16,
      fontWeight: 'bold',
      letterSpacing: 1,
    },
  });