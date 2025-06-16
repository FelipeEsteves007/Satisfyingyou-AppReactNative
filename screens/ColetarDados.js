import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../src/firebase/config';

export default function ColetarDados({ navigation }) {
  const opcoes = [
    { rotulo: 'pessimo', icone: 'sentiment-very-dissatisfied', cor: '#FF0000' },
    { rotulo: 'ruim', icone: 'sentiment-dissatisfied', cor: '#FF4500' },
    { rotulo: 'neutro', icone: 'sentiment-neutral', cor: '#FFD700' },
    { rotulo: 'bom', icone: 'sentiment-satisfied', cor: '#00CC66' },
    { rotulo: 'excelente', icone: 'sentiment-very-satisfied', cor: '#00FF00' },
  ];

  const enviarAvaliacao = async (avaliacao) => {
    try {
      await addDoc(collection(db, 'avaliacoes'), {
        avaliacao: avaliacao,
        criadaEm: new Date(),
      });
      navigation.navigate('Agradecimento');
    } catch (error) {
      console.log('Erro ao salvar avaliação:', error);
      Alert.alert('Erro', 'Não foi possível registrar sua avaliação.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pergunta}>O que você achou da pesquisa?</Text>

      <View style={styles.linhaEmojis}>
        {opcoes.map((opcao, index) => (
          <View style={styles.item} key={index}>
            <TouchableOpacity onPress={() => enviarAvaliacao(opcao.rotulo)}>
              <Icon name={opcao.icone} size={60} color={opcao.cor} />
            </TouchableOpacity>
            <Text style={styles.rotulo}>{opcao.rotulo.toUpperCase()}</Text>
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
