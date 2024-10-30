import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ImageBackground, Animated } from 'react-native';

const BackImage = ({ children }) => {

  return (
      <ImageBackground 
        source={require('../../assets/fondo_mobile.jpeg')} 
        style={styles.image} 
        resizeMode="cover" 
      >
        <View style={styles.container}>
          {children}
        </View>
      </ImageBackground>
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
    backgroundColor: 'rgba(249, 253, 220, 0.7)',
    paddingTop: 180,
    padding: 16,
  },
});

export default BackImage;
