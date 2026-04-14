import 'react-native-gesture-handler' 
import { NavigationContainer } from '@react-navigation/native';

import {createStackNavigator} from '@react-navigation/stack'

import InicioScreen from './src/Screens/InicioScreen';

const PilhaTelas = createStackNavigator()

export default function App() {
  return (
   <NavigationContainer>

    <PilhaTelas.Navigator initialRouteName="InicioScreen">
      <PilhaTelas.Screen name="InicioScreen" component={InicioScreen} options={{headerShown: false}} />
      
    </PilhaTelas.Navigator>

   </NavigationContainer>
  );
}