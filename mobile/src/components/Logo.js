// src/components/Logo.js
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Logo = () => {
  return (
    <View style={styles.logoContainer}>
      <Image
        source={require('../../assets/GDSsimplelogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 300, 
    marginBottom: -20,
    marginTop: -100,
  },
});

export default Logo;
