import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const GuessPhrase = ({ phrase, missingWord }) => {
  const [userGuess, setUserGuess] = useState('');
  const [timeLeft, setTimeLeft] = useState(40); // Inicializa el cronómetro en 40 segundos

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer); // Detiene el cronómetro cuando llega a 0
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Limpia el intervalo al desmontar el componente
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>Tiempo restante: {timeLeft} segundos</Text> {/* Cronómetro en la parte superior */}
      <Text style={styles.phrase}>{phrase.replace('___', '____')}</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa la palabra faltante"
        value={userGuess}
        onChangeText={setUserGuess}
      />
      <Button title="Verificar" onPress={() => { /* Lógica para verificar la palabra */ }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'red',
  },
  phrase: {
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    width: '80%',
    marginBottom: 20,
  },
});

export default GuessPhrase;
