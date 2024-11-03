import { useRoute, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { initGame, initPlayGame, sendAnswer } from '../CallsAPI';
import MultipleChoice from '../components/MultipleChoice';
import OrderWord from '../components/OrderWord';
import GuessPhrase from '../components/GuessPhrase';
import { GameContext } from "../context/GameContext";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";

const brainDialog = require("../../assets/idle_brain.png");
const fondo = require("../../assets/fondo_mobile.jpeg");
const dialogbubble = require("../../assets/hint-globe.png");

const InGameScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId, parCatMod } = route.params;

  const { answer } = useContext(GameContext);
  const [answerData, setAnswerData] = useState([]);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);

  const [hints, setHints] = useState([]);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [hintCounter, setHintCounter] = useState(3);
  const [hintButtonEnabled, setHintButtonEnabled] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !parCatMod || parCatMod.length === 0) {
        setError("Parámetros inválidos.");
        setLoading(false);
        return;
      }
      try {
        const responseData = await initGame(userId, parCatMod.map(item => item.cat),parCatMod.map(item => item.mod));
        if (responseData) {
          const gameModes = responseData.gameModes;
          setData(gameModes);
          setAnswerData(responseData);
          const idGameSingle = await initPlayGame(responseData.idGameSingle)
          if(idGameSingle != null){
           
          }else {
            console.error("Error: idGameSingle es null o indefinido.");
          }
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

  const sendAnswerData = async () => {
    try {
      const gameKeys = Object.keys(data);
      const currentGameKey = gameKeys[currentGameIndex];
      const gameInfo = data[currentGameKey].infoGame[0];
      const { id } = gameInfo;
      console.log(answer);
      console.log(id);
      const responseData = await sendAnswer(answerData.idGameSingle, userId, answer, id, 21.5);
      if (responseData == true) {
        setCurrentGameIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= Object.keys(data).length) {
            //navigation.navigate('Home'); // Navegar a Home al terminar
            return prevIndex; // No cambiar el índice si hemos terminado
          }
          return nextIndex; // Cambiar al siguiente juego
        });
      } else if(responseData == false){
        
      }else{
        throw new Error("No se recibieron datos de la API.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Cambiar al siguiente juego
          setCurrentGameIndex(prevIndex => {
            const nextIndex = prevIndex + 1;
            if (nextIndex >= Object.keys(data).length) {
              clearInterval(timer);
              return prevIndex; // No cambiar el índice si hemos terminado
            }
            setHints([]); // Se reinician las pistas
            return nextIndex; // Cambiar al siguiente juego
          });
          return 10; // Reiniciar el tiempo
        }
        return prev - 1;
      });
    }, 1000); // Actualiza cada segundo

    return () => clearInterval(timer); // Limpiar el temporizador al desmontar
  }, [data, navigation]); // Añadir navegación como dependencia

  const showNextHint = () => {
    if (data && currentGameIndex < Object.keys(data).length && hintButtonEnabled) {
      const gameKeys = Object.keys(data);
      const currentGameKey = gameKeys[currentGameIndex];
      const gameInfo = data[currentGameKey].infoGame[0]; // Asignamos de nuevo después de vaciar

      const { idModeGame } = gameInfo;
            
      switch (idModeGame) {
        case 'OW':
        case 'GP':
        case 'MC':
          setHints([gameInfo.hint1, gameInfo.hint2, gameInfo.hint3]);
          break;
        default:
      }
      // Actualiza el índice de la pista
      setCurrentHintIndex((prevIndex) => {
        if (prevIndex < hints.length - 1) {
          return prevIndex + 1;
        }
        return prevIndex;
      });

      // Actualiza el contador de pistas
      setHintCounter((prevCounter) => {
        if (prevCounter > 1) {
          return prevCounter - 1;
        } else {
          setHintButtonEnabled(false); // Desactiva el botón al llegar a cero
          return 0;
        }
      });
    }
  };

  const hintButton = () => (
    <TouchableOpacity
      style={[
        styles.hintButton,
        !hintButtonEnabled && styles.disabledButton,
      ]}
      onPress={showNextHint}
      disabled={!hintButtonEnabled}
    >
      <Ionicons name="help-outline" size={50} color={hintButtonEnabled ? "#653532" : "gray"} />
      <Text style={styles.counterText}>{hintButtonEnabled ? hintCounter : 0}</Text>
    </TouchableOpacity>
  );


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
            GameComponent = <OrderWord OWinfo={gameInfo} veryfyAnswer={sendAnswerData} />;
            break;
          case 'GP':
            GameComponent = <GuessPhrase GPinfo={gameInfo} veryfyAnswer={sendAnswerData}/>;
            break;
          case 'MC':
            GameComponent = <MultipleChoice MOinfo={gameInfo} veryfyAnswer={sendAnswerData}/>;
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
        <AntDesign name="questioncircle" size={50} color="black" />
        <Ionicons name="person-circle-outline" size={60} color="black" />
      </View>

      <View style={styles.timerContainer}>
        <View style={styles.circle}>
          <Text style={styles.timerText}>{timeLeft}</Text>
        </View>
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
        <View style={styles.textContainer}>
          {hints.length > 0 ? (
            <Text style={styles.bubbleText}>{hints[currentHintIndex]}</Text>
          ) : (
            <Text style={styles.bubbleText}>¡Apurate!</Text>
          )}
        </View>
      </View>
      {hintButton()}
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
    top: 130,
    right: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 70, 
    height: 70, 
    borderRadius: 40, 
    borderWidth: 2, 
    borderColor: "black", 
    justifyContent: "center", 
    alignItems: "center", 
  },
  timerText: {
    fontSize: 36,
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
    alignItems: "center",
    justifyContent: "center",
  },
  speechBubble: {
    width: 140,
    height: 140,
  },
  textContainer: {
    position: "absolute",
    top: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    alignItems: "center",
  },
  bubbleText: {
    color: "#333",
    fontSize: 16,
    textAlign: "center",
    numberOfLines: 3,
    ellipsizeMode: "tail", // Mostrar elipsis si desborda
  },
  questionContainer: {
    marginTop: 230,
    width: "90%",
    height: 500,
    backgroundColor: "#F9F5DC",
    opacity: 0.95,
    padding: 20,
    borderRadius: 8,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#653532",
  },
  questionText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 60,
  },
  hintButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#653532", 
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    top: 250,
    right: 40,
  },
  disabledButton: {
    backgroundColor: "#f0f0f0", // Color de fondo deshabilitado
    borderColor: "#ccc", // Color del contorno deshabilitado
  },
  counterText: {
    position: "absolute",
    top: 55,
    fontSize: 16,
    color: "black",
  },
});

export default InGameScreen;
