import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Logo from '../../assets/GDS-vertical-logo.png';

const HeaderMain = () => {
  return (
    <View style={styles.header}>
      <Image source={Logo} style={styles.logo} resizeMode="contain" />
      <TouchableOpacity style={styles.settingsButton} onPress={() => { /* Acción aquí si es necesario */ }}>
        <Icon name="settings-outline" size={40} color="#000000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#B36F6F',
    height: 80, // Aproximadamente 1 cm
    justifyContent: 'space-between', // Distribuye el espacio entre el logo y el botón
    alignItems: 'center',
    flexDirection: 'row', // Alinea los elementos horizontalmente
    paddingHorizontal: 10, // Añade un poco de espacio a los lados
    width: '109%', // Asegura que el header ocupe todo el ancho
    position: 'absolute', // Posición absoluta para fijar el header
    top: 0, // Coloca el header en la parte superior
    left: 0, // Asegura que esté alineado a la izquierda
  },
  logo: {
    width: 200, // Ajusta el ancho de la imagen según tus necesidades
    height: '80%', // Ajusta la altura de la imagen para que se ajuste al header
  },
  settingsButton: {
    width: 70, // Ancho del botón
    height: 70, // Alto del botón
    justifyContent: 'center', // Centrar el ícono
    alignItems: 'center', // Centrar el ícono
    backgroundColor: 'transparent', // Hacer el fondo del botón transparente
    borderWidth: 4, // Ancho del borde
    borderColor: '#000000', // Color del borde
    borderRadius: 10, // Bordes redondeados (opcional)
  },
});

export default HeaderMain;
