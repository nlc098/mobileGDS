import { useRoute, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useContext,useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { sendAnswer,sendAnswerMulti } from '../../CallsAPI';
import MultipleChoice from './MultipleChoiceMulti';
import OrderWord from './OrderWordMulti';
import GuessPhrase from './GuessPhraseMulti';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { SocketContext } from '../../WebSocketProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const brainDialog = require("../../../assets/idle_brain.png");
const fondo = require("../../../assets/fondo_mobile.jpeg");
const dialogbubble = require("../../../assets/hint-globe.png");

const GameLoadMulti = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { gameId, implementationGameBody, setGameId, setInitGameModes, initGameModes, isCorrectAnswer,setIsCorrectAnswer} = useContext(SocketContext); // Se obtiene el id del juego desde el contexto

 
  const [answerData, setAnswerData] = useState([]);

  const timeUsed = useRef(0);
  const initialTime = 30;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [userId, setUserId] = useState(null);
  const [hostAsync, setHostAsync] = useState(null);
  const [guestAsync, setGuestAsync] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentGameIndex, setCurrentGameIndex] = useState(null);
  const [winner, setWinner] = useState(null);
  const [hints, setHints] = useState([]);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [hintCounter, setHintCounter] = useState(3);
  const [hintButtonEnabled, setHintButtonEnabled] = useState(true);

  const [gameContent, setGameContent] = useState(null);
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false); // Agregar estado para controlar si se está verificando la respuesta

  useEffect(() => {
    const getUserData = async () => {
      try {
        // Obtener userId
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId !== null) {
          setUserId(storedUserId);
        } else {
          console.log('No userId found');
        }

        // Obtener Host
        const storedHost = await AsyncStorage.getItem('Host');
        if (storedHost !== null) {
          setHostAsync(storedHost);
        } else {
          console.log('No Host found');
        }

        // Obtener Guest
        const storedGuest = await AsyncStorage.getItem('Guest');
        if (storedGuest !== null) {
          setGuestAsync(storedGuest);
        } else {
          console.log('No Guest found');
        }

      } catch (error) {
        console.log('Error getting data from AsyncStorage:', error);
      }
    };

    getUserData(); // Ejecutar la función
  }, []); // Se ejecuta una sola vez al montar el componente

    useEffect(() => {
        if (Object.keys(initGameModes).length > 0) {
            setCurrentGameIndex(0);
        }
    }, [initGameModes]);

  useEffect(() => {
    if (implementationGameBody) {
      setAnswerData(implementationGameBody);
      setData(initGameModes);
      setLoading(false);
    }
  }, [implementationGameBody]);

  useEffect(() => {
    console.log("ninini")
    if (isCorrectAnswer) {
        sendAnswerData();
    }
}, [isCorrectAnswer]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isCheckingAnswer) { // Solo actualizar el tiempo si no se está verificando la respuesta
        setTimeLeft(prev => {
          if (prev <= 1) {
            setCurrentGameIndex(prevIndex => {
              const nextIndex = prevIndex + 1;
              if (nextIndex >= Object.keys(data).length) {
                clearInterval(timer);
                const { idGameSingle } = answerData;
                navigation.navigate('GameFinished', { idGameSingle });
                return prevIndex;
              }
              setHints([]);
              return nextIndex;
            });
            return initialTime; // Reinicia el tiempo
          }
          return prev - 1;
        });
        timeUsed.current += 1;
      }
    }, 1000);
  
    return () => clearInterval(timer);
  }, [data, navigation, isCheckingAnswer]); 
  

    // solo para multiplayer
// solo para multiplayer
useEffect(() => {
 
    if (implementationGameBody) {
        if (implementationGameBody.status === "FINISH_ROUND") {
            if (implementationGameBody.is_win) {
                if (implementationGameBody.idUserWin == hostAsync.userId) {
                    setWinner(hostAsync.username);
                    console.log("Ganador: " + hostAsync.username);
                }
                else {
                    setWinner(guestAsync.username);
                    console.log("Ganador: " + guestAsync.username);
                }
                console.log("Ganador Id: " + implementationGameBody.idUserWin);
            }
            else {
                console.log("EMPATE!");
            }
            
            console.log("FINISH ROUND!");
            handleCorrectAnswer();
        }
    }
  
}, [implementationGameBody]);


  const sendAnswerData = async () => {
    try {
      const gameKeys = Object.keys(data);
      const currentGameKey = gameKeys[currentGameIndex];
      const gameInfo = data[currentGameKey].infoGame[0];
      const { id } = gameInfo;
      
      
        const idUserWin= userId;
        const idGameMulti= gameId;
        const idGame= id;
        const time_playing= timeUsed.current
    
      setIsCheckingAnswer(true); 
      await sendAnswerMulti(idUserWin, idGameMulti, idGame, time_playing);
     
    } catch (error) {
      console.log("Error", error.message);
      setIsCheckingAnswer(false); 
    }
  }; 

  const handleCorrectAnswer = () => {
    setIsCorrectAnswer(null);
    setIsCheckingAnswer(false);
    setTimeLeft(initialTime); // Reiniciar el tiempo restante
    timeUsed.current = 0; 
    setHints([]);
  
    const gameKeys = Object.keys(data); // Claves de los juegos
    const nextIndex = currentGameIndex + 1; // Índice siguiente
  
    if (nextIndex >= gameKeys.length) {
      // Si es la última fase, navega al resumen de partida
      const { idGameSingle } = answerData;
      navigation.navigate('GameFinished', { idGameSingle });
    } else {
      // Si no es la última fase, avanza al siguiente índice
      setCurrentGameIndex(nextIndex);
    }
  };
  

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
    // Verifica si está en estado de carga
    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
  
    // Verifica si hay datos y el índice del juego es válido
    if (data && currentGameIndex < Object.keys(data).length) {
  
      const gameKeys = Object.keys(data);
      
      const currentGameKey = gameKeys[currentGameIndex];
      
      const gameInfo = data[currentGameKey].infoGame[0];

  
      // Verifica si gameInfo existe
      if (gameInfo) {
        const { idModeGame } = gameInfo;
  
        let GameComponent;
  
        // Dependiendo del modo de juego, asignamos el componente adecuado
        switch (idModeGame) {
          case 'OW':
            GameComponent = <OrderWord OWinfo={gameInfo}/>;
            break;
          case 'GP':
            GameComponent = <GuessPhrase GPinfo={gameInfo}/>;
            break;
          case 'MC':
            GameComponent = <MultipleChoice MCinfo={gameInfo}/>;
            break;
          default:
            GameComponent = <Text>Modo de juego no reconocido.</Text>;
        }
  
        
        return (
          <View style={styles.questionContainer}>
            {GameComponent}
          </View>
        );
      } else {
        return <Text>Aún no fue implementado.</Text>;
      }
    } else {
      return <Text>Juego terminado. Volviendo a inicio...</Text>;
    }
  };
  

  return (
    <ImageBackground source={fondo} style={styles.container}>
      <View style={styles.topRow}>
        <AntDesign name="questioncircle" size={50} color="black" />
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
            <Text style={styles.bubbleText}>¡Ya lo tienes!</Text>
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
    backgroundColor: "#F9F5DC",
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

export default GameLoadMulti;
