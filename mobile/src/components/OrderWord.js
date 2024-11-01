import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { textStyles } from "../styles/texts";

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const OrderWord = ({ OWinfo, onCorrect }) => {
  const { word } = OWinfo;
  const [selectedOrder, setSelectedOrder] = useState([[]]);
  const [shuffledWords, setShuffledWords] = useState([]);


  useEffect(() => {
    const words = word.split(' ');
    const shuffled = words.map(w => shuffleArray(w.split('')));
    setShuffledWords(shuffled);
    setSelectedOrder([[]]);
  }, [OWinfo]);

  const handleLetterPress = (letter, wordIndex) => {
    const letterIndex = shuffledWords[wordIndex].findIndex(l => l === letter);
    if (letterIndex !== -1) {
      setSelectedOrder((prev) => {
        const newSelected = [...prev];
        if (!newSelected[wordIndex]) {
          newSelected[wordIndex] = [];
        }
        newSelected[wordIndex].push(letter);
        return newSelected;
      });
      setShuffledWords(prev => {
        const newWords = [...prev];
        newWords[wordIndex].splice(letterIndex, 1);
        return newWords;
      });
    }
  };

  const handleSelectedPress = (letter, wordIndex) => {
    setSelectedOrder((prev) => {
      const newSelected = [...prev];
      newSelected[wordIndex] = newSelected[wordIndex].filter(l => l !== letter);
      return newSelected;
    });
    setShuffledWords(prev => {
      const newWords = [...prev];
      newWords[wordIndex].push(letter);
      return newWords;
    });
  };

  const handleVerify = () => {
    const selectedStrings = selectedOrder.map(selected => selected.join(''));
    const originalStrings = word.split(' ');

    const isCorrect = selectedStrings.every((selectedString, index) => 
      selectedString === originalStrings[index]
    );

    if (isCorrect) {
      onCorrect();
    } else {
    }
  };

  const handleReset = () => {
    setSelectedOrder([[]]);
    const words = word.split(' ');
    const shuffled = words.map(w => shuffleArray(w.split('')));
    setShuffledWords(shuffled);
  };

  return (
    <View style={styles.container}>
      <Text style={textStyles.title}>Ordena la palabra...</Text>
      <View style={styles.buttonsContainer}>
        {/* Contenedor para botones seleccionados */}
        <View style={styles.selectedOrderContainer}>
          {selectedOrder.map((selectedLetters = [], wordIndex) => (
            <View key={wordIndex} style={styles.selectedOrderButtons}>
              {selectedLetters.map((letter, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.selectedButton} 
                  onPress={() => handleSelectedPress(letter, wordIndex)}
                >
                  <Text style={styles.selectedButtonText}>{letter}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
        {/* Contenedor para botones de letras */}
        {shuffledWords.map((letters, wordIndex) => (
          <View key={wordIndex} style={styles.buttonContainer}>
            {letters.map((letter, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.button} 
                onPress={() => handleLetterPress(letter, wordIndex)}
              >
                <Text style={styles.buttonText}>{letter}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.verifyButtonText}>Verificar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'start',
    alignItems: 'center',
  },
  instruction: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttonsContainer: {
    alignItems: 'center', 
    marginTop: 30,
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#FFFDD0', // Cambiar a un color de contraste
    padding: 10,
    marginTop: 40,
    margin: 5,
    borderRadius: 5,
    width: '13%',
    maxWidth: 50,
    borderWidth: 2, // Añadir borde
    borderColor: '#000', // Color del borde
  },
  buttonText: {
    color: '#000000',
    fontSize: 20,
    textAlign: 'center',
  },
  selectedOrderContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  selectedOrderText: {
    fontSize: 18,
    marginBottom: 10,
  },
  selectedOrderButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: '#1F354A',
    padding: 10,
    margin: 5,
    borderRadius: 5,
    width: '13%',
    maxWidth: 50,
    borderWidth: 2, // Añadir borde
    borderColor: '#000', // Color del borde
  },
  selectedButtonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  verifyButton: {
    backgroundColor: "#B36F6F",
    padding: 15,
    borderRadius: 8,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#653532",
    width: "50%",
    alignItems: "center",
    marginRight: 10,
  },
  resetButton: {
    backgroundColor: "#B36F6F",
    padding: 15,
    borderRadius: 8,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#653532",
    width: "50%",
    alignItems: "center",
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default OrderWord;