import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function CardPesquisa({ imagem, nome, data, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={imagem} style={styles.icon} />
      <Text style={styles.titulo}>{nome}</Text>
      <Text style={styles.data}>{data}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    width: 100,
    height: 130
  },
  icon: {
    width: 50,
    height: 60,
  },
  titulo: {
    fontFamily: 'AveriaLibre-Regular',
    color: '#3F92C5',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  data: {
    fontFamily: 'AveriaLibre-Regular',
    color: '#888',
    fontSize: 10.5,
    textAlign: 'center',
    marginTop: 2,
  },
});
