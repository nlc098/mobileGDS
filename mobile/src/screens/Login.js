import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Image, ImageBackground, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../CallsAPI";
import { buttonStyles } from "../styles/buttons";
import { textStyles } from "../styles/texts";

const logo = require("../../assets/GDSsimplelogo.png");
const fondo = require("../../assets/fondo_mobile.jpeg");

const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      console.log(`Datos de inicio de sesión: 
        Username: ${username} 
        Password: ${password}`); // Formatear el log para mostrar los datos
      const result = await login(username, password);
      if (result && result.token) {
        // Guardar el token y el nombre de usuario en AsyncStorage
        await AsyncStorage.setItem("userToken", result.token);
        await AsyncStorage.setItem("username", username);
        navigation.navigate("Home");
      } else {
        alert("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Error al iniciar sesión. Por favor, inténtelo de nuevo.");
    }
  };

  return (
    <ImageBackground source={fondo} resizeMode="cover" style={styles.container}>
      <Image source={logo} resizeMode="contain" style={styles.logo} />
      <Text style={textStyles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Pressable style={buttonStyles.buttonhalfwidth} onPress={handleLogin}>
          <Text style={styles.buttontext}>Iniciar sesión</Text>
        </Pressable>
        <View style={styles.spacer} />
        <Pressable
          style={buttonStyles.buttonhalfwidth}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.buttontext}>Registrarse</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  buttontext: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  spacer: {
    width: 50,
  },
  logo: {
    width: "90%",
    height: 200,
    marginBottom: 80,
    marginTop: 20,
    borderRadius: 25,
  },
});

export default Login;
