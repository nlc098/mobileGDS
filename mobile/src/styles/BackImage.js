import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ImageBackground, Animated } from 'react-native';

const BackImage = ({ children }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Valor inicial de la animación

  useEffect(() => {
    // Inicia la animación al montar el componente
    Animated.timing(fadeAnim, {
      toValue: 1, // Finaliza en 1 (completamente visible)
      duration: 2000, // Duración de la animación en milisegundos
      useNativeDriver: true, // Habilita el uso del driver nativo para mejor rendimiento
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.background, { opacity: fadeAnim }]}> {/* Aplica la animación aquí */}
      <ImageBackground 
        source={require('../../assets/fondo_mobile.jpeg')} 
        style={styles.image} 
        resizeMode="cover" 
      >
        <View style={styles.container}>
          {children}
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  image: {
    flex: 1, // Asegura que la imagen de fondo ocupe toda la pantalla
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 253, 220, 0.8)',
    paddingTop: 180,
    padding: 16,
  },
});

export default BackImage;
