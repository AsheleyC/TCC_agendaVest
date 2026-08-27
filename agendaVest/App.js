import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import InicioScreen from './src/Screens/InicioScreen';
import LoginScreen from './src/Screens/LoginScreen';
import CadastroScreen from './src/Screens/CadastroScreen';
import HomeScreen from './src/Screens/HomeScreen';
import SenhaScreen from './src/Screens/SenhaScreen';
import VestibularesScreen from './src/Screens/VestibularesScreen';
import InscricoesScreen from './src/Screens/InscricoesScreen';
import MapaScreen from './src/Screens/MapaScreen';
import PerfilScreen from './src/Screens/PerfilScreen';
import VestibularDetalhesScreen from './src/Screens/VestibularDetalhesScreen';
import ProvasScreen from './src/Screens/ProvasScreen';

const PilhaTelas = createStackNavigator();
const Abas = createBottomTabNavigator();

function NavegacaoPrincipal() {
  return (
    <Abas.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          backgroundColor: '#2D6B80',
          height: 70,
          paddingTop: 5,
          paddingBottom: 8,
          borderTopWidth: 0,
        },

        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#B8D1DB',

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },

        tabBarIcon: ({ color, size, focused }) => {

          let nomeIcone;

          if (route.name === 'Home') {
            nomeIcone = focused
              ? 'home'
              : 'home-outline';
          }

          else if (route.name === 'Vestibulares') {
            nomeIcone = focused
              ? 'school'
              : 'school-outline';
          }

          else if (route.name === 'Minhas Inscrições') {
            nomeIcone = focused
              ? 'list'
              : 'list-outline';
          }

          else if (route.name === 'Mapa') {
            nomeIcone = focused
              ? 'map'
              : 'map-outline';
          }

          else if (route.name === 'Perfil') {
            nomeIcone = focused
              ? 'person'
              : 'person-outline';
          }

          return (
            <Ionicons
              name={nomeIcone}
              size={size}
              color={color}
            />
          );
        },
      })}
    >

      <Abas.Screen
        name="Home"
        component={HomeScreen}
      />

      <Abas.Screen
        name="Vestibulares"
        component={VestibularesScreen}
      />

      <Abas.Screen
        name="Minhas Inscrições"
        component={InscricoesScreen}
      />

      <Abas.Screen
        name="Mapa"
        component={MapaScreen}
      />

      <Abas.Screen
        name="Perfil"
        component={PerfilScreen}
      />

    </Abas.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>

      <PilhaTelas.Navigator
        initialRouteName="InicioScreen"
      >

        <PilhaTelas.Screen
          name="InicioScreen"
          component={InicioScreen}
          options={{ headerShown: false }}
        />

        <PilhaTelas.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <PilhaTelas.Screen
          name="CadastroScreen"
          component={CadastroScreen}
          options={{ headerShown: false }}
        />

        <PilhaTelas.Screen
          name="HomeScreen"
          component={NavegacaoPrincipal}
          options={{ headerShown: false }}
        />

        <PilhaTelas.Screen
          name="SenhaScreen"
          component={SenhaScreen}
          options={{ headerShown: false }}
        />

        <PilhaTelas.Screen
          name="VestibularDetalhesScreen"
          component={VestibularDetalhesScreen}
          options={{ headerShown: false }}
        />

        <PilhaTelas.Screen
          name="ProvasScreen"
          component={ProvasScreen}
          options={{ headerShown: false }}
        />

      </PilhaTelas.Navigator>

    </NavigationContainer>
  );
}