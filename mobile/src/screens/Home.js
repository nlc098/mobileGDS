import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FooterButtons from '../components/FooterButtons';
import Logo from '../components/Logo';
import backgroundImage from '../../assets/fondo_mobile.jpeg';
import HeaderMain from '../components/HeaderMain';
import { logout, getUserByUsername } from '../CallsAPI';

const Home = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserByUsername();
        if (userData && userData.username) {
          setUsername(userData.username); // Mostrar el nombre del usuario
        } else {
          console.error("No se encontró el usuario");
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    fetchUser();
  }, []);

  // Función para manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      await logout(); // Llama al método de logout
      setUsername(''); // Limpiar el nombre de usuario en el estado
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
        {
        //borrar el text de username
        username ? (
          <Text style={styles.username}>Bienvenido, {username}</Text> // Muestra el nombre de usuario
        ) : (
          <Text style={styles.username}>Hola</Text> // Muestra "Hola" si username es null o vacío
        )}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Partida Individual</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Partida Multijugador</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
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
