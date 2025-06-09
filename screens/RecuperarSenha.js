import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../src/firebase/config';

export default function RecuperarSenha({ navigation }) {
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');

const recuperarSenha = () => {
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!emailValido) {
    setErro('E-mail parece ser inválido');
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      setErro('');
      alert('Instruções de recuperação de senha enviadas!');
      navigation.navigate('Login');
    })
    .catch((error) => {
      console.log('Erro ao enviar e-mail de recuperação:', error);
      setErro('Erro ao enviar e-mail. Verifique se o e-mail está correto.');
    });
};

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Recuperação de senha</Text>

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={[styles.input, { color: '#3F92C5' }]}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

      <TouchableOpacity style={styles.botaoVerde} onPress={recuperarSenha}>
        <Text style={styles.textoBotao}>RECUPERAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#402477',
    padding: 30,
    justifyContent: 'center',
  },
  titulo: {
    fontFamily: 'AveriaLibre-Regular',
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
  },
  label: {
    fontFamily: 'AveriaLibre-Regular',
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    height: 50,
    fontSize: 18,
    fontFamily: 'AveriaLibre-Regular',
  },
  erro: {
    fontFamily: 'AveriaLibre-Regular',
    color: '#FD7979',
    fontSize: 16,
    marginBottom: 10,
  },
  botaoVerde: {
    backgroundColor: '#37BD6D',
    height: 50,
    justifyContent: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  textoBotao: {
    fontFamily: 'AveriaLibre-Regular',
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
  textoCinza: {
    fontFamily: 'AveriaLibre-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
  },
});
