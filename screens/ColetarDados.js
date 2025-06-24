import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';
import { adicionarAvaliacao } from '../src/Redux/AvaliacaoSlice';

export default function ColetarDados({ navigation }) {
  const dispatch = useDispatch();

  const opcoes = [
    { rotulo: 'pessimo', icone: 'sentiment-very-dissatisfied', cor: '#FF0000' },
    { rotulo: 'ruim', icone: 'sentiment-dissatisfied', cor: '#FF4500' },
    { rotulo: 'neutro', icone: 'sentiment-neutral', cor: '#FFD700' },
    { rotulo: 'bom', icone: 'sentiment-satisfied', cor: '#00CC66' },
    { rotulo: 'excelente', icone: 'sentiment-very-satisfied', cor: '#00FF00' },
  ];

  const enviar = (avaliacao) => {
    dispatch(adicionarAvaliacao(avaliacao));
    navigation.navigate('Agradecimento');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pergunta}>O que você achou da pesquisa?</Text>
      <View style={styles.linha}>
        {opcoes.map((opcao, i) => (
          <TouchableOpacity key={i} onPress={() => enviar(opcao.rotulo)}>
            <Icon name={opcao.icone} size={60} color={opcao.cor} />
            <Text style={styles.label}>{opcao.rotulo.toUpperCase()}</Text>
          </TouchableOpacity>
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
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  label: {
    textAlign: 'center',
    color: 'white',
    marginTop: 6,
    fontFamily: 'AveriaLibre-Regular',
  },
});
