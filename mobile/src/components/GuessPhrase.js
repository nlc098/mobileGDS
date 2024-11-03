import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { GameContext } from "../context/GameContext";

const GuessPhrase = ({ GPinfo, veryfyAnswer }) => {
    const { setAnswer } = useContext(GameContext);
    const { phrase, correct_word } = GPinfo;
    const [userInput, setUserInput] = useState('');
    const [resultMessage, setResultMessage] = useState('');

    useEffect(() => {
      setUserInput('');
      setAnswer('');
    }, [GPinfo]);

    const handleCheckAnswer = () => {
      if (correct_word === null) {
          setResultMessage("Este juego aún no fue implementado.");
      } else {
        setAnswer(userInput.trim().toUpperCase());
        veryfyAnswer();
        // const isCorrect = userInput.trim().toLowerCase() === correct_word.toLowerCase();
        // setResultMessage(isCorrect ? "¡Correcto!" : "Incorrecto. Intenta de nuevo.");
        // if(isCorrect){
        //   onCorrect();
        // }
      }
    };

    // useEffect(() => {
    //   setUserInput('');
    // }, [phrase]);

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