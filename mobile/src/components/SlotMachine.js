import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const SlotMachine = ({ items }) => {
  const [results, setResults] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [userId, setUserId] = useState(null); // Estado para almacenar el userId
  const [loading, setLoading] = useState(true); // Estado de carga para esperar el userId
  const spinAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      setUserId(storedUserId); // Guardamos el userId en el estado
      setLoading(false); // Cambiamos el estado a 'false' cuando el userId esté listo
    };

    fetchUserId();
  }, []); // Solo ejecuta esto una vez cuando el componente se monte

  useEffect(() => {
    if (items.length > 0 && userId) {
      // Filtrar categorías con gameModes
      const categoriesWithGameModes = items.filter(item => item.gameModes && item.gameModes.length > 0);
      const initialResults = categoriesWithGameModes.length > 0 ? [categoriesWithGameModes[0].gameModes[0]] : [];
      setResults(initialResults);
      spinSlots(categoriesWithGameModes);
    }
  }, [items, userId]); // Este useEffect se ejecutará cuando 'items' o 'userId' cambien

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

          // Esperar 2 segundos antes de navegar
          setTimeout(() => {
            logResults(newResults, categoriesWithGameModes);
          }, 2000);
        }
      });
    };

    spin();
  };

  const logResults = (finalResults, categoriesWithGameModes) => {
    if (userId) {
      const parCatMod = categoriesWithGameModes.map((item, index) => {
        const categoryId = item.id; // Obtener la id de la categoría
        const resultMode = finalResults[index];
        return {
          cat: categoryId, // ID de la categoría
          mod: resultMode   // Modo del juego
        };
      }).reverse();
      
      navigation.navigate('LoadingGame', {
        userId: userId,
        parCatMod,
      });
    } else {
      console.error("User ID is not available");
    }
  };

  const translateY = spinAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80],
  });

  const translateYBottom = spinAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 0],
  });

  // Si el userId no está disponible, no renderizamos el SlotMachine
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando...</Text>
      </View>
    );
  }

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
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 30,
  }, 
});

export default SlotMachine;
