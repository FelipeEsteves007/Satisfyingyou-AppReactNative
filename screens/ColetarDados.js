import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Ícones do Google

export default function ColetarDados({ navigation }) {
  const handleResposta = () => {
    navigation.navigate('Agradecimento');
  };

  const opcoes = [
    { rotulo: 'Péssimo', icone: 'sentiment-very-dissatisfied', cor: '#FF0000' },
    { rotulo: 'Ruim', icone: 'sentiment-dissatisfied', cor: '#FF4500' },
    { rotulo: 'Neutro', icone: 'sentiment-neutral', cor: '#FFD700' },
    { rotulo: 'Bom', icone: 'sentiment-satisfied', cor: '#00CC66' },
    { rotulo: 'Excelente', icone: 'sentiment-very-satisfied', cor: '#00FF00' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.pergunta}>O que você achou do Carnaval 2024?</Text>

      <View style={styles.linhaEmojis}>
        {opcoes.map((opcao, index) => (
          <View style={styles.item} key={index}>
            <TouchableOpacity onPress={handleResposta}>
              <Icon name={opcao.icone} size={60} color={opcao.cor} />
            </TouchableOpacity>
            <Text style={styles.rotulo}>{opcao.rotulo}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#402477',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  pergunta: {
    color: 'white',
    fontSize: 22,
    fontFamily: 'AveriaLibre-Regular',
    marginBottom: 40,
    textAlign: 'center',
  },
  linhaEmojis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
  },
  item: {
    alignItems: 'center',
    marginHorizontal: 6,
  },
  rotulo: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'AveriaLibre-Regular',
    marginTop: 6,
  },
});
