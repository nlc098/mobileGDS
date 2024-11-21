import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.0.103:8080/api";

// Función para decodificar el JWT, retorna el userId
const decodeJWT = (token) => {
  try {
    // Paso 1: Separar el JWT en las tres partes (header, payload, signature)
    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new Error('JWT no válido');
    }

    // Paso 2: Decodificar la parte "payload" del JWT
    const payload = parts[1];

    // Base64 URL decode: reemplazamos los caracteres `-` por `+` y `_` por `/` para obtener una decodificación base64 válida
    let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

    // Asegurarnos de que la longitud de la cadena sea múltiplo de 4 para que funcione el decode
    const padding = base64.length % 4;
    if (padding) {
      base64 += '='.repeat(4 - padding); // Agregar el padding necesario
    }

    // Decodificar base64 a texto (utf-8)
    const decodedPayload = atob(base64);

    // Convertir la cadena JSON a un objeto
    return JSON.parse(decodedPayload);

  } catch (error) {
    console.error('Error al decodificar el JWT:', error);
    return null;  // En caso de error, devolvemos null
  }
};

// Clase con los endpoints
class ApiService {
  async login(username, password) {
    try {
      const response = await fetch(`${API_URL}/v1/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || "El nombre de usuario y/o la contraseña son incorrectos");
      // }
  
      const data = await response.json();
      const token = data.token;
      // Paso 1: Decodificar el JWT para obtener el payload
      const jwtDecoded = decodeJWT(token);
      const userId = jwtDecoded.userId
      const email = jwtDecoded.email
     
      // Paso 2: Guardar el JWT y el userId en AsyncStorage
      await AsyncStorage.setItem("userId", userId.toString());
      await AsyncStorage.setItem("email", email.toString());
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("username", username);
      
       // Agrega el usuario a la lista de usuarios conectados usando socket 
       // creo el Dto en lugar del username y id
       const dtoUserOnline = {
            username: username,
            userId: userId,
            email: email
        };
       await AsyncStorage.setItem("userObj", JSON.stringify(dtoUserOnline));
      return data;
  
    } catch (error) {
      throw new Error(error.message);
    }
  }
  
  async registrarse(username, email, password, birthday, country/*, imageUrl*/) {
    try {
      // Asignar imagen por defecto si no se proporciona una
      // const defaultImageUrl = "https://w7.pngwing.com/pngs/717/24/png-transparent-computer-icons-user-profile-user-account-avatar-heroes-silhouette-black-thumbnail.png"; // Asegúrate de que esta URL sea accesible
      // const imageUrl = profileImageUrl || defaultImageUrl;

      const response = await fetch(`${API_URL}/v1/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, birthday, country /*,urlPerfil: imageUrl*/ }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ha ocurrido un error al intentar registrarte.");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

async logout(username) {
  try {
    const token = await this.getToken(); 
    if (!token) {
      throw new Error("Token no encontrado");
    }
    const response = await fetch(`${API_URL}/v1/logout/${username}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al cerrar sesión en el servidor");
    }

    await AsyncStorage.removeItem("userToken"); // Eliminar el token almacenado
  } catch (error) {
    console.error(error.message);
    throw new Error("Error al cerrar sesión");
  }
}

  // Método para obtener el token
  async getToken() {
    try {
      const token = await AsyncStorage.getItem("userToken");
      return token;
    } catch (error) {
      throw new Error("Error al obtener el token");
    }
  }

  // Método para obtener el usuario por username
  async getUserByUsername(username) {
    try {
      
      const token = await this.getToken(); 
      if (!token) {
        throw new Error("Token no encontrado");
      }
  
      const response = await fetch(`${API_URL}/users/v1/${username}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("No se pudo obtener el usuario");
      }
  
      const data = await response.json();  
      return data; // Devolver los datos del usuario
    } catch (error) {
      console.error("Error al obtener el usuario:", error.message); 
      throw new Error(error.message);
    }
  }
  // Método para editar datos del usuario
  async editUser(username, newPassword, imageUri) {
    try {
      const token = await this.getToken(); // Obtener el token del usuario
      if (!token) {
        throw new Error("Token no encontrado");
      }
  
      // Crear el FormData
      const formData = new FormData();
  
      if (newPassword) {
        formData.append("password", newPassword); // Campo del DTO
      }
  
      if (imageUri) {
        formData.append("file", {
          uri: imageUri,
          type: "image/jpeg", // Cambiar según el tipo de archivo seleccionado
          name: "profile_image.jpg",
        });
      }
  
      // Realizar la solicitud
      const response = await fetch(`${API_URL}/users/v1/edit/${username}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // Autorización con el token
          "Content-Type": "multipart/form-data", // Tipo de contenido
        },
        body: formData, // Enviar el formulario
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al editar el usuario");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al editar el usuario:", error.message);
      throw new Error(error.message);
    }
  }
  
   // Método para obtener todas las categorias
   async getCategories() {
    try {
      const token = await this.getToken(); 
      if (!token) {
        throw new Error("Token no encontrado");
      }
  
      const response = await fetch(`${API_URL}/v1/categories-active`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("No se pudieron listar las categorías");
      }
  
      const data = await response.json();  
      return data;
    } catch (error) {
      console.error("Error al obtener las categorias:", error.message); 
      throw new Error(error.message);
    }
  }


  // Método para cargar un juego con las categorías y el modo de juego
  async loadGame(categories, modeGame) {
    try {
      const token = await this.getToken(); // Obtener el token del usuario
      if (!token) {
        throw new Error("Token no encontrado");
      }
      const response = await fetch(`${API_URL}/game-single/v1/load-game`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categories: categories,
          modeGame: modeGame,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al cargar el juego");
      }

      const data = await response.json();
      return data; 
    } catch (error) {
      console.error(error.message);
      throw new Error(error.message);
    }
  }

  // Método para cargar los datos de las fases de juego
  async initgame(userId, categories, modeGames) {
    try {
      const token = await this.getToken(); // Obtener el token del usuario
      if (!token) {
        throw new Error("Token no encontrado");
      }
      const response = await fetch(`${API_URL}/game-single/v1/init-game`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          parCatMod: categories.map((category, index) => ({
            cat: category,
            mod: modeGames[index]
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Error al cargar el juego");
      }

      const data = await response.json();
      return data; 
    } catch (error) {
      console.error(error.message);
    }
  }

  // Setea horario de inicio de partida
  async initPlayGame(idGameSingle) {
    try {
      const token = await this.getToken(); // Obtener el token del usuario
      if (!token) {
        throw new Error("Token no encontrado");
      }
      const response = await fetch(`${API_URL}/game-single/v1/init-play-game/${idGameSingle}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar el juego");
      }
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error(error.message);
    }
  }

  async initgameMulti(idPartida, dtoinitGameMultiRequest) {
    try {
      // Obtener el token del usuario
      const token = await this.getToken();
      if (!token) {
        throw new Error("Token no encontrado");
      }
  
      let { parCatMod } = dtoinitGameMultiRequest;
  
      // Asegurarse de que parCatMod sea un arreglo, incluso si se pasa como objeto
      if (typeof parCatMod === "object" && !Array.isArray(parCatMod)) {
        parCatMod = [parCatMod];  // Convertimos el objeto en un arreglo
      }
  
      // Hacer la solicitud a la API
      const response = await fetch(`${API_URL}/game-multi/v1/start/${idPartida}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idPartida: idPartida,
          parCatMod: parCatMod, // Ahora parCatMod debería ser siempre un arreglo
        }),
      });
  
      // Verificar que la respuesta fue exitosa
      if (!response.ok) {
        throw new Error("Error al cargar el juego");
      }
  
      // Parsear la respuesta JSON
      const data = await response.json();
      return data; // Retornar los datos obtenidos del servidor
    } catch (error) {
      // Manejo de errores
      console.error("Error en la solicitud:", error.message);
      throw new Error(`Error al cargar el juego: ${error.message}`);
    }
  }

  async fetchMultiplayerGame(idGameMulti, dtoinitGameMultiRequest) {
    try {
      const { parCatMod } = dtoinitGameMultiRequest;
      const response = await fetch(`${API_URL}/game-multi/game/${idGameMulti}/start/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idPartida: idGameMulti,
          parCatMod: parCatMod.map((category) => ({
            cat: category.cat,
            mod: category.mod,
          })),
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status}`);
      }
  
      // Si no esperas contenido en la respuesta, solo verifica el estado
      if (response.status === 200) {
        return { message: "Partida iniciada exitosamente" };  // O lo que necesites hacer
      }
  
      // Si esperas respuesta, pero el cuerpo está vacío
      const data = await response.json();  // Solo lo haces si el servidor está enviando datos
      return data;
    } catch (error) {
      throw new Error(`Error al obtener datos del juego: ${error.message}`);
    }
  }

    // Setea horario de inicio de partida
    async finishPlayGame(idGameSingle) {
      try {
        const token = await this.getToken(); // Obtener el token del usuario
        if (!token) {
          throw new Error("Token no encontrado");
        }
        const response = await fetch(`${API_URL}/game-single/v1/finish-play-game/${idGameSingle}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Error al cargar el juego");
        }
        const data = await response.json();
        return data; 
      } catch (error) {
        console.error(error.message);
      }
    }

  async sendAnswer(idGameSingle, userId, gameId, time) {
    try {
      const token = await this.getToken(); // Obtener el token del usuario
      if (!token) {
        throw new Error("Token no encontrado");
      }
      
      const response = await fetch(`${API_URL}/game-single/v1/play-game`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            idGameSingle: idGameSingle,
            idUser: userId,
            response: answer,
            idGame: gameId,
            time_playing: time
          }),
      });

      if (!response.ok) {
        throw new Error("Error al recibit la respuesta");
      }
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error(error.message);
    }
  }

  async sendAnswerMulti(userId, gameId, gameModeId, time) {
    try {
    
      await fetch(`${API_URL}/game-multi/game/${gameId}/play/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Encabezado para indicar que el cuerpo es JSON
        },
        body: JSON.stringify({
          idUserWin: userId,
          idGameMulti: gameId,
          idGame: gameModeId,
          time_playing: time,
        }), // Pasar directamente los datos al cuerpo
      });
  
      console.log('Respuesta enviada correctamente');
    } catch (error) {
      // Manejo de errores
      console.error('Error al enviar respuesta:', error.message);
    }
  }
  

  async restorePassword(email) {
    try {
      const response = await fetch(`${API_URL}/v1/forgot-password/${email}`, {
        method: "POST",
      });

      const data = await response.text();
      return data;

    } catch (error) {
      throw new Error(error.message);
    }
  }
    // Método para crear un juego multijugador
  async createGame(userHost, userGuest) {
    try {
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      const token = await this.getToken(); // Obtener el token del usuario
      if (!token) {
        throw new Error("Token no encontrado");
      }
  
      const response = await fetch(`${API_URL}/game-multi/v1/create/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userHost: {
            username: userHost.username,
            userId: userHost.userId
          },
          userGuest: {
            username: userGuest.username,
            userId: userGuest.userId
          }
        }),
      });
  
      // Imprimir el cuerpo de la respuesta para inspección
      const data = await response.text(); // Obtener la respuesta como texto
  
      return data; // Devolvemos el ID del juego creado (gameid)
  
    } catch (error) {
      console.error("Error al crear el juego:", error.message);
      throw new Error(error.message);
    }
  }
    
  async listGames(idUser) {
    try {
      const token = await this.getToken();
      if (!token) {
        throw new Error("Token no encontrado");
      }
  
      const response = await fetch(`${API_URL}/users/v1/gamesOfPlayer/${idUser}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      // Imprimir el cuerpo de la respuesta para inspección
      const data = await response.json(); // Obtener la respuesta como texto
      return data; // Devolvemos el ID del juego creado (gameid)
  
    } catch (error) {
      console.error("Error al crear el juego:", error.message);
      throw new Error(error.message);
    }
  }

  async loadGameMulti(loadGameData, idSocket) {
    try {
        const token = await this.getToken(); // Obtener el token del usuario
        if (!token) {
            throw new Error("Token no encontrado");
        }

        const response = await fetch(`${API_URL}/game-multi/game/${idSocket}/load-game/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loadGameData),
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            const errorText = await response.text(); // Leer error detallado del servidor
            throw new Error(`Error del servidor: ${errorText || response.status}`);
        }

        console.log("Respuesta del servidor exitosa pero vacía");
        return; // No intentamos analizar el cuerpo
    } catch (error) {
        console.error(error.message);
        throw new Error(error.message);
    }
  }

  async rankingPartidasWin() {
    try {
      const token = await this.getToken();
      if (!token) {
        throw new Error("Token no encontrado");
      }
  
      const response = await fetch(`${API_URL}/users/v1/rankingPartidasWin`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
      return data; 
  
    } catch (error) {
      console.error("Error al crear el juego:", error.message);
      throw new Error(error.message);
    }
  }

  async rankingPuntaje() {
    try {
      const token = await this.getToken();
      if (!token) {
        throw new Error("Token no encontrado");
      }
  
      const response = await fetch(`${API_URL}/users/v1/rankingPuntaje`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json(); 
      return data; 
  
    } catch (error) {
      console.error("Error al crear el juego:", error.message);
      throw new Error(error.message);
    }
  }

  async rankingTiempo() {
    try {
      const token = await this.getToken();
      if (!token) {
        throw new Error("Token no encontrado");
      }
  
      const response = await fetch(`${API_URL}/users/v1/rankingTiempo`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json(); 
      return data;
  
    } catch (error) {
      console.error("Error al crear el juego:", error.message);
      throw new Error(error.message);
    }
  }

  async getImageProfile(username) {
    try {
      const token = await this.getToken(); // Obtener el token del usuario
      if (!token) {
        throw new Error("Token no encontrado");
      }
  
      const response = await fetch(`${API_URL}/users/v1/getImageProfile/${username}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener la imagen");
      }
  
      const data = await response.text(); // Parsear el JSON de la respuesta
      return data; // Supongamos que este contiene la URL de la imagen
  
    } catch (error) {
      console.error("Error4:", error.message);
      throw new Error(error.message);
    }
  }
  
}

const apiService = new ApiService();

// Se hacen endpoints exportables a otros archivos
export const login = async (username, password) => {
  try {
    const data = await apiService.login(username, password);
    return data; 
  } catch (error) {
    Alert.alert("Error", error.message);
    return null;
  }
};

export const registrarse = async (username, email, password, birthday, country, profileImageUrl = null) => {
  try {
    const data = await apiService.registrarse(username, email, password, birthday, country, profileImageUrl);
    return data;
  } catch (error) {
    Alert.alert("Error", error.message);
    return null;
  }
};

export const logout = async (username) => {
    await apiService.logout(username);
};

export const getToken = async () => {
  try {
    const token = await apiService.getToken();
    return token;
  } catch (error) {
    Alert.alert("Error", error.message);
    return null;
  }
};

export const getUserByUsername = async () => {
  try {
    const username = await AsyncStorage.getItem("username"); // Obtener el nombre de usuario almacenado
    if (!username) {
      throw new Error("Nombre de usuario no encontrado");
    }

    const userData = await apiService.getUserByUsername(username); // Llamar a la API con el username
    return userData;
  } catch (error) {
    console.error("Error al obtener el usuario:", error.message);
    return null;
  }
};

export const editUser = async (username, newPassword, newUrlPerfil) => {
  try {
    const data = await apiService.editUser(username, newPassword, newUrlPerfil);
    return data;
  } catch (error) {
    Alert.alert("Error", error.message);
    return null;
  }
};

export const getCategories = async () => {
  try {
    const categorias = await apiService.getCategories();
    return categorias;
  } catch (error) {
    console.error("Error al listar categorias", error.message);
    return null;
  }
};


export const loadGame = async (categories, modeGame) => {
  try {
    const data = await apiService.loadGame(categories, modeGame);
    return data;
  } catch (error) {
    Alert.alert("Error", error.message);
    return null;
  }
};

export const fetchMultiplayerGame = async (idGameMulti,dtoinitGameMultiRequest) => {
  try {
    const data = await apiService.fetchMultiplayerGame(idGameMulti,dtoinitGameMultiRequest);
    return data;
  } catch (error) {
    Alert.alert("Error", error.message);
    return null;
  }
};

export const initGame = async (userId, categories, modeGames) => {
  try {
    const data = await apiService.initgame(userId, categories, modeGames);
    return data;
  } catch (error) {
    Alert.alert("Error", error.message);
    return null;
  }
};

export const initPlayGame = async (idGameSingle) => {
  try {
    const data = await apiService.initPlayGame(idGameSingle);
    return data;
  } catch (error) {
    Alert.alert("Error", error.message);
    return null;
  }
};

export const finishPlayGame = async (idGameSingle) => {
  try {
    const data = await apiService.finishPlayGame(idGameSingle);
    return data;
  } catch (error) {
    Alert.alert("Error", error.message);
    return null;
  }
};

export const sendAnswer = async (idGameSingle, userId, answer, gameId, time) => {
  try {
    const data = await apiService.sendAnswer(idGameSingle, userId, answer, gameId, time);
    return data;
  } catch (error) {
    Alert.alert("Error", error.message);
    return null;
  }
};

export const sendAnswerMulti = async (userId, gameId, gameModeId, time) => {
  try {
    const data = await apiService.sendAnswerMulti(userId, gameId, gameModeId, time);
    return data;
  } catch (error) {
    Alert.alert("Error", error.message);
    return null;
  }
};

  export const restorePassword = async (email) => {
    try {
      const data = await apiService.restorePassword(email);
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Función para verificar si el JWT ha expirado
export const checkTokenExpiration = async (navigation) => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');

    if (userToken) {
      const decodedToken = decodeJWT(userToken); // Decodificamos el JWT para obtener los datos

      if (decodedToken) {
        const currentTime = Math.floor(Date.now() / 1000); // Hora actual en segundos

        // Verificamos si el token ha expirado
        if (decodedToken.exp < currentTime) {
          // El token ha expirado, eliminamos el token y redirigimos a login
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userId');

          // Mostrar alerta y redirigir al login
          Alert.alert('Sesión expirada', 'Tu sesión ha expirado, por favor inicia sesión nuevamente');
          navigation.navigate('Login'); // Redirige a la pantalla de login
        }
      }
    }
  } catch (error) {
    console.error('Error al verificar la expiración del token:', error);
    // En caso de error, redirigimos al login para evitar problemas
    navigation.navigate('Login');
  }
};

export const createGame = async (userHost, userGuest) => {
  try {
    const data = await apiService.createGame(userHost, userGuest);
    return data; 
  } catch (error) {
    Alert.alert("Error", error.message);
    return null;
  }
};

export const listGames = async (idUser) => {
  try {
    const data = await apiService.listGames(idUser);
    return data; 
  } catch (error) {
    Alert.alert("Error", error.message);
    return null;
  }
};

export const loadGameMulti = async (loadGameData, idSocket) => {
  try {
    const data = await apiService.loadGameMulti(loadGameData, idSocket);
    return data;
  } catch (error) {
    Alert.alert("Error", error.message);
    return null;
  }
};

export const initgameMulti = async (idPartida,dtoinitGameMultiRequest) => {
  try {
    const data = await apiService.initgameMulti(idPartida,dtoinitGameMultiRequest);
    return data;
  } catch (error) {
    Alert.alert("Error", error.message);
    return null;
  }
};

export const rankingPartidasWin = async () => {
  try {
    const data = await apiService.rankingPartidasWin();
    return data; 
  } catch (error) {
    Alert.alert("Error", error.message);
    return null;
  }
};

export const rankingPuntaje = async () => {
  try {
    const data = await apiService.rankingPuntaje();
    return data; 
  } catch (error) {
    Alert.alert("Error", error.message);
    return null;
  }
};

export const rankingTiempo = async () => {
  try {
    const data = await apiService.rankingTiempo();
    return data; 
  } catch (error) {
    Alert.alert("Error", error.message);
    return null;
  }
};

export const getImageProfile = async (username) => {
  try {
    const data = await apiService.getImageProfile(username);
    return data;
  } catch (error) {
    Alert.alert("Error", error.message);
    return null;
  }
};