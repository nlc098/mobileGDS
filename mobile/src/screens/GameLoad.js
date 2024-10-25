import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { initGame } from '../CallsAPI';  // Asegúrate de importar la función desde el archivo correcto
import SlotMachine from '../components/SlotMachine'; // Asegúrate de importar el componente SlotMachine si es necesario

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

      console.log("userID:", userId +"   CatID:", parCatMod.map(item => item.cat) +"   mod:", parCatMod.map(item => item.mod));

      try {
        // Llama a la API usando el método initGame
        const responseData = await initGame(userId, parCatMod.map(item => item.cat), parCatMod.map(item => item.mod));
        console.log("responseData:", responseData);
        // Comprueba si hay una respuesta válida antes de intentar establecer el estado
        if (responseData) {
          setData(responseData);
        } else {
          throw new Error("No se recibieron datos de la API."); // Lanza un error si no hay datos
        }
      } catch (err) {
        setError(err.message); // Captura el error y establece el mensaje
      } finally {
        setLoading(false); // Asegúrate de que loading se establezca en false al final
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
        <Text>{error}</Text> {/* Muestra el mensaje de error */}
      </View>
    );
  }

  return (
    <View>
      {data && data.categories ? (
        <SlotMachine items={data.categories} /> // Asegúrate de pasar las categorías correctamente
      ) : (
        <Text>No se pudo cargar la información del juego.</Text>
      )}
    </View>
  );
};

export default GameLoad;
