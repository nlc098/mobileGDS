import React, { useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderMain from '../components/HeaderMain';
import FooterButtons from '../components/FooterButtons';
import { buttonStyles } from "../styles/buttons";
import { logout } from '../CallsAPI';
import MainMenu from "../components/MainMenu";

const User = () => {

  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await logout(); // Llama al método para cerrar sesión
      navigation.navigate('Login'); // Redirigir al usuario a la pantalla de Login
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  
  return (
    <MainMenu>
        <Text style={styles.title}>Perfil de Usuario</Text>
        <Pressable
          style={buttonStyles.buttonfullwidth}
          onPress={() => navigation.navigate('PerfilUser')}>
          <Text style={buttonStyles.buttonText}>Ver perfil</Text>
        </Pressable>
        <Pressable
          style={buttonStyles.buttonfullwidth}
          onPress={() => console.log("Cambiar contraseña")}>
          <Text style={buttonStyles.buttonText}>Cambiar contraseña</Text>
        </Pressable>
        <Pressable
          style={buttonStyles.buttonfullwidth} onPress={handleLogout}>
          <Text style={buttonStyles.buttonText}>Cerrar sesión</Text>
        </Pressable>
    </MainMenu>
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
    backgroundColor: 'rgba(249, 253, 220, 0.8)', // Fondo semi-transparente
    paddingTop: 180, 
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 60,
    textAlign: 'center',
  },
});

export default User;
