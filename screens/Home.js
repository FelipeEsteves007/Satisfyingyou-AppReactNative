import React, { useState } from 'react';
import { View,Text,TextInput,TouchableOpacity,StyleSheet,Image,} from 'react-native';
import CardPesquisa from '../components/CardPesquisa'; 
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Home({ navigation }) {
  const [termo, setTermo] = useState('');

  return (
    <View style={styles.container}>
      {/* Barra de busca com ícone */}
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

      {/* Cards com pesquisas */}
      <View style={styles.iconsContainer}>
        <CardPesquisa
          imagem={require('../assets/emojis/pc.png')}
          nome="SECOMP 2023"
          data="10/10/2023"
          onPress={() =>
            navigation.navigate('Carnaval', {
              nome: 'SECOMP 2023',
              data: '10/10/2023',
            })
          }
        />
        <CardPesquisa
          imagem={require('../assets/emojis/group.png')}
          nome="UBUNTU 2022"
          data="05/06/2022"
          onPress={() =>
            navigation.navigate('Carnaval', {
              nome: 'UBUNTU 2022',
              data: '05/06/2022',
            })
          }
        />
        <CardPesquisa
          imagem={require('../assets/emojis/woman.png')}
          nome="MENINAS CPU"
          data="01/04/2022"
          onPress={() =>
            navigation.navigate('Carnaval', {
              nome: 'MENINAS CPU',
              data: '01/04/2022',
            })
          }
        />
      </View>

      {/* Botão nova pesquisa */}
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
  searchIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'AveriaLibre-Regular',
    color: '#000',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
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
