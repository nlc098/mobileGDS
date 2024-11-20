import React, { useState, useEffect,useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SocketContext } from '../../WebSocketProvider';

const GuessPhraseMulti = ({ GPinfo}) => {
	const {setIsCorrectAnswer,isCorrect } = useContext(SocketContext);
	const { phrase, correct_word } = GPinfo;
	const [userInput, setUserInput] = useState('');
	const [resultMessage, setResultMessage] = useState('');

	useEffect(() => {
    setIsCorrectAnswer(false);
		setUserInput('');
		setResultMessage('');
	}, [GPinfo]);

	const handleCheckAnswer = async () => {
        if (correct_word === null) {
            setResultMessage("Este juego aún no fue implementado.");
        } else {
			try {
				const isCorrect = userInput.trim().toLowerCase() === correct_word.toLowerCase();
				console.log(isCorrect ? "Correcto!" : "Incorrecto!");

				if (isCorrect) {
					setIsCorrectAnswer(true);
					setResultMessage("¡Correcto!");
				} else {
					setResultMessage("Incorrecto. Intenta de nuevo.");
				}
			} catch (error) {
				console.error("Error al enviar la respuesta:", error);
				setResultMessage("Hubo un error al verificar la respuesta.");
			}
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

export default GuessPhraseMulti;
