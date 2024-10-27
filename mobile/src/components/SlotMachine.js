import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SlotMachine = ({ items }) => {
  const [results, setResults] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const spinAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    if (items.length > 0) {
      // Filtrar categorías con gameModes
      const categoriesWithGameModes = items.filter(item => item.gameModes && item.gameModes.length > 0);
      const initialResults = categoriesWithGameModes.length > 0 ? [categoriesWithGameModes[0].gameModes[0]] : [];
      setResults(initialResults);
      spinSlots(categoriesWithGameModes);
    }
  }, [items]);

  const spinSlots = (categoriesWithGameModes) => {
    if (spinning) return;
    setSpinning(true);
    setShowResults(false);

    spinAnimation.setValue(0);
    const spins = 10;
    let currentSpin = 0;

    const spin = () => {
      const newResults = categoriesWithGameModes.map(item => {
        const modes = item.gameModes;
        const randomIndex = Math.floor(Math.random() * modes.length);
        return modes[randomIndex];
      });

      setResults(newResults);

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

          // Esperar 10 segundos antes de navegar
          setTimeout(() => {
            logResults(newResults, categoriesWithGameModes);
          }, 4000); // 10 segundos
        }
      });
    };

    spin();
  };

  const logResults = (finalResults, categoriesWithGameModes) => {
    const parCatMod = categoriesWithGameModes.map((item, index) => {
      const categoryId = item.id; // Obtener la id de la categoría
      const resultMode = finalResults[index];
      return {
        cat: categoryId, // ID de la categoría
        mod: resultMode   // Modo del juego
      };
    });

    navigation.navigate('GameLoad', {
      userId: '1234', // Asegúrate de reemplazar con el ID de usuario correcto
      parCatMod,
    });
  };

  const translateY = spinAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80],
  });

  const translateYBottom = spinAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 0],
  });

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
          {items.map((item, index) => {
            // Mostrar resultados solo si hay gameModes
            if (item.gameModes.length > 0) {
              return (
                <Text key={index} style={styles.resultText}>{item.name}: {results[index]}</Text>
              );
            }
            return null; // No mostrar nada si no hay gameModes
          })}
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
    width: 100,
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
