import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { initGame } from '../CallsAPI';

const SlotMachine = ({ items }) => {
  const [results, setResults] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const spinAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (items.length > 0) {
      // Establece los resultados iniciales a las primeras palabras clave de cada categoría
      const initialResults = items.map(item => item.keywords[0]);
      setResults(initialResults);
      
      // Iniciar el giro automáticamente al cargar el componente
      spinSlots();
    }
  }, [items]);

  const spinSlots = () => {
    if (spinning) return; // Evita iniciar un nuevo giro mientras ya está girando
    setSpinning(true);
    setShowResults(false);

    spinAnimation.setValue(0);
    const spins = 10; 
    let currentSpin = 0;

    const spin = () => {
      const newResults = items.map(item => {
        const randomIndex = Math.floor(Math.random() * item.keywords.length);
        return item.keywords[randomIndex];
      });

      setResults(newResults); // Actualiza los resultados en cada giro

      const duration = Math.max(200 - (currentSpin * 15), 100);
      Animated.timing(spinAnimation, {
        toValue: 1,
        duration: duration,
        useNativeDriver: true,
      }).start(() => {
        currentSpin++;
        if (currentSpin < spins) {
          spinAnimation.setValue(0);
          spin();
        } else {
          setSpinning(false);
          setShowResults(true);
          console.log("Resultados finales:", newResults);
          sendResults(newResults);
        }
      });
    };

    spin();
  };

  const translateY = spinAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80],
  });

  const translateYBottom = spinAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 0],
  });

  const sendResults = async (finalResults) => {
    try {
      const userId = '1234'; // User ID que se va a enviar
  
      // Asegúrate de que las categorías sean números
      const parCatMod = items.map((item, index) => ({
        cat: parseInt(item.category, 10), // Convertir a número
        mod: finalResults[index]
      }));
  
      const payload = {
        userId,
        parCatMod,
      };
  
      // Verificar el formato del payload antes de enviarlo
      console.log("Payload que se enviará:", JSON.stringify(payload, null, 2));
  
      const response = await initGame(userId, parCatMod);
  
      console.log("Respuesta del endpoint:", response);
    } catch (error) {
      console.error("Error al enviar resultados:", error.message);
    }
  };  
  

  return (
    <View style={styles.slotContainer}>
      <View style={styles.slotRow}>
        {results.map((result, index) => (
          <View key={index} style={styles.slotBox}>
            <Animated.View style={[styles.slotTextContainer, { transform: [{ translateY }] }]}>
              <Text style={styles.slotText}>{result}</Text>
            </Animated.View>
            {showResults && (
              <Animated.View style={[styles.slotTextContainer, { transform: [{ translateY: translateYBottom }] }]}>
                <Text style={styles.slotText}>{results[index]}</Text>
              </Animated.View>
            )}
          </View>
        ))}
      </View>
      {showResults && (
        <View style={styles.resultContainer}>
          {items.map((item, index) => (
            <Text key={index} style={styles.resultText}>{item.category}: {results[index]}</Text>
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
    flexDirection: 'row',
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
    position: 'relative',
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
