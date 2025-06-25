import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Agradecimento({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('ColetarDados');
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>Obrigado por participar da pesquisa!</Text>
      <Text style={styles.texto}>Aguardamos você no próximo ano!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#402477',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  texto: {
    color: 'white',
    fontSize: 22,
    fontFamily: 'AveriaLibre-Regular',
    textAlign: 'center',
    marginBottom: 20,
  },
});
