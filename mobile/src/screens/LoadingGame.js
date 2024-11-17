import { useRoute, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from "react";
import { initGame, initPlayGame, sendAnswer } from '../CallsAPI';
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

const LoadingGame = () => {

  const route = useRoute();
  const navigation = useNavigation(); 
  const { userId, parCatMod } = route.params;
  const [timeLeft, setTimeLeft] = useState(5);
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await initGame(userId, parCatMod.map(item => item.cat), parCatMod.map(item => item.mod));
        if (responseData) {
          console.log(responseData);
          setResponseData(responseData); 
          const idGameSingle = await initPlayGame(responseData.idGameSingle);
          if (idGameSingle == null) {
            console.error("Error: idGameSingle es null o indefinido.");
          } 
        } else {
          throw new Error("No se recibieron datos de la API.");
        }
      } catch (error) {
        console.log("Error", error.message);
      }
    };

    fetchData();
  }, [userId, parCatMod]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === 1) {
          clearInterval(timer); // Detenemos el intervalo cuando llega a 0
          if (responseData) {    // Nos aseguramos de que responseData está disponible
            navi(responseData, userId); // Navegamos solo cuando el tiempo se acabe y tengamos los datos
          }
        }
        return prev - 1;
      });
    }, 1000); // Actualiza cada segundo

    return () => clearInterval(timer); // Limpiamos el intervalo si el componente se desmonta
  }, [responseData, userId]);

  const navi = (responseData, userId) => {
    navigation.navigate('GameLoad', {
      responseData: responseData,
      userId: userId,
    });
  };

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

export default LoadingGame;