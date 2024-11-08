import { ImageBackground, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from "react";
import Logo from '../components/Logo';
import { buttonStyles } from '../styles/buttons';
import { finishPlayGame } from '../CallsAPI';

const GameFinished = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { idGameSingle } = route.params;

  useEffect(() => {
    const finishGame = async () => {
      try {
        console.log(idGameSingle);
        await finishPlayGame(idGameSingle); 
      } catch (error) {
        console.error("Error finalizando la partida:", error);
        alert("Error al finalizar la partida. Por favor, inténtelo de nuevo.");
      }
    };
    finishGame();
  }, []);

  return (
    <ImageBackground 
      source={require('../../assets/fondo_mobile.jpeg')} 
      style={styles.background} 
      resizeMode="cover">
      <View style={styles.container}>
        <Logo />
        <TouchableOpacity 
          style={buttonStyles.buttonfullwidth}
          onPress={() => navigation.navigate('Home')}>
          <Text style={buttonStyles.buttonText}>Volver al inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={buttonStyles.buttonfullwidth}
          onPress={() => navigation.navigate('GameSet')}>
          <Text style={buttonStyles.buttonText}>Nueva partida</Text>
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
});

export default GameFinished;
