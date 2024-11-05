import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const FooterButtons = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Función para determinar si el botón es el actual
  const isCurrentRoute = (routeName) => {
    return route.name === routeName;
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={[styles.button, isCurrentRoute('PerfilUser') && styles.activeButton]} 
        onPress={() => navigation.navigate('PerfilUser')}
      >
        <Icon name="person-circle" size={35} color={isCurrentRoute('PerfilUser') ? '#B36F6F' : '#3B3B3B'} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, isCurrentRoute('Home') && styles.activeButton]} 
        onPress={() => navigation.navigate('Home')}
      >
        <Icon name="home" size={35} color={isCurrentRoute('Home') ? '#B36F6F' : '#3B3B3B'} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, isCurrentRoute('Page3') && styles.activeButton]} 
        onPress={() => navigation.navigate('Page3')}
      >
        <Icon name="bar-chart" size={35} color={isCurrentRoute('Page3') ? '#B36F6F' : '#3B3B3B'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#653532',
    padding: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 2,
    borderColor: '#3B3B3B',
  },
  button: {
    flex: 1,
    margin: 0,
    backgroundColor: '#FAE8D6', // Color de fondo tipo papel
    borderColor: '#3B3B3B',
    borderWidth: 2,
    borderRadius: 10, // Bordes redondeados
    alignItems: 'center',
    padding: 40,
    shadowColor: '#000', // Sombra
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Elevación en Android
  },
  activeButton: {
    backgroundColor: 'white',
  },
  buttonText: {
    color: '#3B3B3B', // Color del texto del botón
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5, // Espacio entre el icono y el texto
  },
  activeButtonText: {
    color: 'beige', // Color del texto para el botón activo
  },
});

export default FooterButtons;
