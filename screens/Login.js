import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/firebase/config';


export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

 const validarLogin = () => {
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!emailValido) {
    setErro('E-mail inválido.');
    return;
  }

  signInWithEmailAndPassword(auth, email, senha)
    .then((userCredential) => {
      setErro('');
      console.log('Login efetuado:', JSON.stringify(userCredential));
      navigation.navigate('Drawer', { email }); // Navega para o Drawer com o e-mail
    })
    .catch((error) => {
      console.log('Erro no login:', error);
      setErro('E-mail e/ou senha inválidos.');
    });
};

  return (
    <View style={styles.container}>
      {/* Título e ícone */}
      <View style={styles.tituloContainer}>
        <Text style={styles.titulo}>Satisfying.you</Text>
        <Icon name="sentiment-satisfied" size={60} color="#FFF" />
      </View>

      {/* Campos de e-mail e senha */}
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

      {/* Mensagem de erro, se houver */}
      {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

      {/* Botão de Login */}
      <TouchableOpacity style={styles.botaoVerde} onPress={validarLogin}>
        <Text style={styles.textoBotao}>Entrar</Text>
      </TouchableOpacity>

      {/* Botão para criar nova conta */}
      <TouchableOpacity style={styles.botaoAzul} onPress={() => navigation.navigate('NovaConta')}>
        <Text style={styles.textoBotao}>Criar minha conta</Text>
      </TouchableOpacity>

      {/* Botão para recuperar senha */}
      <TouchableOpacity style={styles.botaoCinza} onPress={() => navigation.navigate('RecuperarSenha')}>
        <Text style={styles.textoCinza}>Esqueci minha senha</Text>
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
  tituloContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  titulo: {
    fontFamily: 'AveriaLibre-Regular',
    fontSize: 28,
    color: 'white',
    marginRight: 8,
  },
  emoji: {
    width: 75,
    height: 75,
    marginTop: 2,
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
  botaoAzul: {
    backgroundColor: '#419ED7',
    height: 50,
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  botaoCinza: {
    backgroundColor: '#B0CCDE',
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
  textoCinza: {
    fontFamily: 'AveriaLibre-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
  },
});
