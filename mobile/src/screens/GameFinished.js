import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Logo from '../components/Logo';
import { buttonStyles } from '../styles/buttons';
import MainMenu from '../components/MainMenu';

const GameFinished = () => {
  const navigation = useNavigation();

  return (
    <View>
        <Logo />
        <TouchableOpacity style={buttonStyles.buttonfullwidth}
                          onPress={() => navigation.navigate('Home')}>
          <Text style={buttonStyles.buttonText}>Volver al inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity style={buttonStyles.buttonfullwidth}>
          <Text style={buttonStyles.buttonText}>Partida Multijugador</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 253, 220, 0.4)',
    padding: 16,
  },
  button: {
    backgroundColor: '#B36F6F',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  username: {
    fontSize: 20,
    color: "black", // Cambiado a negro
    marginBottom: 20,
    fontWeight: "bold",
  },
});

export default GameFinished;
