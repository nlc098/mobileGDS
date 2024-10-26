import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { initGame } from '../CallsAPI';  // Asegúrate de importar la función desde el archivo correcto
import GuessPhrase from '../components/GuessPhrase';
import OrderWord from '../components/OrderWord';
import OrderByDate from '../components/OrderByDate';

const GameLoad = ({ route }) => {
  const { userId, parCatMod } = route.params;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentGame, setCurrentGame] = useState(0);
  const [showTransition, setShowTransition] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !parCatMod || parCatMod.length === 0) {
        setError("Parámetros inválidos.");
        setLoading(false);
        return;
      }

      try {
        const responseData = await initGame(userId, parCatMod.map(item => item.cat), parCatMod.map(item => item.mod));

        if (responseData) {
          setData(responseData);
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
    if (showTransition) {
      const timer = setTimeout(() => {
        setShowTransition(false);
        setCurrentGame((prev) => prev + 1); // Avanza al siguiente juego
      }, 40000); // Transición de 40 segundos

      return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
    }
  }, [showTransition]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }

  const gameModes = data?.gameModes || {};
  const gameKeys = Object.keys(gameModes);

  if (currentGame >= gameKeys.length) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>¡Has completado todos los juegos!</Text>
      </View>
    );
  }

  const currentGameData = gameModes[gameKeys[currentGame]];

  if (showTransition) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Preparando el siguiente juego...</Text>
      </View>
    );
  }

  const renderGameComponent = () => {
    if (!currentGameData.infoGame || currentGameData.infoGame.length === 0) {
      return <Text>Implementar palabra</Text>;
    }

    switch (currentGameData.name) {
      case 'Guess Phrase':
        return (
          <GuessPhrase
            phrase={currentGameData.infoGame[0].phrase}
            missingWord={currentGameData.infoGame[0].missingWord}
          />
        );
      case 'Order Word':
        return (
          <OrderWord
            word={currentGameData.infoGame[0].word}
          />
        );
      case 'Order By Date':
        return (
          <OrderByDate
            phrases={currentGameData.infoGame.map(item => item.phrase)}
          />
        );
      default:
        return <Text>Modo de juego no reconocido</Text>;
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {renderGameComponent()}
    </View>
  );
};

export default GameLoad;
