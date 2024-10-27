import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { loadGame } from '../CallsAPI'; 
import SlotMachine from '../components/SlotMachine';
import BackImage from '../styles/BackImage';

const IndividualGameSet = ({ navigation }) => {
  const route = useRoute();
  const { selectedCategoryID } = route.params;
  const [gameData, setGameData] = useState([]); 

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await loadGame(selectedCategoryID, 'Single');
        setGameData(response.categories);
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar los datos del juego");
      }
    };

    fetchGameData();
  }, [selectedCategoryID]);

  const handleSpinFinish = async (finalResults) => {
    const userId = "1234"; // O obtén este valor de donde lo necesites
    const parCatMod = gameData.map((item, index) => ({
      cat: item.id,
      mod: finalResults[index] || '', // Asegúrate de que esto no esté vacío
    }));

    // Esperar 30 segundos antes de navegar
    setTimeout(() => {
      navigation.navigate('GameLoad', { userId, parCatMod });
    }, 30000);
  };

  return (
    <BackImage>
      <View style={styles.container}>
        {gameData.length > 0 && (
          <SlotMachine items={gameData} onFinish={handleSpinFinish} />
        )}
      </View>
    </BackImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
});

export default IndividualGameSet;
