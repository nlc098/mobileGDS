import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './screens/Login';
import RegisterScreen from './screens/Register';
import Home from './screens/Home';
import User from './screens/User';
import Page3 from './screens/Page3';
import PerfilUser from './screens/PerfilUser';

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
        setLoading(false); // Deja de cargar
      }
    };

    checkSession();
  }, []);

  if (loading) {
    // Puedes mostrar un indicador de carga o una pantalla de bienvenida aquí
    return null;
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
        name="User"
        component={User}
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
    </Stack.Navigator>
  );
};

export default AppNavigator;
