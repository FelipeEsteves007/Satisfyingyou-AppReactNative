import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useSelector } from 'react-redux';

export default function Relatorio() {
  const votos = useSelector((state) => state.avaliacao.votos);
  const largura = Dimensions.get('window').width - 40;

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
  const chaves = ['excelente', 'bom', 'neutro', 'ruim', 'pessimo'];
  const rotulos = ['Excelente', 'Bom', 'Neutro', 'Ruim', 'Péssimo'];

  const dados = chaves.map((chave, i) => ({
    name: rotulos[i],
    population: contagem[chave],
    color: cores[i],
    legendFontColor: '#FFFFFF',
    legendFontSize: 15,
  })).filter((d) => d.population > 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>Relatório de Satisfação</Text>

      {dados.length > 0 ? (
        <PieChart
          data={dados}
          width={largura}
          height={220}
          accessor={'population'}
          backgroundColor={'transparent'}
          paddingLeft={'15'}
          chartConfig={{
            color: () => `#FFF`,
            labelColor: () => '#FFF',
          }}
          hasLegend={true}
          center={[10, 0]}
        />
      ) : (
        <Text style={styles.semDados}>Nenhuma avaliação registrada ainda.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#402477',
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'AveriaLibre-Regular',
    textAlign: 'center',
    marginVertical: 15,
  },
  semDados: {
    color: '#ccc',
    fontSize: 16,
    marginTop: 40,
    fontFamily: 'AveriaLibre-Regular',
    textAlign: 'center',
  },
});
