import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

import Login from './screens/Login';
import RegisterScreen from './screens/Register';
import Home from './screens/Home';
import Statistics from './screens/Statistics';
import PerfilUser from './screens/PerfilUser';
import IndividualGameSet from './screens/IndividualGameSet';
import MultiplayerGameSet from './screens/MultiplayerGameSet';
import MultiplayerLobby from './screens/MultiplayerLobby';
import GameSet from './screens/GameSet';
import GameLoad from './screens/GameLoad';
import LoadingGame from './screens/LoadingGame';
import GameFinished from './screens/GameFinished';
import Config from './screens/Config';
import RestorePassword from './screens/RestorePassword';
import InvitationScreen from './screens/InvitationScreen';
import Waiting from './screens/Waiting';
import GameLoadMulti from './screens/multi/GameLoadMulti';
import GuessPhraseMulti from './screens/multi/GuessPhraseMulti';
import LoadingGameMulti from './screens/multi/LoadingGameMulti';
import MultipleChoiceMulti from './screens/multi/MultipleChoiceMulti';
import OrderWordMulti from './screens/multi/OrderWordMulti';
import SlotMachineMulti from './screens/multi/SlotMachineMulti';
import GameFinishedMulti from './screens/multi/GameFinishedMulti';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        
        if (token) {
          // Decodificar y verificar el token
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const adjustedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
          const jsonPayload = decodeURIComponent(
            atob(adjustedBase64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          
          const decodedToken = JSON.parse(jsonPayload);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp && decodedToken.exp > currentTime) {
            setIsLoggedIn(true); // Token válido
          } else {
            await AsyncStorage.removeItem('userToken');
            setIsLoggedIn(false); // Token expirado
          }
        } else {
          setIsLoggedIn(false); // No hay token
        }
      } catch (error) {
        console.error('Error al verificar la sesión:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) {
    // Muestra un indicador de carga mientras se verifica la sesión
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Muestra Login o Home dependiendo del estado de autenticación
  return (
    <Stack.Navigator initialRouteName={isLoggedIn ? 'Home' : 'Login'}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Statistics"
        component={Statistics}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PerfilUser"
        component={PerfilUser}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="IndividualGameSet"
        component={IndividualGameSet}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="MultiplayerGameSet"
        component={MultiplayerGameSet}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MultiplayerLobby"
        component={MultiplayerLobby}
        options={{ 
          headerShown: false,
          unmountOnBlur: true, // Desmontar el componente al salir
        }}
      />
      <Stack.Screen
        name="GameSet"
        component={GameSet}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GameLoad"
        component={GameLoad}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoadingGame"
        component={LoadingGame}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GameFinished"
        component={GameFinished}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Config"
        component={Config}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RestorePassword"
        component={RestorePassword}
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="InvitationScreen"
        component={InvitationScreen}
        options={{ headerShown: false }}
      />
         <Stack.Screen
        name="Waiting"
        component={Waiting}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GameLoadMulti"
        component={GameLoadMulti}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GuessPhraseMulti"
        component={GuessPhraseMulti}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoadingGameMulti"
        component={LoadingGameMulti}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MultipleChoiceMulti"
        component={MultipleChoiceMulti}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderWordMulti"
        component={OrderWordMulti}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SlotMachineMulti"
        component={SlotMachineMulti}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GameFinishedMulti"
        component={GameFinishedMulti}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
