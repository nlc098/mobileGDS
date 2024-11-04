import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const GuessPhrase = ({ GPinfo, onCorrect, veryfyAnswer }) => {
  const { phrase, correct_word } = GPinfo;
  const [userInput, setUserInput] = useState('');
  const [resultMessage, setResultMessage] = useState('');

    useEffect(() => {
      setUserInput('');
      setResultMessage('');
    }, [GPinfo]);

  // Manejo de verificación de respuesta
  const handleCheckAnswer = async () => {
    if (!correct_word) {
        setResultMessage("Este juego aún no fue implementado.");
        return;
    }
    const isCorrect = userInput.trim().toUpperCase() === correct_word.toUpperCase();
    try {
        // Aquí puedes enviar la respuesta y manejar el resultado
        const response = await veryfyAnswer(userInput.trim().toUpperCase());  // Guardar el resultado de la función
        console.log(response);
        setResultMessage(isCorrect ? "¡Correcto!" : "Incorrecto. Intenta de nuevo.");
        if (response) {
            onCorrect();  // Llamar a la función que maneja la respuesta correcta
        }
    } catch (error) {
        console.error("Error al enviar la respuesta:", error);
    }
};
    
    return (
      <View style={styles.container}>
          <View style={styles.containerPhrase}>
            {phrase ? (
                <Text style={styles.phrase}>{phrase}</Text>
            ) : (
                <Text>Este juego aún no fue implementado.</Text>
            )}
          </View>              
          <TextInput 
              style={styles.input}
              value={userInput}
              onChangeText={setUserInput}
              placeholder="Escribe tu respuesta"
          />
          {resultMessage && <Text style={styles.resultMessage}>{resultMessage}</Text>}
          <TouchableOpacity style={styles.verifyButton} onPress={handleCheckAnswer}>
            <Text style={styles.verifyButtonText}>Verificar</Text>
          </TouchableOpacity>
      </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'start',
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
    },
    phrase: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    input: {
      backgroundColor: '#FFF',
        borderWidth: 3,
        borderColor: '#653532',
        width: 300,
        padding: 10,
        marginBottom: 10,
        fontSize: 20,
    },
    verifyButton: {
      backgroundColor: "#B36F6F",
      padding: 15,
      borderRadius: 8,
      borderStyle: "solid",
      borderWidth: 2,
      borderColor: "#653532",
      alignItems: "center",
    },
    verifyButtonText: {
      color: '#fff',
      fontSize: 18,
      textAlign: 'center',
    },
    resultMessage: {
      marginBottom: 50,
      fontSize: 15,
    },
    containerPhrase: {
      backgroundColor: '#FFF',
      padding: 10,
      borderRadius: 8,
      borderWidth: 3,
      borderColor: "#653532",
      width: 300,
      marginBottom: 50,
    },
});

export default GuessPhrase;