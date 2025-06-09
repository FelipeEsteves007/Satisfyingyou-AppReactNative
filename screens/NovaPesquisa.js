import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../src/firebase/config';

export default function NovaPesquisa({ navigation }) {
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [erroNome, setErroNome] = useState('');
  const [erroData, setErroData] = useState('');

  const salvarPesquisa = () => {
    let valid = true;

    if (nome.trim() === '') {
      setErroNome('Preencha o nome da pesquisa');
      valid = false;
    } else {
      setErroNome('');
    }

    if (data.trim() === '') {
      setErroData('Preencha a data');
      valid = false;
    } else {
      setErroData('');
    }

    if (!valid) return;

    const docPesquisa = {
      titulo: nome,
      dataPesquisa: data,
      usuario: auth.currentUser?.email || 'desconhecido',
      criadaEm: new Date(),
      imagemUrl: '' // deixamos esse campo pronto para uso futuro
    };

    const pesquisasCollection = collection(db, 'pesquisas');

    addDoc(pesquisasCollection, docPesquisa)
      .then((docRef) => {
        console.log('Documento salvo com ID:', docRef.id);
        Alert.alert('Sucesso', 'Pesquisa cadastrada com sucesso!');
        setNome('');
        setData('');
        navigation.goBack();
      })
      .catch((error) => {
        console.log('Erro ao salvar:', error?.message || error);
        Alert.alert('Erro', 'Não foi possível salvar a pesquisa.');
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome"
        placeholderTextColor="#aaa"
      />
      {erroNome !== '' && <Text style={styles.erro}>{erroNome}</Text>}

      <Text style={styles.label}>Data</Text>
      <SafeAreaView style={styles.inputComIcone}>
        <TextInput
          style={styles.inputInterno}
          value={data}
          onChangeText={setData}
          placeholder="DD/MM/AAAA"
          placeholderTextColor="#aaa"
        />
        <Icon name="calendar-month" size={35} color="gray" />
      </SafeAreaView>
      {erroData !== '' && <Text style={styles.erro}>{erroData}</Text>}

      <Text style={styles.label}>Imagem</Text>
      <TouchableOpacity style={styles.boxImagem}>
        <Text style={styles.textoImagem}>Câmera/Galeria de imagens (futuramente)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoVerde} onPress={salvarPesquisa}>
        <Text style={styles.textoBotao}>CADASTRAR</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#402477',
    padding: 20,
  },
  label: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'AveriaLibre-Regular',
    marginTop: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 4,
    paddingHorizontal: 10,
    height: 45,
    fontSize: 16,
    fontFamily: 'AveriaLibre-Regular',
    marginTop: 5,
    color: '#3F92C5',
  },
  erro: {
    color: '#FD7979',
    fontSize: 14,
    marginTop: 4,
    fontFamily: 'AveriaLibre-Regular',
  },
  inputComIcone: {
    backgroundColor: 'white',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    marginTop: 5,
    paddingHorizontal: 10,
  },
  inputInterno: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'AveriaLibre-Regular',
    color: '#000',
  },
  boxImagem: {
    backgroundColor: 'white',
    height: 90,
    justifyContent: 'center',
    paddingLeft: 10,
    marginTop: 5,
    borderRadius: 4,
  },
  textoImagem: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'AveriaLibre-Regular',
  },
  botaoVerde: {
    backgroundColor: '#37BD6D',
    height: 50,
    justifyContent: 'center',
    borderRadius: 4,
    marginTop: 40,
  },
  textoBotao: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'AveriaLibre-Regular',
    textAlign: 'center',
  },
});
