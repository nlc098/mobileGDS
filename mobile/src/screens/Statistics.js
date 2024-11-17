import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import MainMenu from '../components/MainMenu';
import Dropdown from '../components/Dropdown';
import { listGames, rankingPartidasWin, rankingPuntaje, rankingTiempo } from '../CallsAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

const Statistics = () => {

  const [playerData, setplayerData] = useState(null);
  const [rankingWins, setRankingWins] = useState(null);
  const [rankingPoints, setRankingPoints] = useState(null);
  const [rankingTimes, setRankingTimes] = useState(null);

  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const statsData = await listGames(userId);
        if (statsData) {
          setplayerData(statsData.partidas);
          //console.log(playerData);
        } else {
          throw new Error("No se recibieron datos de la API.");
        }
      } catch (error) {
        console.log("Error", error.message);
      }
    };

    const fetchRankingWins = async () => {
      try {
        const statsData = await rankingPartidasWin();    
          console.log(statsData);
          setRankingWins(statsData);
      } catch (error) {
        console.log("Error", error.message);
      }
    };

    const fetchRankingPoints = async () => {
      try {
        const statsData = await rankingPuntaje();
        console.log(statsData);
        setRankingPoints(statsData);
      } catch (error) {
        console.log("Error", error.message);
      }
    };

    const fetchRankingTimes = async () => {
      try {
        const statsData = await rankingTiempo();
        console.log(statsData);
        setRankingTimes(statsData);
      } catch (error) {
        console.log("Error", error.message);
      }
    };
    fetchPlayerData();
    fetchRankingWins();
    fetchRankingPoints();
    fetchRankingTimes();
  }, []);

 
  const [rankingOption, setrankingOption] = useState("Partidas ganadas");
  const [listOption, setListOption] = useState("Partida individual");

  const gameMapping = {
    "GuessPhrase": "GP",
    "MultipleChoice": "MC",
    "OrderWord": "OW",
  };

  const playerListData = {
    "Partida individual": playerData?.INDIVIDUAL?.map((game) => ({
      game1: gameMapping[game.game1] || game.game1,
      game2: gameMapping[game.game2] || game.game2,
      game3: gameMapping[game.game3] || game.game3,
      idGame: game.id_game,
      points: game.points,
      time: game.time_playing,
    })),
    "Partida multijugador": playerData?.MULTIPLAYER?.map((game) => ({
      game1: gameMapping[game.game1] || game.game1,
      game2: gameMapping[game.game2] || game.game2,
      game3: gameMapping[game.game3] || game.game3,
      idGame: game.id_game,
      points: game.points,
      time: game.time_playing,
      winner: game.user_win,
    })),
  };

  const rankingsData = {
    "Partidas ganadas": rankingWins?.map((data) => ({
      user: data.username,
      wins: data.criterio,
    })),
    "Puntos totales (individual)": rankingPoints?.INDIVIDUAL?.map((data) => ({
      user: data.username,
      points: data.criterio,
    })),
    "Puntos totales (multijugador)": rankingPoints?.MULTIPLAYER?.map((data) => ({
      user: data.username,
      points: data.criterio,
    })),
    "Tiempos de acierto (individual)": rankingTimes?.INDIVIDUAL?.map((data) => ({
      user: data.username,
      time: data.criterio,
    })),
    "Tiempos de acierto (multijugador)": rankingTimes?.MULTIPLAYER?.map((data) => ({
      user: data.username,
      time: data.criterio,
    })),
  };

  return (
    <MainMenu>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          
          {/* Primera tabla: Partidas Jugadas */}
          <View style={styles.tableContainer}>
            <Text style={styles.title}>Partidas Jugadas</Text>
            <Dropdown
              options={["Partida individual", "Partida multijugador"]}
              selectedValue={listOption}
              onValueChange={setListOption}
            />
            <View style={styles.tableHeader}>
              {listOption === "Partida individual" ? (
                <>
                  <Text style={styles.headerCell}>Fases</Text>
                  <Text style={styles.headerCell}>Puntos</Text>
                  <Text style={styles.headerCell}>Tiempo</Text>
                </>
              ) : (
                <>
                  <Text style={styles.headerCell}>Ganador</Text>
                  <Text style={styles.headerCell}>Fases</Text>
                  <Text style={styles.headerCell}>Puntos</Text>
                  <Text style={styles.headerCell}>Tiempo</Text>
                </>
              )}
            </View>
            <ScrollView style={styles.tableBody} nestedScrollEnabled>
              {playerListData[listOption]?.map((item, index) => (
                  <View key={index} style={styles.row}>
                  {listOption === "Partida individual" ? (
                    <>
                      <Text style={styles.cell}>
                      {`${item.game1}-${item.game2}-${item.game3}`}
                      </Text>
                      <Text style={styles.cell}>{item.points}</Text>
                      <Text style={styles.cell}>{item.time}</Text>
                    </>
                  ) : (
                    <>
                    <Text style={styles.cell}>{item.winner}</Text>
                    <Text style={styles.cell}>
                      {`${item.game1}-${item.game2}-${item.game3}`}
                    </Text>
                    <Text style={styles.cell}>{item.points}</Text>
                    <Text style={styles.cell}>{item.time}</Text>
                  </>
                  )}
                </View>
              ))}

            </ScrollView>
          </View>

          {/* Segunda tabla: Rankings */}
          <View style={styles.tableContainer}>
            <Text style={styles.title}>Rankings</Text>
            <Dropdown
              options={["Partidas ganadas", "Puntos totales (individual)", "Puntos totales (multijugador)", "Tiempos de acierto (individual)", "Tiempos de acierto (multijugador)"]}
              selectedValue={rankingOption}
              onValueChange={setrankingOption}
            />
            <View style={styles.tableHeader}>
              {rankingOption === "Partidas ganadas" ? (
                <>
                  <Text style={styles.headerCell}>Usuario</Text>
                  <Text style={styles.headerCell}>Ganadas</Text>
                </>
              ) : rankingOption === "Tiempos de acierto (individual)" || "Tiempos de acierto (multijugador)" ? (
                <>
                  <Text style={styles.headerCell}>Usuario</Text>
                  <Text style={styles.headerCell}>Tiempo</Text>
                </>
              ) : rankingOption === "Puntos totales (individual)" || rankingOption === "Puntos totales (multijugador)" ? (
                <>
                  <Text style={styles.headerCell}>Usuario</Text>
                  <Text style={styles.headerCell}>Puntos</Text>
                </>
              ) : null}
            </View>
            <ScrollView style={styles.tableBody} nestedScrollEnabled>
            {rankingsData[rankingOption]?.map((item, index) => (
              <View key={index} style={styles.row}>
                {rankingOption === "Partidas ganadas" ? (
                  <>
                    <Text style={styles.cell}>{item.user}</Text>
                    <Text style={styles.cell}>{item.wins}</Text>
                  </>
                ) : rankingOption === "Puntos totales (individual)" ? (
                  <>
                    <Text style={styles.cell}>{item.user}</Text>
                    <Text style={styles.cell}>{item.points}</Text>
                  </>
                ) : rankingOption === "Puntos totales (multijugador)" ? (
                  <>
                    <Text style={styles.cell}>{item.user}</Text>
                    <Text style={styles.cell}>{item.points}</Text>
                  </>
                ) : rankingOption === "Tiempos de acierto (individual)" ? (
                  <>
                    <Text style={styles.cell}>{item.user}</Text>
                    <Text style={styles.cell}>{item.time}</Text>
                  </>
                ) : rankingOption === "Tiempos de acierto (multijugador)" ? (
                  <>
                    <Text style={styles.cell}>{item.user}</Text>
                    <Text style={styles.cell}>{item.time}</Text>
                  </>
                ) : null}
              </View>
            ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </MainMenu>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 100,
  },
  tableContainer: {
    width: screenWidth * 0.9,
    height: 400,
    marginBottom: 50,
    padding: 10,
    backgroundColor: '#F8ECD9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    flexShrink: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#774936',
    marginBottom: 10,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E8D5C4',
    paddingVertical: 8,
    borderRadius: 5,
  },
  headerCell: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#774936',
    textAlign: 'center',
  },
  tableBody: {
    maxHeight: 280,
    flexGrow: 0,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#D9BFB0',
  },
  cell: {
    flex: 1,
    fontSize: 16,
    color: '#774936',
    textAlign: 'center',
  },
});

export default Statistics;
