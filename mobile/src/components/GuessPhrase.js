import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const GuessPhrase = ({ GPinfo, onCorrect, veryfyAnswer }) => {
  const { phrase, correct_word } = GPinfo;
  const [userInput, setUserInput] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    setUserInput('');
    setResultMessage('');
    setIsCorrect(false);
  }, [GPinfo]);

  // Manejo de verificación de respuesta
  const handleCheckAnswer = async () => {
    if (!correct_word) {
        setResultMessage("Este juego aún no fue implementado.");
        return;
    }
    try {
        const response = await veryfyAnswer(userInput.trim().toUpperCase()); 
        if (response) {
          setIsCorrect(true);
          setResultMessage("¡Correcto!");
          await new Promise(resolve => setTimeout(resolve, 1500));
          onCorrect();
        } else {
          setIsCorrect(false);
          setResultMessage("Incorrecto. Intenta de nuevo");
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
      {resultMessage && (
        <Text 
          style={[
            styles.resultMessage, 
            isCorrect ? styles.correctMessage : styles.incorrectMessage
          ]}
        >
          {resultMessage}
        </Text>
      )}         
      <TextInput 
          style={styles.input}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Escribe tu respuesta"
      />
   
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
    color: "#653532",
    fontSize: 25,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#F9F5DC',
    borderWidth: 3,
    borderColor: '#653532',
    width: 300,
    padding: 10,
    marginBottom: 10,
    fontSize: 22,
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
    color: '#F9F5DC',
    fontSize: 18,
    textAlign: 'center',
  },
  resultMessage: {
    marginTop: 5,
    marginBottom: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
  correctMessage: {
    color: '#006400',  // Verde oscuro
  },
  incorrectMessage: {
    color: '#8B0000',  // Rojo oscuro
  },
  containerPhrase: {
    backgroundColor: '#F9F5DC',
    padding: 10,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#653532",
    width: 300,
    marginBottom: 50,
  },
});

export default GuessPhrase;
