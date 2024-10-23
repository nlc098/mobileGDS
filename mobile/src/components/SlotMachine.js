import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const SlotMachine = () => {
  // Opciones para cada cuadrado
  const options = [
    Array.from({ length: 9 }, (_, i) => (i + 1).toString()), // Números del 1 al 9
    Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)), // Letras de A a Z
    ['🍒', '🍋', '🍊'] // Emojis
  ];

  const [results, setResults] = useState([options[0][0], options[1][0], options[2][0]]); // Estado inicial
  const [spinning, setSpinning] = useState(false); // Estado de giro
  const [showResults, setShowResults] = useState(false); // Estado para mostrar resultados
  const spinAnimation = useRef(new Animated.Value(0)).current; // Inicializa la animación

  const spinSlots = () => {
    if (spinning) return; // Evitar múltiples giros
    setSpinning(true);
    setShowResults(false); // Oculta resultados antes de girar

    // Reinicia la animación
    spinAnimation.setValue(0);

    const spins = 10; // Número de giros
    let currentSpin = 0;

    const spin = () => {
      // Genera nuevos resultados aleatorios
      const newResults = results.map((_, index) => {
        const randomIndex = Math.floor(Math.random() * options[index].length);
        return options[index][randomIndex];
      });
      setResults(newResults); // Actualiza resultados en cada giro

      // Calcula la duración del giro (disminuye con el tiempo)
      const duration = Math.max(200 - (currentSpin * 15), 100); // Duración mínima de 100 ms

      // Animación de girar (verticalmente)
      Animated.timing(spinAnimation, {
        toValue: 1,
        duration: duration, // Duración del giro
        useNativeDriver: true,
      }).start(() => {
        currentSpin++;
        if (currentSpin < spins) {
          // Reinicia la animación para el siguiente giro
          spinAnimation.setValue(0); // Reinicia la animación
          spin(); // Llama al siguiente giro
        } else {
          setSpinning(false); // Restablece el estado de giro
          setShowResults(true); // Muestra los resultados al finalizar el giro
          console.log("Resultados finales (lista):", newResults); // Imprime resultados finales
        }
      });
    };

    spin(); // Inicia el primer giro
  };

  // Transformación de la animación
  const translateY = spinAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80], // Cambia este valor para ajustar cuánto se desplaza
  });

  const translateYBottom = spinAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 0], // Este valor mueve el nuevo símbolo hacia arriba
  });

  // Inicia el giro cuando el componente se monta
  useEffect(() => {
    spinSlots();
  }, []);

  return (
    <View style={styles.slotContainer}>
      <View style={styles.slotRow}>
        {results.map((item, index) => (
          <View key={index} style={styles.slotBox}>
            <Animated.View style={[styles.slotTextContainer, { transform: [{ translateY }] }]}>
              <Text style={styles.slotText}>{item}</Text>
            </Animated.View>
            {showResults && ( // Mostrar el nuevo resultado después de que haya terminado el giro
              <Animated.View style={[styles.slotTextContainer, { transform: [{ translateY: translateYBottom }] }]}>
                <Text style={styles.slotText}>{results[index]}</Text>
              </Animated.View>
            )}
          </View>
        ))}
      </View>
      {showResults && (
        <View style={styles.resultContainer}>
          {results.map((result, index) => (
            <Text key={index} style={styles.resultText}>Resultado {index + 1}: {result}</Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  slotContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  slotRow: {
    flexDirection: 'row', // Asegura que los textos estén en la misma fila
  },
  slotBox: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    overflow: 'hidden',
    position: 'relative', // Permite que los elementos hijos se posicionen relativos al cuadro
  },
  slotTextContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotText: {
    fontSize: 48,
  },
  resultContainer: {
    marginTop: 20,
  },
  resultText: {
    fontSize: 20,
  },
});

export default SlotMachine;
