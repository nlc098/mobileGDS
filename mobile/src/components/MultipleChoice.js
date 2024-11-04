import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { GameContext } from "../context/GameContext";

const MultipleChoice = ({ MOinfo, veryfyAnswer }) => {
  const { setAnswer } = useContext(GameContext);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [confirmedAnswer, setConfirmedAnswer] = useState(null);

  const {
    question,
    randomCorrectWord,
    randomWord1,
    randomWord2,
    randomWord3,
  } = MOinfo;

  useEffect(() => {
    setAnswer('');
  }, [MOinfo]);

  const allOptions = [randomCorrectWord, randomWord1, randomWord2, randomWord3];

  const handleAnswerSelection = (option) => {
    setSelectedAnswer(option);
  };

  const confirmAnswer = () => {
    if (selectedAnswer) {
      setAnswer(selectedAnswer);
      veryfyAnswer();
      setConfirmedAnswer(selectedAnswer);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>

      {/* Mostramos las opciones como botones */}
      {allOptions.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.optionButton,
            selectedAnswer === option && styles.selectedOption, // Estilo para opción seleccionada
            confirmedAnswer && option === randomCorrectWord && styles.correctOption, // Estilo para opción correcta
            confirmedAnswer &&
              selectedAnswer === option &&
              selectedAnswer !== randomCorrectWord &&
              styles.incorrectOption, // Estilo para opción incorrecta
          ]}
          onPress={() => handleAnswerSelection(option)}
          disabled={confirmedAnswer !== null} // Deshabilitar las opciones después de confirmar
        >
          <Text
            style={[
              styles.optionText,
              selectedAnswer === option && styles.selectedOptionText, // Estilo de texto seleccionado
              confirmedAnswer && option === randomCorrectWord && styles.correctOptionText, // Estilo de texto para la opción correcta
              confirmedAnswer &&
                selectedAnswer === option &&
                selectedAnswer !== randomCorrectWord &&
                styles.incorrectOptionText, // Estilo de texto para la opción incorrecta
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Botón de Confirmar Opción con estilos personalizados */}
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={confirmAnswer}
        disabled={confirmedAnswer !== null} // Deshabilitar botón después de confirmar
      >
        <Text style={styles.confirmButtonText}>Confirmar Opción</Text>
      </TouchableOpacity>

      {/* Mostrar el estado actual del juego */}
      {confirmedAnswer && (
        <Text style={styles.answerText}>
          {confirmedAnswer === randomCorrectWord
            ? '¡Respuesta correcta!'
            : 'Respuesta incorrecta.'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  question: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#B36F6F',
    width: 300,
    padding: 15,
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: '#653532',
    alignItems: 'center',
    marginTop: 3,
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  selectedOption: {
    backgroundColor: '#fff',
  },
  selectedOptionText: {
    color: '#653532',
  },
  correctOption: {
    backgroundColor: 'green', // Fondo verde para opción correcta
  },
  correctOptionText: {
    color: '#fff', // Texto blanco para opción correcta
  },
  incorrectOption: {
    backgroundColor: 'red', // Fondo rojo para opción incorrecta
  },
  incorrectOptionText: {
    color: '#fff', // Texto blanco para opción incorrecta
  },
  confirmButton: {
    backgroundColor: '#653532',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 3,
    borderColor: '#B36F6F', // Borde del botón de confirmar
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  answerText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MultipleChoice;
