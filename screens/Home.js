import React, { useState, useEffect } from 'react';
import {View,TextInput,TouchableOpacity, Text,  StyleSheet,FlatList,} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CardPesquisa from '../components/CardPesquisa';
import { db } from '../src/firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';

export default function Home({ navigation }) {
  const [termo, setTermo] = useState('');
  const [pesquisas, setPesquisas] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'pesquisas'), (snapshot) => {
      const dados = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPesquisas(dados);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = ({ item }) => {
    if (!item.titulo?.toLowerCase().includes(termo.toLowerCase())) return null;

    return (
      <CardPesquisa
        imagem={item.imagemUrl} 
        nome={item.titulo}
        data={item.dataPesquisa}
        onPress={() =>
          navigation.navigate('Carnaval', {
            id: item.id,
            nome: item.titulo,
            data: item.dataPesquisa,
            imagemUrl: item.imagemUrl
          })
        }
      />

    );
  };

  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <View style={styles.searchBar}>
        <Icon name="search" size={30} color="gray" />
        <TextInput
          style={styles.searchInput}
          placeholder="Insira o termo de busca..."
          placeholderTextColor="#aaa"
          value={termo}
          onChangeText={setTermo}
        />
      </View>

      {/* Lista horizontal de pesquisas */}
      <FlatList
        data={pesquisas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        contentContainerStyle={styles.iconsContainer}
        ListEmptyComponent={
          <Text style={{ color: 'white', marginTop: 20 }}>
            Nenhuma pesquisa cadastrada ainda.
          </Text>
        }
      />

      {/* Botão de nova pesquisa */}
      <TouchableOpacity
        style={styles.novaPesquisaButton}
        onPress={() => navigation.navigate('NovaPesquisa')}
      >
        <Text style={styles.textoBotao}>NOVA PESQUISA</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#402477',
    padding: 30,
    paddingTop: 150,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 20,
    marginBottom: 30,
    height: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'AveriaLibre-Regular',
    color: '#000',
  },
  iconsContainer: {
    gap: 20,
    marginBottom: 20,
    paddingRight: 20,
  },
  novaPesquisaButton: {
    backgroundColor: '#37BD6D',
    height: 50,
    justifyContent: 'center',
    borderRadius: 8,
  },
  textoBotao: {
    fontFamily: 'AveriaLibre-Regular',
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
});
