import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../CallsAPI";  // Asumimos que esta función maneja la autenticación
import { useSocket } from '../WebSocketProvider';  // Importa el hook de tu contexto
import { buttonStyles } from "../styles/buttons";
import { textStyles } from "../styles/texts";
import BackImage from '../styles/BackImage';

const logo = require("../../assets/GDSsimplelogo.png");

const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { connect } = useSocket();  // Accede a la función connect del contexto

  const handleLogin = async () => {
    try {
      // Realizar login
      const result = await login(username, password);
      if (result && result.token) {
        // Guardar el username en AsyncStorage
        await AsyncStorage.setItem("username", username);

        // Conectar al WebSocket usando el username después de un login exitoso
        connect(username); // Esto establece la conexión WebSocket

        // Navegar a la pantalla 'Home' después de iniciar sesión correctamente
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
    <BackImage>
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
      <Pressable onPress={() => navigation.navigate("RestorePassword")}>
        <Text style={styles.recoverPasswordText}>Recuperar contraseña</Text>
      </Pressable>
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
    </BackImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 3,
    borderRadius: 5,
    borderColor: '#653532',
    width: '100%',
    padding: 10,
    marginBottom: 10,
    fontSize: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 30,
  },
  buttontext: {
    color: "#FFF",
    fontSize: 19,
    textAlign: "center",
    fontWeight: "bold",
  },
  spacer: {
    width: 30,
  },
  logo: {
    width: "90%",
    height: 200,
    width: 300,
    marginBottom: 50,
    marginTop: -50,
    borderRadius: 25,
  },
  recoverPasswordText: {
    color: "#B36F6F",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    textDecorationLine: 'underline',
    marginTop: 10,
  },
});

export default Login;
