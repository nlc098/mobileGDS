import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { textStyles } from "../styles/texts"; 

const OrderWord = ({ OWinfo }) => {
  const scrambledWord = OWinfo.hint1.split(""); // Palabras desordenadas
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [availableLetters, setAvailableLetters] = useState(
    scrambledWord.filter(letter => letter !== " ") // Filtrar espacios
  );

  const handleLetterPress = (letter, index) => {
    if (selectedLetters.length < scrambledWord.length) {
      setSelectedLetters((prev) => [...prev, letter]);
      setAvailableLetters((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleRemoveLastLetter = () => {
    if (selectedLetters.length > 0) {
      const updatedLetters = [...selectedLetters];
      const removedLetter = updatedLetters.pop();
      setSelectedLetters(updatedLetters);
      // Si el carácter removido era un espacio, no se hace nada con availableLetters
      if (removedLetter !== " ") {
        setAvailableLetters((prev) => [...prev, removedLetter]);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={textStyles.titleOW}>Encuentra la palabra...</Text>

      {/* Contenedor de casilleros */}
      <View style={styles.slotsContainer}>
        {scrambledWord.map((letter, index) => (
          <View key={index} style={styles.slot}>
            <Text style={styles.slotLetter}>
              {selectedLetters[index] ? selectedLetters[index] : " "}
            </Text>
          </View>
        ))}
      </View>

      {/* Letras desordenadas */}
      <View style={styles.scrambledLettersContainer}>
        {availableLetters.map((letter, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleLetterPress(letter, index)}
            style={styles.letterButton}
          >
            <Text style={styles.letter}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botón para remover la última letra */}
      {selectedLetters.length > 0 && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={handleRemoveLastLetter}
        >
          <Text style={styles.removeButtonText}>Remover letra</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  slotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  slot: {
    borderBottomWidth: 2,
    borderBottomColor: "#333",
    width: 30,
    marginHorizontal: 5,
    alignItems: "center",
  },
  slotLetter: {
    fontSize: 24,
    color: "#333",
  },
  scrambledLettersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  letterButton: {
    margin: 5,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  letter: {
    fontSize: 18,
    color: "#333",
  },
  removeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#ff6666",
    borderRadius: 5,
  },
  removeButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default OrderWord;
