import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SocketContext } from '../../WebSocketProvider';

const MultipleChoiceMulti = ({ MCinfo }) => {
  const { setAnswer, setIsCorrectAnswer } = useContext(SocketContext);

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [confirmedAnswer, setConfirmedAnswer] = useState(null);
  const [resultMessage, setResultMessage] = useState('');

  const { question, randomCorrectWord, randomWord1, randomWord2, randomWord3 } = MCinfo;

  useEffect(() => {
      setSelectedAnswer(null);
      setConfirmedAnswer(null);
      setResultMessage('');
      setAnswer('');
  }, [MCinfo]);

  const allOptions = [randomCorrectWord, randomWord1, randomWord2, randomWord3];

  const handleCheckAnswer = async (selectedAnswer) => {
    console.log("hola")
      if (!randomCorrectWord) {
          setResultMessage("Este juego aún no fue implementado.");
          return;
      }
      try {
          const isCorrect = selectedAnswer === randomCorrectWord;
          if (isCorrect) {
              setIsCorrectAnswer(isCorrect);
              setResultMessage("¡Correcto!");
          } else {
              setResultMessage("Incorrecto. Intenta de nuevo.");
          }
      } catch (error) {
          console.error("Error al enviar la respuesta:", error);
      }
  };

  const confirmAnswer = () => {
      if (selectedAnswer) {
          setConfirmedAnswer(selectedAnswer); // Confirma la respuesta seleccionada
          handleCheckAnswer(selectedAnswer);
      }
  };

return (
  <View style={styles.container}>
    <Text style={styles.question}>{question}</Text>
        {/* Mostrar el estado actual del juego */}
        {confirmedAnswer && (
      <Text style={[styles.answerText, 
        confirmedAnswer === randomCorrectWord ? styles.correctAnswer : styles.incorrectAnswer]}>
        {confirmedAnswer === randomCorrectWord
          ? '¡Respuesta correcta!'
          : 'Respuesta incorrecta.'}
      </Text>
    )}

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
        onPress={() => setSelectedAnswer(option)} // Solo establece la respuesta seleccionada
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
      onPress={confirmAnswer} // Llama a confirmAnswer al presionar el botón
      disabled={confirmedAnswer !== null} // Deshabilitar botón después de confirmar
    >
      <Text style={styles.confirmButtonText}>Confirmar Opción</Text>
    </TouchableOpacity>
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
    marginBottom: 10,
    textAlign: 'center',
    padding: 10, // Espacio alrededor del texto
    borderWidth: 3, // Borde alrededor del texto
    borderColor: '#653532', // Color del borde
    borderRadius: 8, // Bordes redondeados
    backgroundColor: '#F9F5DC', // Fondo suave para el contraste
    width: '100%', // Aseguramos que ocupe todo el ancho disponible
    fontWeight: 'bold', // Texto en negrita
    color: '#653532', // Color del texto que coincide con el borde
  },
  optionButton: {
    backgroundColor: '#B36F6F',
    width: 300,
    padding: 10,
    borderRadius: 8,
    borderStyle: 'solid',
    borderWidth: 3,
    borderColor: '#653532',
    alignItems: 'center',
    marginTop: 3,
  },
  optionText: {
    color: '#F9F5DC',
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
    backgroundColor: 'green',
  },
  correctOptionText: {
    color: '#fff', 
  },
  incorrectOption: {
    backgroundColor: 'red',
  },
  incorrectOptionText: {
    color: '#fff', 
  },
  confirmButton: {
    backgroundColor: '#653532',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 3,
    borderColor: '#B36F6F', 
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  answerText: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
  correctAnswer: {
    color: '#006400', // Verde oscuro para respuesta correcta
  },
  incorrectAnswer: {
    color: '#8B0000', // Rojo oscuro para respuesta incorrecta
  },
});

export default MultipleChoiceMulti;
