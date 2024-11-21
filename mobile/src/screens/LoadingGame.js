import { useRoute, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import { initGame, initPlayGame } from '../CallsAPI';

const LoadingGame = () => {
  const route = useRoute();
  const navigation = useNavigation(); 
  const { userId, parCatMod } = route.params;
  const [isLoading, setIsLoading] = useState(true); // Indicador de carga

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Llamada al backend
        const responseData = await initGame(userId, parCatMod.map(item => item.cat), parCatMod.map(item => item.mod));
        
        if (responseData) {
          console.log(responseData);
          const idGameSingle = await initPlayGame(responseData.idGameSingle);
          
          if (idGameSingle == null) {
            console.error("Error: idGameSingle es null o indefinido.");
          } else {
            // Navegar a la siguiente pantalla una vez se cargan los datos
            navigation.navigate('GameLoad', {
              responseData: responseData,
              userId: userId,
            });
          }
        } else {
          throw new Error("No se recibieron datos de la API.");
        }
      } catch (error) {
        console.log("Error", error.message);
      } finally {
        setIsLoading(false); // Detenemos el indicador de carga (en caso de un error)
      }
    };

    fetchData();
  }, [userId, parCatMod, navigation]);

  return (
    <View style={styles.container}>
       <Text style={styles.text}>PREPÁRATE...</Text>
      {isLoading ? (
        // Indicador de carga mientras se cargan los datos
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        // Mostrar un mensaje de error en caso de falla (opcional)
        <Text style={styles.errorText}>Algo salió mal. Por favor, inténtalo nuevamente.</Text>
      )}
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
  errorText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  text: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 30,
  },
});

export default LoadingGame;
