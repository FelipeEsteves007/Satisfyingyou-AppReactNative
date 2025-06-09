import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

export default function Relatorio({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header com seta e título */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.voltar}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Relatório</Text>
      </View>

      {/* Conteúdo: emoji + legenda */}
      <View style={styles.content}>
        <Image
          source={require('../assets/emojis/grafico.png')}
          style={styles.emoji}
        />

        <View style={styles.legenda}>
          <View style={styles.itemLegenda}>
            <View style={[styles.cor, { backgroundColor: '#F4D35E' }]} />
            <Text style={styles.textoLegenda}>Excelente</Text>
          </View>
          <View style={styles.itemLegenda}>
            <View style={[styles.cor, { backgroundColor: '#729FE1' }]} />
            <Text style={styles.textoLegenda}>Bom</Text>
          </View>
          <View style={styles.itemLegenda}>
            <View style={[styles.cor, { backgroundColor: '#60CFA1' }]} />
            <Text style={styles.textoLegenda}>Neutro</Text>
          </View>
          <View style={styles.itemLegenda}>
            <View style={[styles.cor, { backgroundColor: '#E3719C' }]} />
            <Text style={styles.textoLegenda}>Ruim</Text>
          </View>
          <View style={styles.itemLegenda}>
            <View style={[styles.cor, { backgroundColor: '#45D4D4' }]} />
            <Text style={styles.textoLegenda}>Péssimo</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#402477',
  },
  header: {
    backgroundColor: '#2B1B6B',
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    width: 180,
    height: 180,
    marginRight: 40,
  },
  legenda: {
    justifyContent: 'center',
  },
  itemLegenda: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  textoLegenda: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'AveriaLibre-Regular',
  },
});
