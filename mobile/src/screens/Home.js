import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import FooterButtons from '../components/FooterButtons';
import Logo from '../components/Logo';
import backgroundImage from '../../assets/fondo_mobile.jpeg';
import HeaderMain from '../components/HeaderMain';
import { logout, getUserByUsername } from '../CallsAPI';
import { buttonStyles } from '../styles/buttons';

const Home = () => {
  const navigation = useNavigation();

  // Función para manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error", "No se pudo cerrar sesión.");
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
        <HeaderMain />
        <Logo />
        <TouchableOpacity style={buttonStyles.buttonfullwidth}
                          onPress={() => navigation.navigate('GameSet')}>
          <Text style={buttonStyles.buttonText}>Partida Individual</Text>
        </TouchableOpacity>
        <TouchableOpacity style={buttonStyles.buttonfullwidth}>
          <Text style={buttonStyles.buttonText}>Partida Multijugador</Text>
        </TouchableOpacity>
        <FooterButtons />
      </View>
    </ImageBackground>
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

export default Home;
