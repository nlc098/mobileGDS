import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const OrderByDate = ({ phrases }) => {
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
      {phrases.map((phrase, index) => (
        <Text key={index} style={styles.phrase}>{phrase}</Text>
      ))}
      <Button title="Verificar Orden" onPress={() => { /* Lógica para verificar el orden */ }} />
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
    fontSize: 18,
    marginBottom: 10,
  },
});

export default OrderByDate;
