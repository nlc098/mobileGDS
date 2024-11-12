import React, { useContext } from "react";
import { Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { buttonStyles } from "../styles/buttons";
import { logout } from '../CallsAPI';
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainMenu from "../components/MainMenu";
import { SocketContext } from '../WebSocketProvider';  // Asegúrate de tener este contexto

const Config = () => {
  const navigation = useNavigation();
  const { disconnect } = useContext(SocketContext);  // Accede al WebSocket desde el contexto

  const handleLogout = async () => {
    try {
      const username = await AsyncStorage.getItem("username");
      await logout(username);  // Realizas el logout de la API
        disconnect(username);  // Desconectas el WebSocket
        console.log("Desconectado del WebSocket");
      navigation.navigate('Login');  // Navegas a la pantalla de Login
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <MainMenu>
      <Pressable style={buttonStyles.buttonfullwidth} onPress={handleLogout}>
        <Text style={buttonStyles.buttonText}>Cerrar sesión</Text>
      </Pressable>
    </MainMenu>
  );
};

export default Config;
