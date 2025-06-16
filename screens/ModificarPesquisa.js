import React, { useState, useEffect } from 'react';
import {View, Text, TextInput, TouchableOpacity,StyleSheet, Alert, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../src/firebase/config';
import { launchImageLibrary } from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';

export default function ModificarPesquisa({ route, navigation }) {
  const { id, nome, data, imagemUrl } = route.params || {};

  const [novoNome, setNovoNome] = useState('');
  const [novaData, setNovaData] = useState('');
  const [novaImagemBase64, setNovaImagemBase64] = useState(imagemUrl || '');
  const [erroNome, setErroNome] = useState('');
  const [erroData, setErroData] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);

  useEffect(() => {
    setNovoNome(nome || '');
    setNovaData(data || '');
  }, [nome, data]);

  const escolherImagem = () => {
    launchImageLibrary(
      { mediaType: 'photo', includeBase64: true },
      async (response) => {
        if (!response.didCancel && response.assets && response.assets[0]) {
          const img = response.assets[0];
          const resized = await ImageResizer.createResizedImage(
            img.uri,
            300,
            300,
            'JPEG',
            80
          );

          const base64 = `data:image/jpeg;base64,${img.base64}`;
          setNovaImagemBase64(base64);
        }
      }
    );
  };

  const validar = () => {
    let valido = true;
    if (novoNome.trim() === '') {
      setErroNome('Preencha o nome da pesquisa');
      valido = false;
    } else {
      setErroNome('');
    }
    if (novaData.trim() === '') {
      setErroData('Preencha a data');
      valido = false;
    } else {
      setErroData('');
    }

    if (!valido) return;

    const pesquisaRef = doc(db, 'pesquisas', id);
    updateDoc(pesquisaRef, {
      titulo: novoNome,
      data: novaData,
      imagemUrl: novaImagemBase64,
    })
      .then(() => {
        Alert.alert('Sucesso', 'Pesquisa atualizada!');
        navigation.navigate('Drawer', { screen: 'Home' });
      })
      .catch((error) => {
        console.log('Erro ao atualizar:', error);
        Alert.alert('Erro', 'Não foi possível atualizar.');
      });
  };

  const excluirPesquisa = () => {
    const ref = doc(db, 'pesquisas', id);
    deleteDoc(ref)
      .then(() => {
        Alert.alert('Sucesso', 'Pesquisa excluída!');
        setModalVisivel(false);
        navigation.navigate('Drawer', { screen: 'Home' });
      })
      .catch((error) => {
        console.log('Erro ao excluir:', error);
        Alert.alert('Erro', 'Não foi possível excluir.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={novoNome}
        onChangeText={setNovoNome}
        placeholder="Digite o nome"
        placeholderTextColor="#aaa"
      />
      {erroNome !== '' && <Text style={styles.erro}>{erroNome}</Text>}

      <Text style={styles.label}>Data</Text>
      <View style={styles.inputComIcone}>
        <TextInput
          style={styles.inputInterno}
          value={novaData}
          onChangeText={setNovaData}
          placeholder="DD/MM/AAAA"
          placeholderTextColor="#aaa"
        />
        <Icon name="calendar-month" size={25} color="gray" />
      </View>
      {erroData !== '' && <Text style={styles.erro}>{erroData}</Text>}

      <Text style={styles.label}>Imagem</Text>
      <TouchableOpacity style={styles.boxImagem} onPress={escolherImagem}>
        {novaImagemBase64 ? (
          <Image
            source={{ uri: novaImagemBase64 }}
            style={{ width: 80, height: 80, borderRadius: 4 }}
          />
        ) : (
          <Icon name="add-photo-alternate" size={40} color="#C57ED3" />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoVerde} onPress={validar}>
        <Text style={styles.textoBotao}>SALVAR</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoLixeira} onPress={() => setModalVisivel(true)}>
        <Icon name="delete" size={24} color="white" />
        <Text style={styles.textoLixeira}>Apagar</Text>
      </TouchableOpacity>

      {modalVisivel && (
        <View style={styles.modalFundo}>
          <View style={styles.modalCaixa}>
            <Text style={styles.modalTexto}>Tem certeza de apagar essa pesquisa?</Text>
            <View style={styles.modalBotoes}>
              <TouchableOpacity style={styles.botaoSim} onPress={excluirPesquisa}>
                <Text style={styles.modalTextoBotao}>SIM</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.botaoCancelar} onPress={() => setModalVisivel(false)}>
                <Text style={styles.modalTextoBotao}>CANCELAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // mesmo CSS anterior...
  container: { flex: 1, backgroundColor: '#402477', padding: 20, paddingTop: 50 },
  label: { color: 'white', fontSize: 16, fontFamily: 'AveriaLibre-Regular', marginTop: 20 },
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
  inputComIcone: {
    backgroundColor: 'white',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    marginTop: 5,
    paddingHorizontal: 10,
  },
  inputInterno: { flex: 1, fontSize: 16, fontFamily: 'AveriaLibre-Regular', color: '#3F92C5' },
  erro: { color: '#FD7979', fontSize: 14, fontFamily: 'AveriaLibre-Regular', marginTop: 5 },
  boxImagem: {
    backgroundColor: 'white',
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    borderRadius: 4,
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
  botaoLixeira: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
  },
  textoLixeira: {
    color: 'white',
    fontFamily: 'AveriaLibre-Regular',
    marginTop: 2,
    fontSize: 14,
  },
  modalFundo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCaixa: {
    backgroundColor: '#2F1D5B',
    padding: 30,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  modalTexto: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'AveriaLibre-Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalBotoes: {
    flexDirection: 'row',
    gap: 15,
  },
  botaoSim: {
    backgroundColor: '#FD7979',
    paddingVertical: 15,
    paddingHorizontal: 45,
    borderRadius: 6,
  },
  botaoCancelar: {
    backgroundColor: '#419ED7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  modalTextoBotao: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'AveriaLibre-Regular',
  },
});
