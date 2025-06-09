import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { auth } from '../src/firebase/config';
import { createUserWithEmailAndPassword } from 'firebase/auth'; 


const NovaConta = ({navigation}) => {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [repetirSenha, setRepetirSenha] = useState('');
  const [erro, setErro] = useState('');

  const validarCadastro = () => {
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!emailValido) {
      setErro('E-mail inválido.');
      return;
    }

    if (senha !== repetirSenha) {
      setErro('O campo repetir senha difere da senha.');
      return;
    }
    createUserWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        setErro('');
        console.log('Usuário criado:', JSON.stringify(userCredential));
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.log('Erro ao criar conta:', JSON.stringify(error));
        setErro('Erro ao criar conta. Verifique os dados.');
      })
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.voltar}>←</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Nova Conta</Text>

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        style={[styles.input, { color: '#3F92C5' }]}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={[styles.input, { color: '#3F92C5' }]}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Text style={styles.label}>Repetir senha</Text>
      <TextInput
        style={[styles.input, { color: '#3F92C5' }]}
        value={repetirSenha}
        onChangeText={setRepetirSenha}
        secureTextEntry
      />

      {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

      <TouchableOpacity style={styles.botaoVerde} onPress={validarCadastro}>
        <Text style={styles.textoBotao}>CADASTRAR</Text>
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
  voltar: {
    fontFamily: 'AveriaLibre-Regular',
    fontSize: 30,
    color: 'white',
    marginBottom: 30,
  },
  titulo: {
    fontFamily: 'AveriaLibre-Regular',
    fontSize: 28,
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
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
    fontSize: 24,
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
});
export default NovaConta