import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackImage from '../components/BackImage';
import {buttonStyles} from '../styles/buttons'

const shuffleWord = (word) => {
  return word.split('').sort(() => Math.random() - 0.5).join('');
};

const OrderWord = ({ word, initialTime = 40 }) => {
  const [shuffledWord] = useState(shuffleWord(word)); // Solo se mezcla una vez
  const [input, setInput] = useState('');
  const [time, setTime] = useState(initialTime);
  const [result, setResult] = useState(null); // Para mostrar si acertó o no
  const [isTimeUp, setIsTimeUp] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    let timer;

    if (time > 0 && !isTimeUp) {
      timer = setTimeout(() => setTime(time - 1), 1000);
    } else if (time === 0) {
      setIsTimeUp(true);
      navigation.navigate('Home'); // Si el tiempo acaba, navega a Home.js
    }

    return () => clearTimeout(timer);
  }, [time, isTimeUp]);

  const handleVerify = () => {
    if (input === word) {
      setResult('¡Correcto!');
    } else {
      setResult('Error, intenta de nuevo.'); // Mensaje de error
    }
  };

  return (
    <BackImage>
    <View style={styles.container}>
      <Text style={styles.timer}>Tiempo restante: {time} segundos</Text>
      <Text style={styles.word}>Ordena la palabra: {shuffledWord}</Text>
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        editable={true} // Siempre habilitado para seguir escribiendo
      />
      <Button style ={buttonStyles.buttonfullwidth} title="Verificar" onPress={handleVerify} />
      {result && (
        <Text style={styles.result}>{result}</Text>
      )}
    </View>
    </BackImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontSize: 18,
    marginBottom: 20,
  },
  word: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 60, // Tamaño fijo del campo
    width: 300, // Tamaño fijo del campo
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 24, // Aumenta el tamaño de la fuente
  },
  result: {
    fontSize: 18,
    marginTop: 20,
  },
});

export default OrderWord;
