import React, { useState } from "react";
import { textStyles } from "../styles/texts";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const OrderWord = () => {
  const [scrambledWord] = useState(["R", "E", "A", "C", "T", "J"]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [availableLetters, setAvailableLetters] = useState(scrambledWord);
  const [lastAddedIndex, setLastAddedIndex] = useState(null);

  // Función para manejar la selección de letra
  const handleLetterPress = (letter, index) => {
    if (selectedLetters.length < scrambledWord.length) {
      setSelectedLetters((prev) => [...prev, letter]);
      // Filtra la letra seleccionada de las disponibles usando el índice del array de disponibles
      setAvailableLetters((prev) => prev.filter((_, i) => i !== index));
      setLastAddedIndex(selectedLetters.length); // Establecer el índice de la última letra agregada
    }
  };

  // Función para manejar la eliminación de la última letra
  const handleRemoveLastLetter = () => {
    if (selectedLetters.length > 0) {
      const updatedLetters = [...selectedLetters];
      const removedLetter = updatedLetters.pop(); // Elimina la última letra
      setSelectedLetters(updatedLetters);
      // Devuelve la letra removida al array de disponibles
      setAvailableLetters((prev) => [...prev, removedLetter]);
      setLastAddedIndex(updatedLetters.length - 1); // Actualizar el índice de la última letra
    }
  };

  return (
    <View style={styles.container}>
      <Text style={textStyles.title}>Encuentra la palabra...</Text>

      {/* Contenedor de casilleros */}
      <View style={styles.slotsContainer}>
        {scrambledWord.map((_, index) => (
          <View key={index} style={styles.slot}>
            <Text style={styles.slotLetter}>
              {selectedLetters[index] ? selectedLetters[index] : ""}
            </Text>
          </View>
        ))}

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center", 
    justifyContent: "center", 
  },
  slotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
    marginTop: 30,
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
    marginTop: 20,
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
    marginTop: 40,
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
