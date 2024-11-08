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

const OrderWord = ({ OWinfo, onCorrect, veryfyAnswer }) => {
  const { word } = OWinfo;
  const [selectedOrder, setSelectedOrder] = useState([[]]);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [resultMessage, setResultMessage] = useState('');

  useEffect(() => {
    const words = word.split(' ');
    const shuffled = words.map(w => shuffleArray(w.split('')));
    setShuffledWords(shuffled);
    setSelectedOrder([[]]);
    setAnswer('');
    setResultMessage('');
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
    const letterIndex = selectedOrder[wordIndex].findIndex(l => l === letter);    
    if (letterIndex !== -1) { 
      setSelectedOrder((prev) => {
        const newSelected = [...prev];
        newSelected[wordIndex].splice(letterIndex, 1);
        return newSelected;
      });
      setShuffledWords(prev => {
        const newWords = [...prev];
        newWords[wordIndex].push(letter);
        return newWords;
      });
    }
  };

  const handleVerify = async () => {
    // Combina las respuestas seleccionadas en una sola cadena
    const selectedStrings = selectedOrder.map(selected => selected.join(''));
    const resultString = selectedStrings.join('');
    setAnswer(resultString);   
    try {
      const sentWordResult = await veryfyAnswer(resultString);
      console.log(sentWordResult); 
      if (sentWordResult) {
        setResultMessage({ text: "¡Correcto!", color: 'darkgreen' });
        await new Promise(resolve => setTimeout(resolve, 1500));
        onCorrect();
      } else {
        setResultMessage({ text: "Incorrecto. Intenta de nuevo", color: 'darkred' });
      }
    } catch (error) {
      console.error("Error al verificar la respuesta:", error);
      setResultMessage({ text: "Error en la verificación. Intenta de nuevo.", color: 'darkred' });
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
      {resultMessage && 
        <Text style={[styles.resultMessage, { color: resultMessage.color }]}>
          {resultMessage.text}
        </Text>
      }
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
    backgroundColor: '#F9F5DC',
    padding: 8, // Reducir padding para hacer los botones más pequeños
    marginTop: 10, // Reducir el espacio entre botones
    margin: 3, // Reducir el margen entre botones
    borderRadius: 5,
    width: '13%',
    maxWidth: 40, // Reducir el tamaño máximo de los botones
    borderWidth: 2,
    borderColor: '#653532',
  },
  buttonText: {
    color: '#653532',
    fontSize: 18, // Ajustar el tamaño de la fuente
    textAlign: 'center',
  },
  selectedOrderContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  selectedOrderButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: '#653532',
    padding: 8, // Reducir padding para los botones seleccionados
    margin: 3, // Reducir margen
    borderRadius: 5,
    width: '13%',
    maxWidth: 40, // Reducir tamaño máximo de los botones seleccionados
    borderWidth: 2,
    borderColor: '#653532',
  },
  selectedButtonText: {
    color: '#F9F5DC',
    fontSize: 18, // Ajustar tamaño de texto
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
  resultMessage: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrderWord;
