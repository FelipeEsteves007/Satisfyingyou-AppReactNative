import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../screens/Home';
import Carnaval from '../screens/Carnaval';
import CustomDrawer from '../components/CustomDrawer';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator({ route }) {
  const email = route?.params?.email || 'usuario@dominio.com';

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: 'white',
        drawerContentStyle: { backgroundColor: '#2B1B6B' },
      }}
      drawerContent={(props) => <CustomDrawer {...props} email={email} />}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{
          drawerLabel: 'Pesquisas',
          headerTitle: '', // Oculta o título "Home"
          headerStyle: {
            backgroundColor: '#2B1B6B', // Fundo roxo escuro no header
          },
          headerTintColor: '#FFFFFF', // Ícone do menu branco
        }}
      />

      <Drawer.Screen
        name="Carnaval"
        component={Carnaval}
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: false, // Header personalizado na própria tela
        }}
      />
    </Drawer.Navigator>
  );
}
