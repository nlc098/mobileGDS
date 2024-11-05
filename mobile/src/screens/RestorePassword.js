import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Image, StyleSheet } from "react-native";
import { restorePassword } from "../CallsAPI";
import { buttonStyles } from "../styles/buttons";
import { textStyles } from "../styles/texts";
import BackImage from '../styles/BackImage';

const logo = require("../../assets/GDSsimplelogo.png");

const RestorePassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    const response = await restorePassword(email);
    setMessage(response);
  };

  return (
    <BackImage>
      <Image source={logo} resizeMode="contain" style={styles.logo} />
      <Text style={textStyles.title}>Recuperar contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <Pressable style={buttonStyles.buttonhalfwidth} onPress={handleSend}>
        <Text style={styles.buttontext}>Enviar</Text>
      </Pressable>
      {message ? (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      ) : null}
      </BackImage>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#FFF',
    borderWidth: 3,
    borderRadius: 5,
    borderColor: '#653532',
    width: '100%',
    padding: 10,
    marginTop: 30,
    marginBottom: 30,
    fontSize: 20,
  },
  buttontext: {
    color: "#FFF",
    fontSize: 19,
    textAlign: "center",
    fontWeight: "bold",
  },
  logo: {
    width: "90%",
    height: 200,
    marginBottom: 50,
    marginTop: -50,
    borderRadius: 25,
  },
  messageText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 40,
  }
});

export default RestorePassword;
