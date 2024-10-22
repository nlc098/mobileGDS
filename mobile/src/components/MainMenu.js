import React from 'react';
import { View, StyleSheet, ImageBackground, Text } from 'react-native';
import HeaderMain from '../components/HeaderMain';
import FooterButtons from '../components/FooterButtons';

const MainMenu = ({ children }) => {
  return (
    <ImageBackground 
      source={require('../../assets/fondo_mobile.jpeg')} 
      style={styles.background} 
      resizeMode="cover" 
    >
      <View style={styles.container}>
        <HeaderMain />

        {/* Verifica que children no contenga texto suelto */}
        {typeof children === 'string' ? <Text>{children}</Text> : children}

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
    backgroundColor: 'rgba(249, 253, 220, 0.8)',
    paddingTop: 180,
    padding: 16,
  },
});

export default MainMenu;
