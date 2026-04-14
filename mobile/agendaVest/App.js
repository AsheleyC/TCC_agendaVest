import 'react-native-gesture-handler' 
import { NavigationContainer } from '@react-navigation/native';

import {createStackNavigator} from '@react-navigation/stack'

import InicioScreen from './src/Screens/InicioScreen';
import LoginScreen from './src/Screens/LoginScreen';
import CadastroScreen from './src/Screens/CadastroScreen';
import HomeScreen from './src/Screens/HomeScreen';
import SenhaScreen from './src/Screens/SenhaScreen';

const PilhaTelas = createStackNavigator()

export default function App() {
  return (
   <NavigationContainer>

    <PilhaTelas.Navigator initialRouteName="InicioScreen">
      <PilhaTelas.Screen name="InicioScreen" component={InicioScreen} options={{headerShown: false}} />
      <PilhaTelas.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}} />
      <PilhaTelas.Screen name="CadastroScreen" component={CadastroScreen} options={{headerShown: false}} />
      <PilhaTelas.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}} />
      <PilhaTelas.Screen name="SenhaScreen" component={SenhaScreen} options={{headerShown: false}} />
     
    </PilhaTelas.Navigator>

   </NavigationContainer>
  );
}