import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Pressable,Image } from 'react-native';
import HeaderMain from '../components/HeaderMain';
import FooterButtons from '../components/FooterButtons';
import Icon from 'react-native-vector-icons/Ionicons';

import { getUserByUsername } from '../CallsAPI';

const User = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    country: '',
    birthday: '',
    urlPerfil: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserByUsername();
        if (userData && userData.username) {
          const userObject = {
            username: userData.username,
            email: userData.email,
            country: userData.country,
            birthday: `${userData.birthday.dia}/${userData.birthday.mes}/${userData.birthday.anio}`,
            urlPerfil: userData.urlPerfil,
          };
          setUser(userObject);
        } else {
          console.error("No se encontró el usuario");
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <ImageBackground 
      source={require('../../assets/GDS-Words-Footer.png')} 
      style={styles.background} 
      resizeMode="cover" 
    >
      <View style={styles.container}>
        <HeaderMain />

        <Pressable> 
          {user.urlPerfil ? (
            <Image 
              source={{ uri: user.urlPerfil }} 
              style={styles.profileImage}
            />
          ) : (
            <Icon name="person-circle-outline" size={130}/>
          )}
        </Pressable>

        <Text style={styles.changePhotoText}>Tap to change photo</Text>

        <View style={styles.card}>
          <View style={styles.userInfo}>
            <Text style={styles.label}>Nombre de Usuario:</Text>
            <Text style={styles.value}>{user.username}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.label}>Correo Electrónico:</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.label}>País:</Text>
            <Text style={styles.value}>{user.country}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.label}>Cumpleaños:</Text>
            <Text style={styles.value}>{user.birthday}</Text>
          </View>
        </View>

        <FooterButtons />
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
    backgroundColor: 'rgba(249, 253, 220, 0.8)', // Fondo semi-transparente
    paddingTop: 100, // Espacio para el encabezado
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    width: '90%', // Ancho de la "carta"
    backgroundColor: '#F9F5DC', // Fondo blanco semi-transparente
    borderRadius: 10, // Bordes redondeados
    padding: 20, // Espaciado interno
    borderColor: '#000000', // Color del borde negro
    borderWidth: 4, // Grosor del borde
    marginBottom: 20, // Margen inferior
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 2 }, // Desplazamiento de la sombra
    shadowOpacity: 0.1, // Opacidad de la sombra
    shadowRadius: 5, // Difuminado de la sombra
  },

  userInfo: {
    marginBottom: 15,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 20,
    color: '#333',
  },
  changePhotoText: {
    color: "#000",
    marginBottom: 100,
    fontSize: 14,
    fontStyle: "italic",
  },
});

export default User;