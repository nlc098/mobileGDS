import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, Pressable, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import HeaderMain from '../components/HeaderMain';
import FooterButtons from '../components/FooterButtons';
import Icon from 'react-native-vector-icons/Ionicons';
import { buttonStyles } from '../styles/buttons';
import { getUserByUsername, editUser } from '../CallsAPI'; // Importa la función de edición

const User = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    country: '',
    birthday: '',
    urlPerfil: '',
  });

  const [isEditing, setIsEditing] = useState(false); // Estado para el modo de edición
  const [newUrlPerfil, setNewUrlPerfil] = useState(''); // Estado para nueva URL de imagen
  const [newPassword, setNewPassword] = useState(''); // Estado para nueva contraseña

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserByUsername();
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
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    fetchUser();
  }, []);

  const handleSaveChanges = async () => {
    try {
      const defaultImage = '../../assets/GDSFavicon.png'; // Ruta de la imagen por defecto
      const imageToUse = newUrlPerfil ? newUrlPerfil : Image.resolveAssetSource(require(defaultImage)).uri;

      // Verifica que la nueva contraseña no esté vacía
      if (newPassword.trim() === '') {
        Alert.alert('Error', 'La contraseña es obligatoria');
        return;
      }

      // Usamos la nueva contraseña
      const passwordToUse = newPassword.trim();

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

        <Pressable>
          {user.urlPerfil ? (
            <Image 
              source={{ uri: user.urlPerfil }} 
              style={styles.profileImage}
              resizeMode="cover"
            />
          ) : (
            <Icon name="person-circle-outline" size={130}/>
          )}
        </Pressable>

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
  buttonText: {
    color: '#007BFF',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', 
  },
  buttonHalfWidth: {
    width: '48%',
  },
  profileImage: {
    width: 130,          
    height: 130,         
    borderRadius: 65,    
    marginBottom: 20,    
    borderWidth: 2,      
    borderColor: '#000', 
  }
});

export default User;
