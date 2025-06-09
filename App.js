import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from './screens/Login';
import NovaConta from './screens/NovaConta';
import RecuperarSenha from './screens/RecuperarSenha';
import DrawerNavigator from './navigation/DrawerNavigator';
import NovaPesquisa from './screens/NovaPesquisa';
import ModificarPesquisa from './screens/ModificarPesquisa';
import Relatorio from './screens/Relatorio';
import ColetarDados from './screens/ColetarDados';
import Agradecimento from './screens/Agradecimento';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Telas de entrada */}
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NovaConta"
          component={NovaConta}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RecuperarSenha"
          component={RecuperarSenha}
          options={{ headerShown: false }}
        />

        {/* Navegação principal por Drawer */}
        <Stack.Screen
          name="Drawer"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />

        {/* Telas adicionais acessadas diretamente */}
        <Stack.Screen
          name="NovaPesquisa"
          component={NovaPesquisa}
          options={{
            title: 'Nova pesquisa',
            headerStyle: { backgroundColor: '#2B1B6B' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontFamily: 'AveriaLibre-Regular',
              fontSize: 24,
            },
          }}
        />
        <Stack.Screen
          name="ModificarPesquisa"
          component={ModificarPesquisa}
          options={{
            title: 'Modificar pesquisa',
            headerStyle: { backgroundColor: '#2B1B6B' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
              fontFamily: 'AveriaLibre-Regular',
              fontSize: 24,
            },
          }}
        />
        <Stack.Screen
          name="Relatorio"
          component={Relatorio}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ColetarDados"
          component={ColetarDados}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Agradecimento"
          component={Agradecimento}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
