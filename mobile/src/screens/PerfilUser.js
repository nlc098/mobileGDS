import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { View, Text, StyleSheet, ImageBackground, Pressable, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import HeaderMain from '../components/HeaderMain';
import FooterButtons from '../components/FooterButtons';
import Icon from 'react-native-vector-icons/Ionicons';
import { buttonStyles } from '../styles/buttons';
import { getUserByUsername, editUser, getImageProfile } from '../CallsAPI'; // Importa la función de edición
import AsyncStorage from "@react-native-async-storage/async-storage";


const User = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    country: '',
    birthday: '',
    urlPerfil: '',
  });

  const [profileImage, setProfileImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); // Estado para errores

  

  /* const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Se necesita permiso para acceder a las imágenes.",
      );
      return;
    }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    setProfileImage(result.assets[0].uri);
  }
};
*/
  const [isEditing, setIsEditing] = useState(false); // Estado para el modo de edición
  const [newUrlPerfil, setNewUrlPerfil] = useState(''); // Estado para nueva URL de imagen
  const [newPassword, setNewPassword] = useState(''); // Estado para nueva contraseña

  useEffect(() => {

    const fetchUser = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username"); // Obtén el username de AsyncStorage
      if (storedUsername) {
        const userData = await getUserByUsername(storedUsername);
        //const userData = await getUserByUsername();
        if (userData && userData.username) {
          const userObject = {
            username: userData.username,
            email: userData.email,
            country: userData.country,
            birthday: `${userData.birthday.dia}/${userData.birthday.mes}/${userData.birthday.anio}`,
            urlPerfil: userData.urlPerfil,
          };
          
          setUser(userObject);
        } else {
          console.error("No se encontró el usuario");
        }

        } else {
          console.error("No se encontró el username en AsyncStorage");
        }

      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    const fetchProfileImage = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        //const imageData = await getImageProfile(username); // Llama al método de API
        if (storedUsername) {
        const imageData = await getImageProfile(storedUsername); // Llama al método de API
        if (imageData) { 
          const imageUrl = URL.createObjectURL(imageData);
          setProfileImage(imageUrl);
        }
       }
      } catch (error) {
        setErrorMessage(error.message); // Maneja errores
        Alert.alert("Error", error.message); // Muestra un mensaje al usuario
      }
    };

    fetchUser();
    fetchProfileImage();
  }, []);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Se necesita permiso para acceder a las imágenes."
      );
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      setUser((prevUser) => ({
        ...prevUser,
        urlPerfil: result.assets[0].uri,
      }));
    }
  };




  const handleSaveChanges = async () => {
    try {
      const response = await editUser(user.username, passwordToUse, imageToUse);
      const defaultImage = '../../assets/GDSFavicon.png'; // Ruta de la imagen por defecto
      const imageToUse = newUrlPerfil ? newUrlPerfil : Image.resolveAssetSource(require(defaultImage)).uri;

      // Verifica si la respuesta es JSON antes de parsearla
      const data = await response.json().catch((e) => {
      console.error('Error al parsear JSON', e);
      throw new Error('Respuesta no válida');
      });


      // Verifica que la nueva contraseña no esté vacía
      if (newPassword.trim() === '') {
        Alert.alert('Error', 'La contraseña es obligatoria');
        return;
      }
      // Verifica que la url de imagen de perfil sea valida
      if (newUrlPerfil && !isValidUrl(newUrlPerfil)) {
        Alert.alert('Error', 'Por favor ingresa una URL válida para la imagen.');
        return;
      }  

      // Usamos la nueva contraseña
      const passwordToUse = newPassword.trim();

      // Continúa con el flujo de la aplicación si la respuesta es válida
      setUser((prevUser) => ({
        ...prevUser,
        urlPerfil: imageToUse ? imageToUse : prevUser.urlPerfil,
      }));

      if (imageToUse || passwordToUse) {  // Si hay algún cambio en la imagen o la contraseña
        await editUser(user.username, passwordToUse, imageToUse); // Llama a la API con la nueva contraseña
        setUser((prevUser) => ({
          ...prevUser,
          urlPerfil: imageToUse ? imageToUse : prevUser.urlPerfil,
        }));
        Alert.alert('Éxito', 'Los cambios se han guardado correctamente.');
        setIsEditing(false); // Resetea el modo de edición
      } else {
        Alert.alert('Error', 'No se han realizado cambios.');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al guardar los cambios.');
      console.error("Error al actualizar el usuario:", error);
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/GDS-Words-Footer.png')} 
      style={styles.background} 
      resizeMode="cover" 
    >
      <View style={styles.container}>
        <HeaderMain />
        
        <Pressable onPress={handlePickImage} style={styles.profileImageContainer}>
        {user.urlPerfil ? (
        <Image 
          source={{ uri: user.urlPerfil }} 
          style={styles.profileImage} 
        />
      ) : (
        <Icon name="person-circle-outline" size={130} color="#ccc" />
        )}
        </Pressable>
        <Text style={styles.profileImageText}>Seleccionar imagen de perfil</Text>
        {errorMessage && <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>{errorMessage}</Text>}
        <View style={styles.card}>
          {!isEditing ? (
            <>
              <View style={styles.userInfo}>
                <Text style={styles.label}>Nombre de Usuario:</Text>
                <Text style={styles.value}>{user.username}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.label}>Correo Electrónico:</Text>
                <Text style={styles.value}>{user.email}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.label}>País:</Text>
                <Text style={styles.value}>{user.country}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.label}>Cumpleaños:</Text>
                <Text style={styles.value}>{user.birthday}</Text>
              </View>

              <TouchableOpacity style={[buttonStyles.buttonfullwidth, { alignSelf: 'center' }]}>
                <Text style={buttonStyles.buttonText} onPress={() => setIsEditing(true)}>Editar perfil</Text>
              </TouchableOpacity>
            
            </>
          ) : (
            <>
              {/* Campos de edición */}
              <View style={styles.userInfo}>
                <Text style={styles.label}>Nueva URL de Imagen:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Introduce la URL de la nueva imagen"
                  value={newUrlPerfil}
                  onChangeText={setNewUrlPerfil}
                />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.label}>Nueva Contraseña:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Introduce la nueva contraseña"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
              </View>

              {/* Botones para guardar y cancelar en la misma fila */}
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[buttonStyles.buttonfullwidth, styles.buttonHalfWidth]} onPress={handleSaveChanges}>
                  <Text style={buttonStyles.buttonText}>Guardar cambios</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[buttonStyles.buttonfullwidth, styles.buttonHalfWidth]} onPress={() => setIsEditing(false)}>
                  <Text style={[buttonStyles.buttonText, { color: 'red' }]}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <FooterButtons />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 253, 220, 0.8)', // Fondo semi-transparente
    paddingTop: 100, // Espacio para el encabezado
    padding: 16,
  },
  card: {
    width: '90%', // Ancho de la "carta"
    backgroundColor: '#F9F5DC', // Fondo blanco semi-transparente
    borderRadius: 10, // Bordes redondeados
    padding: 20, // Espaciado interno
    borderColor: '#000000', // Color del borde negro
    borderWidth: 4, // Grosor del borde
    marginBottom: 20, // Margen inferior
    elevation: 3, // Sombra para Android
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 2 }, // Desplazamiento de la sombra
    shadowOpacity: 0.1, // Opacidad de la sombra
    shadowRadius: 5, // Difuminado de la sombra
  },
  userInfo: {
    marginBottom: 15,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 20,
    color: '#333',
  },
  changePhotoText: {
    color: "#000",
    marginBottom: 100,
    fontSize: 14,
    fontStyle: "italic",
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 18,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', 
  },
  buttonHalfWidth: {
    width: '48%',
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Para que la imagen no exceda el borde del contenedor
    marginBottom: 20,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileImageText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 8, // Espaciado entre el icono y el texto
    fontStyle: 'italic', // Opcional, para darle un toque decorativo
  },
});

export default User;
