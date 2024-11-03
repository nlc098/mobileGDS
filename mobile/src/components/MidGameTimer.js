// MidGameTimer.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MidGameTimer = ({ timeLeft }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{timeLeft}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo semi-transparente
  },
  timerText: {
    fontSize: 48,
    color: "white",
  },
});

export default MidGameTimer;
