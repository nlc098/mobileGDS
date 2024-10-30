import { useRoute, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { initGame } from '../CallsAPI';
import OrderByDate from '../components/OrderByDate';
import OrderWord from '../components/OrderWord';
import GuessPhrase from '../components/GuessPhrase';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  ActivityIndicator
} from "react-native";

const brainDialog = require("../../assets/idle_brain.png");
const fondo = require("../../assets/fondo_mobile.jpeg");
const dialogbubble = require("../../assets/hint-globe.png");

const InGameScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId, parCatMod } = route.params;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(50000);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !parCatMod || parCatMod.length === 0) {
        setError("Parámetros inválidos.");
        setLoading(false);
        return;
      }
      try {
        const responseData = await initGame(userId,parCatMod.map(item => item.cat),parCatMod.map(item => item.mod));
        if (responseData) {
          setData(responseData.gameModes);
          console.log(responseData);
        } else {
          throw new Error("No se recibieron datos de la API.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, parCatMod]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Cambiar al siguiente juego
          setCurrentGameIndex(prevIndex => {
            const nextIndex = prevIndex + 1;
            if (nextIndex >= Object.keys(data).length) {
              clearInterval(timer);
              navigation.navigate('Home');
              return prevIndex; // No cambiar el índice si hemos terminado
            }
            return nextIndex; // Cambiar al siguiente juego
          });
          return 30; // Reiniciar el tiempo
        }
        return prev - 1;
      });
    }, 1000); // Actualiza cada segundo

    return () => clearInterval(timer); // Limpiar el temporizador al desmontar
  }, [data, navigation]); // Añadir navegación como dependencia

  const handleCorrectAnswer = () => {
    setCurrentGameIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
      if (nextIndex >= Object.keys(data).length) {
        navigation.navigate('Home'); // Navegar a Home al terminar
        return prevIndex; // No cambiar el índice si hemos terminado
      }
      return nextIndex; // Cambiar al siguiente juego
    });
  };

  const renderGame = () => {
    if (error) return <Text>{error}</Text>;
    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

    if (data && currentGameIndex < Object.keys(data).length) {
      const gameKeys = Object.keys(data);
      const currentGameKey = gameKeys[currentGameIndex];
      const gameInfo = data[currentGameKey].infoGame[0];

      if (gameInfo) {
        const { idModeGame } = gameInfo;
        let GameComponent;

        switch (idModeGame) {
          case 'OW':
            GameComponent = <OrderWord OWinfo={gameInfo} onCorrect={handleCorrectAnswer} />;
            break;
          case 'GP':
            GameComponent = <GuessPhrase GPinfo={gameInfo} onCorrect={handleCorrectAnswer} />;
            break;
          case 'OBD':
            GameComponent = <OrderByDate infoGame={gameInfo} onCorrect={handleCorrectAnswer} />;
            break;
          default:
            GameComponent = <Text>Modo de juego no reconocido.</Text>;
        }

        return (
          <View style={styles.questionContainer}>
            {GameComponent}
          </View>
        );
      }else {
        return <Text>Aún no fue implementado.</Text>;
      }
    } else {
      return <Text>Juego terminado. Volviendo a inicio...</Text>;
    }
  };

  return (
    <ImageBackground source={fondo} style={styles.container}>
      <View style={styles.topRow}>
        <Ionicons name="person-circle-outline" size={60} color="black" />
        <AntDesign name="questioncircle" size={60} color="black" />
        <Ionicons name="person-circle-outline" size={60} color="black" />
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{timeLeft}</Text>
      </View>

      <View style={styles.brainContainer}>
        <Image
          source={brainDialog}
          resizeMode="contain"
          style={styles.brainDialog}
        />
      </View>
      <View style={styles.speechBubbleContainer}>
        <Image
          source={dialogbubble}
          resizeMode="contain"
          style={styles.speechBubble}
        />
        <Text style={styles.bubbleText}>¡Apurate!</Text>
      </View>
        {renderGame()}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingTop: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 20,
    marginTop: 20,
  },
  timerContainer: {
    position: "absolute",
    top: 150,
    right: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "black",
  },
  brainContainer: {
    top: 15,
    left: 0,
    position: "absolute",
  },
  brainDialog: {
    top: 200,
    left: 20,
    height: 80,
    width: 80,
    position: "absolute",
  },
  speechBubbleContainer: {
    position: "absolute",
    top: 100,
    right: 200,
  },
  speechBubble: {
    width: 140,
    height: 140,
  },
  bubbleText: {
    color: "#333",
    fontSize: 14,
    textAlign: "center",
    justifyContent: "center",
    bottom: 90,
  },
  questionContainer: {
    marginTop: 200,
    width: "90%",
    height: 500,
    backgroundColor: "#F9F5DC",
    opacity: 0.95,
    padding: 20,
    borderRadius: 8,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#653532",
    alignItems: "center",
  },
  questionText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 60,
  },
});

export default InGameScreen;
