import { ImageBackground, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState, useContext } from "react";
import Logo from '../../components/Logo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buttonStyles } from '../../styles/buttons';
import { finishPlayGameMulti } from '../../CallsAPI';
import { SocketContext } from '../../WebSocketProvider';

const GameFinished = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { hostWins, guestWins } = useContext(SocketContext); 
  const { gameId } = route.params; // Recibimos los datos desde la pantalla anterior

  const [userId, setUserId] = useState(null);
  const [host, setHost] = useState(null);
  const [guest, setGuest] = useState(null);
  const [resultMessage, setResultMessage] = useState("");

  useEffect(() => {
    const getUserData = async () => {
      try {
        // Obtener userId
        const storedUserId = await AsyncStorage.getItem('userId');
        if (storedUserId) {
          setUserId(storedUserId);
          console.log('UserId obtenido:', storedUserId);
        } else {
          console.log('No se encontró el UserId');
        }

        // Obtener Host
        const storedHost = await AsyncStorage.getItem('Host');
        if (storedHost) {
          setHost(JSON.parse(storedHost)); // Parsear el string JSON a objeto
          console.log('Host obtenido:', storedHost);
        } else {
          console.log('No se encontró el Host');
        }

        // Obtener Guest
        const storedGuest = await AsyncStorage.getItem('Guest');
        if (storedGuest) {
          setGuest(JSON.parse(storedGuest)); // Parsear el string JSON a objeto
          console.log('Guest obtenido:', storedGuest);
        } else {
          console.log('No se encontró el Guest');
        }
      } catch (error) {
        console.log('Error al obtener datos desde AsyncStorage:', error);
      }
    };

    // Cargar datos del usuario
    getUserData();
  }, []);

  useEffect(() => {
    if (userId && host && guest) {
      // Verificar si el usuario actual es Host o Guest
      const isHost = userId == host.userId;
      const isGuest = userId == guest.userId;

      // Mostrar los valores de hostWins y guestWins al entrar a la pantalla
      console.log(`-----------------------------------------------------------------`);
      console.log(`hostWins: ${hostWins}, guestWins: ${guestWins}`);

      // Determinar el resultado
      if (isHost && hostWins > guestWins) {
        setResultMessage("🎉 ¡VICTORIA! 🎉");
      } else if (isGuest && guestWins > hostWins) {
        setResultMessage("🎉 ¡VICTORIA! 🎉");
      } else if (hostWins === guestWins) {
        setResultMessage("🤝 EMPATE. 🤝");
      } else {
        setResultMessage("😢 DERROTA. 😢");
      }
    }
  }, [userId, host, guest, hostWins, guestWins]);

  useEffect(() => {
    const finishGame = async () => {
      try {
        console.log("ID partida:", gameId);
        
        // Finalizar el juego
        await finishPlayGameMulti(gameId); 
      } catch (error) {
        console.error("Error al finalizar la partida:", error);
        alert("Error al finalizar la partida. Por favor, inténtelo de nuevo.");
      }
    };
    
    // Llamar a la función que realiza la operación
    finishGame();
  }, [gameId]);

  // Determinar el color basado en el mensaje
  const getResultColor = () => {
    if (resultMessage.includes("VICTORIA")) return '#4CAF50'; // Verde
    if (resultMessage.includes("EMPATE")) return '#000000'; // Negro
    if (resultMessage.includes("DERROTA")) return '#8B0000'; // Rojo oscuro
    return '#333'; // Color por defecto
  };

  return (
    <ImageBackground 
      source={require('../../../assets/fondo_mobile.jpeg')} 
      style={styles.background} 
      resizeMode="cover">
      <View style={styles.container}>
        <Logo />

        <View style={styles.infoContainer}>
          <Text style={[styles.resultText, { color: getResultColor() }]}>{resultMessage}</Text>
          <Text style={styles.infoText}>Host: {host?.username || 'No disponible'} - Puntos: {hostWins}</Text>
          <Text style={styles.infoText}>Guest: {guest?.username || 'No disponible'} - Puntos: {guestWins}</Text>
        </View>

        <TouchableOpacity 
          style={buttonStyles.buttonfullwidth}
          onPress={() => navigation.navigate('Home')}>
          <Text style={buttonStyles.buttonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 253, 220, 0.8)',
    paddingTop: 180,
    padding: 16,
  },
  infoContainer: {
    marginVertical: 20,
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16, 
    color: '#333',
    marginVertical: 4,
  },
});

export default GameFinished;
