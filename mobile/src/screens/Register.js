import React, { useState } from "react";
import { buttonStyles } from "../styles/buttons";
import { textStyles } from "../styles/texts";
import { registrarse } from "../CallsAPI";
import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  Image,
  Alert,
  ImageBackground,
  View, // Importar View
} from "react-native";

const logo = require("../../assets/GDSsimplelogo.png");
const fondo = require("../../assets/fondo_mobile.jpeg");

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [birthdayYear, setBirthdayYear] = useState("");
  const [birthdayMonth, setBirthdayMonth] = useState("");
  const [birthdayDay, setBirthdayDay] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    username: "",
    country: "",
    birthday: "",
  });

  const validateFields = () => {
    let isValid = true;
    let newErrors = { email: "", password: "", username: "", country: "", birthday: "" };

    if (!email) {
      newErrors.email = "Este campo es requerido";
      isValid = false;
    }
    if (!password) {
      newErrors.password = "Este campo es requerido";
      isValid = false;
    }
    if (!username) {
      newErrors.username = "Este campo es requerido";
      isValid = false;
    }
    if (!country) {
      newErrors.country = "Este campo es requerido";
      isValid = false;
    }
    if (!birthdayYear || !birthdayMonth || !birthdayDay) {
      newErrors.birthday = "La fecha de cumpleaños es requerida";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (validateFields()) {
      const birthday = {
        anio: parseInt(birthdayYear),
        mes: parseInt(birthdayMonth),
        dia: parseInt(birthdayDay),
      };

      const result = await registrarse(username, email, password, birthday, country, profileImage);
      if (result) {
        Alert.alert("Registro exitoso", `Email: ${email}\nUsername: ${username}`);
      }
    }
  };

  return (
    <ImageBackground source={fondo} resizeMode="cover" style={styles.container}>
      <Image source={logo} resizeMode="contain" style={styles.logo} />
      <Text style={textStyles.title}>Registrarse</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

      <TextInput
        style={styles.input}
        placeholder="País"
        value={country}
        onChangeText={setCountry}
      />
      {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}

      {/* Agrupar campos de fecha */}
      <View style={styles.dateContainer}>
        <TextInput
          style={styles.dateInput}
          placeholder="Año"
          value={birthdayYear}
          onChangeText={setBirthdayYear}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.dateInput}
          placeholder="Mes"
          value={birthdayMonth}
          onChangeText={setBirthdayMonth}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.dateInput}
          placeholder="Día"
          value={birthdayDay}
          onChangeText={setBirthdayDay}
          keyboardType="numeric"
        />
      </View>
      {errors.birthday && <Text style={styles.errorText}>{errors.birthday}</Text>}

      <Pressable style={buttonStyles.buttonfullwidth} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </Pressable>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    color: "brown",
    fontWeight: "bold",
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
  errorText: {
    color: "black",
    fontSize: 12,
    marginBottom: 10,
    textAlign: "left",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  logo: {
    width: "90%",
    height: 200,
    marginTop: 20,
    marginBottom: 80,
    borderRadius: 25,
  },
  // Estilos para el contenedor de la fecha
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  dateInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginHorizontal: 5, // Espacio entre inputs
  },
});
