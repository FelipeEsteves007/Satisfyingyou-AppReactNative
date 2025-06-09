import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function CustomDrawer(props) {
  const email = props.email || 'usuario@dominio.com';

  return (
    <View style={styles.wrapper}>
      {/* Conteúdo principal com scroll */}
      <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
        {/* E-mail do usuário no topo */}
        <Text style={styles.email}>{email}</Text>
        <View style={styles.separator} />

        {/* Botão Pesquisas */}
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Home')}
        >
          <Icon name="description" size={20} color="white" />
          <Text style={styles.label}>Pesquisas</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>

      {/* Botão Sair fixado no rodapé */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => props.navigation.navigate('Login')}
        >
          <Icon name="logout" size={20} color="white" />
          <Text style={styles.label}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#2B1B6B',
  },
  container: {
    padding: 20,
  },
  email: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'AveriaLibre-Regular',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: 'white',
    marginVertical: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    width: 24,
    height: 24,
    marginRight: 15,
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'AveriaLibre-Regular',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'white',
    padding: 20,
  },
});
