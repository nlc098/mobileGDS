import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native'; 
import Login from './screens/Login';
import RegisterScreen from './screens/Register';
import Home from './screens/Home';
import Page3 from './screens/Page3';
import PerfilUser from './screens/PerfilUser';
import IndividualGameSet from './screens/IndividualGameSet';
import GameSet from './screens/GameSet';
import GameLoad from './screens/GameLoad';
import LoadingGame from './screens/LoadingGame'; 
import GameFinished from './screens/GameFinished';
import Config from './screens/Config';
import RestorePassword from './screens/RestorePassword';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setIsLoggedIn(true); // El usuario está autenticado
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
        name="Page3"
        component={Page3}
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
    </Stack.Navigator>
  );
};

export default AppNavigator;
