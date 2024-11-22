import React, { useEffect, useState, useRef, useContext } from "react";
import { View, StyleSheet, Text, Image, ActivityIndicator, Animated } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackImage from "../../styles/BackImage";
import { SocketContext } from "../../WebSocketProvider";
import {fetchMultiplayerGame} from "../../CallsAPI"

const dialogbubble = require("../../../assets/hint-globe.png");
const brainpointing = require("../../../assets/brain_pointing.png");


const MultiplayerGameSet = () => {
  const { usernameHost, setGameId } = useContext(SocketContext);
  const route = useRoute();
  const navigation = useNavigation();
  const { ruletaGame, finalSlot1, finalSlot2, finalSlot3, idGame } = route.params;

  const [slot1, setSlot1] = useState(ruletaGame.categories[0].gameModes[0]);
  const [slot2, setSlot2] = useState(ruletaGame.categories[1].gameModes[0]);
  const [slot3, setSlot3] = useState(ruletaGame.categories[2].gameModes[0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [loading, setLoading] = useState(true);

  const spinAnimation1 = useRef(new Animated.Value(0)).current;
  const spinAnimation2 = useRef(new Animated.Value(0)).current;
  const spinAnimation3 = useRef(new Animated.Value(0)).current;

  const spinDuration = 1500;

  useEffect(() => {
    const fetchUserId = async () => {
      await AsyncStorage.getItem("userId"); // Se puede usar si necesitas validar algo.
      setLoading(false);
    };

    fetchUserId();
    spin();
  }, []);



  const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

const spin = async () => {
  setIsSpinning(true);

  const spinInterval = setInterval(() => {
    setSlot1(getRandomItem(ruletaGame.categories[0].gameModes));
    setSlot2(getRandomItem(ruletaGame.categories[1].gameModes));
    setSlot3(getRandomItem(ruletaGame.categories[2].gameModes));
  }, spinDuration * 0.05);

  setTimeout(async () => {
    clearInterval(spinInterval);

    setSlot1(finalSlot1);
    setSlot2(finalSlot2);
    setSlot3(finalSlot3);

    const dtoinitGameMultiRequest = {
      idPartida: idGame,
      parCatMod: [
        { cat: ruletaGame.categories[0].id, mod: finalSlot1 },
        { cat: ruletaGame.categories[1].id, mod: finalSlot2 },
        { cat: ruletaGame.categories[2].id, mod: finalSlot3 },
      ],
    };

    setIsSpinning(false);

    if (usernameHost) {
      try {
        setGameId(idGame);
        const response = await fetchMultiplayerGame(idGame, dtoinitGameMultiRequest);
        console.log("Partida iniciada:", response);

      } catch (error) {
        console.error("Error al iniciar la partida:", error.message);
      }
      
        navigation.navigate("LoadingGameMulti", { dtoinitGameMultiRequest });
      
    }else{ 
      
      navigation.navigate("LoadingGameMulti", { dtoinitGameMultiRequest });
   }


  }, spinDuration);
};

  

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando...</Text>
      </View>
    );
  }

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
        <View style={styles.slotRow}>
          <View style={styles.slotBox}>
            <Text style={styles.slotText}>{slot1}</Text>
          </View>
          <View style={styles.slotBox}>
            <Text style={styles.slotText}>{slot2}</Text>
          </View>
          <View style={styles.slotBox}>
            <Text style={styles.slotText}>{slot3}</Text>
          </View>
        </View>
        {/* {showResults && (
        <View style={styles.resultContainer}>
          {items.map((item, index) => {
            // Mostrar resultados solo si hay gameModes
            if (item.gameModes.length > 0) {
              return (
                <Text key={index} style={styles.resultText}>{item.name}: {results[index]}</Text>
              );
            }
            return null; // No mostrar nada si no hay gameModes
          })}
        </View>
      )} */}
        {isSpinning && <ActivityIndicator size="large" color="#fff" style={styles.loader} />}
      </View>
    </BackImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  slotRow: {
    flexDirection: "row",
    marginTop: 120,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "#653532",
    padding: 10,
    borderRadius: 10,
  },
  slotBox: {
    width: 100,
    height: 80,
    borderWidth: 4,
    borderColor: "#F9F5DC",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#B36F6F",
  },
  slotText: {
    color: "#F9F5DC",
    fontSize: 24,
    textAlign: "center",
  },
  resultContainer: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "#653532",
    padding: 10,
    borderRadius: 10,
    alignItems: "flex-start",
  },
  resultText: {
    fontSize: 18,
    color: "#F9F5DC",
  },
  loader: {
    marginTop: 20,
  },
});

export default MultiplayerGameSet;
