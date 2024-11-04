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
          setResponseData(responseData);  // Guardamos el responseData
          const idGameSingle = await initPlayGame(responseData.idGameSingle);
          if (idGameSingle != null) {
            // Todo está bien, podemos continuar
          } else {
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
        <Text>PREPÁRATE...</Text>
      </View>
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
      width: 120, 
      height: 120, 
      borderRadius: 40, 
      borderWidth: 2, 
      borderColor: "#fff", 
      justifyContent: "center", 
      alignItems: "center", 
    },
    timerText: {
      fontSize: 36,
      fontWeight: "bold",
      color: "#fff",
    },
  });

export default LoadingGame;