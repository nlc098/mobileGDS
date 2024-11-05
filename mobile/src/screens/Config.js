import React from "react";
import { Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { buttonStyles } from "../styles/buttons";
import { logout } from '../CallsAPI';
import AsyncStorage from "@react-native-async-storage/async-storage";
import MainMenu from "../components/MainMenu";

const Config = () => {

  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      const username = await AsyncStorage.getItem("username");
      await logout(username);
      navigation.navigate('Login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };
  
  return (
    <MainMenu>
        <Pressable
          style={buttonStyles.buttonfullwidth} onPress={handleLogout}>
          <Text style={buttonStyles.buttonText}>Cerrar sesión</Text>
        </Pressable>
    </MainMenu>
  );
};

export default Config;