import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';

const BackImage = ({ children }) => {
  return (
    <ImageBackground 
      source={require('../../assets/fondo_mobile.jpeg')} 
      style={styles.background} 
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
