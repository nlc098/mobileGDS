import { useRoute, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useContext } from "react";
import { initgameMulti } from '../../CallsAPI';
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { SocketContext } from '../../WebSocketProvider';

const LoadingGameMulti = () => {
  const route = useRoute();
  const navigation = useNavigation(); 
  const { gameId, implementationGameBody, setGameId, setInitGameModes, initGameModes } = useContext(SocketContext); // Se obtiene el id del juego desde el contexto
  const { dtoinitGameMultiRequest } = route.params; // Se obtiene el request desde los params de la ruta
  const [timeLeft, setTimeLeft] = useState(5);

  // Función para inicializar el juego multijugador
  const initializeMultiplayerGame = () => {
    if (implementationGameBody && implementationGameBody.status === "INVITE_IMPLEMENTATION") {
      setGameId(implementationGameBody.implementGame.idGameMulti);
      setInitGameModes(implementationGameBody.implementGame.gameModes);     
    }
  };

  // useEffect que se ejecuta cuando se recibe la data de implementación
  useEffect(() => {
    if (implementationGameBody && Object.keys(implementationGameBody).length > 0) {
      initializeMultiplayerGame();
    }
  }, [implementationGameBody]);

  const initPlayGame = () => {
    navigation.navigate("GameLoadMulti");
  };

  // Lógica para el temporizador
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 1) {
          clearInterval(timer);
          if (gameId && initGameModes) {
            initPlayGame();
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameId, initGameModes]);

  return (
    <View style={styles.container}>
      <View style={styles.timerContainer}>
        <View style={styles.circle}>
          <Text style={styles.timerText}>{timeLeft}</Text>
        </View>
      </View>
      <Text style={styles.text}>PREPÁRATE...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B36F6F",
  },
  timerContainer: {
    height: 200,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 200, 
    height: 200, 
    borderRadius: 200, 
    borderWidth: 10, 
    borderColor: "#fff", 
    justifyContent: "center", 
    alignItems: "center", 
  },
  timerText: {
    fontSize: 55,
    fontWeight: "bold",
    color: "#fff",
  },
  text: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 30,
  },
});

export default LoadingGameMulti;
