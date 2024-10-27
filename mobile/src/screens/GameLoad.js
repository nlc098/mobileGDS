import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { initGame } from '../CallsAPI';  // Asegúrate de importar la función desde el archivo correcto

const GameLoad = ({ route }) => {
  const { userId, parCatMod } = route.params; // Recibe los parámetros

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !parCatMod || parCatMod.length === 0) {
        setError("Parámetros inválidos."); // Manejo de error si falta algún parámetro
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

  return (
    <View style={{ padding: 16 }}>
      {data && data.gameModes ? (
        Object.entries(data.gameModes).map(([key, value]) => (
          <View key={key} style={{ marginBottom: 16, padding: 10, borderColor: '#ccc', borderWidth: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>{value.name}</Text>
            <Text>Info Game: {JSON.stringify(value.infoGame)}</Text>
          </View>
        ))
      ) : (
        <Text>No se pudo cargar la información del juego.</Text>
      )}
    </View>
  );
};

export default GameLoad;