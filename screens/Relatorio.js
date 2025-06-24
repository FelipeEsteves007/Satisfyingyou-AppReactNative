import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { useSelector } from 'react-redux';

export default function Relatorio() {
  const votos = useSelector((state) => state.avaliacao.votos);
  const largura = Dimensions.get('window').width;

  const contagem = {
    excelente: 0,
    bom: 0,
    neutro: 0,
    ruim: 0,
    pessimo: 0,
  };

  votos.forEach((v) => {
    if (contagem[v.avaliacao] !== undefined) {
      contagem[v.avaliacao]++;
    }
  });

  const cores = ['#00FF00', '#00CC66', '#FFD700', '#FF4500', '#FF0000'];
  const rotulos = ['Excelente', 'Bom', 'Neutro', 'Ruim', 'Péssimo'];
  const chaves = ['excelente', 'bom', 'neutro', 'ruim', 'pessimo'];

  const pieData = chaves
    .map((chave, i) => ({
      value: contagem[chave],
      svg: {
        fill: cores[i],
        onPress: () => console.log(`Clicou em ${rotulos[i]}`),
      },
      key: `pie-${i}`,
    }))
    .filter((item) => item.value > 0);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Relatório de Satisfação</Text>

      {pieData.length > 0 ? (
        <>
          <PieChart style={{ height: 220, width: largura * 0.9 }} data={pieData} />

          {/* Legenda personalizada */}
          <View style={styles.legenda}>
            {pieData.map((item, index) => (
              <View key={index} style={styles.itemLegenda}>
                <View style={[styles.cor, { backgroundColor: item.svg.fill }]} />
                <Text style={styles.textoLegenda}>
                  {rotulos[index]} - {item.value} voto(s)
                </Text>
              </View>
            ))}
          </View>
        </>
      ) : (
        <Text style={styles.semDados}>Nenhuma avaliação registrada ainda.</Text>
      )}
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#402477',
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'AveriaLibre-Regular',
    marginVertical: 15,
  },
  semDados: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 40,
    fontFamily: 'AveriaLibre-Regular',
    textAlign: 'center',
  },
  legenda: {
     marginTop: 30, 
     width: '100%' 
  },
  itemLegenda: 
  { flexDirection: 'row', alignItems: 
   'center', marginBottom: 10 
  },
  cor: { 
    width: 15, 
    height: 15, 
    borderRadius: 4, 
    marginRight: 10 
  },
  textoLegenda: { 
    color: 'white', 
    fontSize: 16,
    fontFamily: 'AveriaLibre-Regular' 
  },
});
