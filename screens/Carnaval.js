import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'; 
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Carnaval({ route, navigation }) {
  const { id, nome, data } = route.params || {}; 

  return (
    <View style={styles.container}>
      {/* Cabeçalho com botão voltar e nome da pesquisa */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.voltar}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>{nome || 'Carnaval'}</Text>
      </View>

      {/* Botões centrais */}
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.botaoQuadrado}
          onPress={() =>
            navigation.navigate('ModificarPesquisa', {
              id: id,
              nome: nome,
              data: data
            })
          }
        >
          <MCIcon name="file-document-edit-outline" size={60} color="#FFF" />
          <Text style={styles.textoBotao}>Modificar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoQuadrado}
          onPress={() => navigation.navigate('ColetarDados')}
        >
          <MCIcon name="checkbox-marked-outline" size={60} color="#FFF" />
          <Text style={styles.textoBotao}>Coletar dados</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoQuadrado}
          onPress={() => navigation.navigate('Relatorio')}
        >
          <Icon name="donut-large" size={60} color="#FFF" />
          <Text style={styles.textoBotao}>Relatório</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');
const buttonSize = width * 0.25;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#402477',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2B1B6B',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  voltar: {
    color: 'white',
    fontSize: 30,
    marginRight: 15,
    fontFamily: 'AveriaLibre-Regular',
  },
  titulo: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'AveriaLibre-Regular',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 10,
  },
  botaoQuadrado: {
    backgroundColor: '#2F1D5B',
    width: buttonSize,
    height: buttonSize + 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    padding: 10,
  },
  textoBotao: {
    color: 'white',
    fontFamily: 'AveriaLibre-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
});
