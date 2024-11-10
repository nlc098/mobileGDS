import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, Image, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { loadGame } from '../CallsAPI'; 
import SlotMachine from '../components/SlotMachine';
import BackImage from '../styles/BackImage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const dialogbubble = require("../../assets/hint-globe.png");
const brainpointing = require("../../assets/brain_pointing.png");

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
    const userId = await AsyncStorage.getItem("userId");
    const parCatMod = gameData.map((item, index) => ({
      cat: item.id,
      mod: finalResults[index] || '',
    }));

    // Esperar 30 segundos antes de navegar
    setTimeout(() => {
      navigation.navigate('LoadingGame', { userId, parCatMod });
    }, 1000);
  };

  return (
    <BackImage>
      <View style={styles.container}>
          <Image
            source={brainpointing}
            resizeMode="contain"
            style={styles.brainDialog}
          />
        <View style={styles.speechBubbleContainer}>
          <Image
            source={dialogbubble}
            resizeMode="contain"
            style={styles.speechBubble}
          />
          <View style={styles.textContainer}>
            <Text style={styles.bubbleText}>Los juegos serán...</Text>
          </View>
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  brainDialog: {
    position: "absolute",
    height: 1300,
    width: 1300,
    top: -600,
  },
  speechBubbleContainer: {
    position: "absolute",
    top: -120,
    right: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  speechBubble: {
    width: 170,
    height: 170,
  },
  textContainer: {
    position: "absolute",
    top: 45,
    justifyContent: "center",
    alignItems: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  bubbleText: {
    color: "#333",
    fontSize: 20,
    textAlign: "center",
    numberOfLines: 3,
    ellipsizeMode: "tail",
  },
});

export default IndividualGameSet;
