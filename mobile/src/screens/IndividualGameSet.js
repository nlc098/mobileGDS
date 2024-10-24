import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { loadGame } from '../CallsAPI'; 
import SlotMachine from '../components/SlotMachine';
import BackImage from '../components/BackImage';

const IndividualGameSet = () => {
  const route = useRoute();
  const { selectedCategoryID } = route.params; // Se obtienen las categorías seleccionadas para el juego
  const [gameData, setGameData] = useState(null); 

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        // Llama a la API pasando las categorías seleccionadas y el modo de juego
        const response = await loadGame(selectedCategoryID, 'Single');
        setGameData(response.categories); // Almacena las categorías y palabras clave en el estado
      } catch (error) {
        console.error("Error al cargar los datos del juego:", error.message);
        Alert.alert("Error", "No se pudieron cargar los datos del juego");
      }
    };

    fetchGameData();
  }, [selectedCategoryID]);

  return (
    <BackImage>
      <View style={styles.container}>
        {/* Componente SlotMachine colocado al principio */}
        {gameData && <SlotMachine items={Object.entries(gameData).map(([category, keywords]) => ({ category, keywords }))} />}
      </View>
    </BackImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Alinea los elementos al principio
    alignItems: 'center',
    padding: 20,
  },
});

export default IndividualGameSet;
