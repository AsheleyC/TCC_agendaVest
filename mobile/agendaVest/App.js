import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ImageBackground } from 'react-native';


export default function App() { 

  return (
    <ImageBackground source={require("./assets/fundo1.jpg")} resizeMode="cover" style={styles.container}>

      <View >
        
      </View>

      <View>
        <TouchableOpacity>
          <Text>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text>Cadastro</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text>Visitante</Text>
        </TouchableOpacity>

      </View>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
