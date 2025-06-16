import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import PieChart from 'react-native-pie-chart';

export default function Relatorio() {
  const largura = Dimensions.get('window').width * 0.6;

  const series = [
    { value: 5, color: '#00FF00' },
    { value: 3, color: '#00CC66' },
    { value: 2, color: '#FFD700' },
    { value: 1, color: '#FF4500' },
    { value: 4, color: '#FF0000' },
  ];

  const total = series.reduce((acc, s) => acc + s.value, 0);

  const rotulos = ['Excelente', 'Bom', 'Neutro', 'Ruim', 'Péssimo'];

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Relatório de Satisfação</Text>

      <PieChart
        widthAndHeight={largura}
        series={series}
        donut
        coverRadius={0.45}
        coverFill={'#402477'}
      />

      <View style={styles.legenda}>
        {series.map((item, i) => (
          <View key={i} style={styles.itemLegenda}>
            <View style={[styles.cor, { backgroundColor: item.color }]} />
            <Text style={styles.textoLegenda}>
              {rotulos[i]} - {item.value} voto(s) ({((item.value / total) * 100).toFixed(1)}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#402477', alignItems: 'center', padding: 20 },
  titulo: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'AveriaLibre-Regular',
    marginVertical: 15,
  },
  legenda: { marginTop: 30, width: '100%' },
  itemLegenda: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cor: { width: 15, height: 15, borderRadius: 4, marginRight: 10 },
  textoLegenda: { color: 'white', fontSize: 16, fontFamily: 'AveriaLibre-Regular' },
});
