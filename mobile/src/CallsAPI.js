import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importar AsyncStorage

const API_URL = "http://192.168.1.9:2024";

// Clase con los endpoints
class ApiService {
  async login(username, password) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "El nombre de usuario y/o la contraseña son incorrectos");
      }

      const data = await response.json();

      // Guardar el token en AsyncStorage
      await AsyncStorage.setItem("userToken", data.token);

      Alert.alert("Login exitoso", "¡Bienvenido!");
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async registrarse(username, email, password, birthday, country, profileImageUrl) {
    try {
      // Asignar imagen por defecto si no se proporciona una
      const defaultImageUrl = "https://w7.pngwing.com/pngs/717/24/png-transparent-computer-icons-user-profile-user-account-avatar-heroes-silhouette-black-thumbnail.png"; // Asegúrate de que esta URL sea accesible
      const imageUrl = profileImageUrl || defaultImageUrl;

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, birthday, country, urlPerfil: imageUrl }), // Cambiado a 'urlPerfil'
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

  // Método para cerrar sesión (borrar el token)
  async logout() {
    try {
      await AsyncStorage.removeItem("userToken"); // Eliminar el token almacenado
      Alert.alert("Sesión cerrada", "Has cerrado sesión con éxito.");
    } catch (error) {
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
  
      const response = await fetch(`${API_URL}/api/admin/${username}`, {
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
   // Método para obtener todas las categorias
   async getCategories() {
    try {
      const token = await this.getToken(); 
      if (!token) {
        throw new Error("Token no encontrado");
      }
  
      const response = await fetch(`${API_URL}/category/api/user`, {
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

// Exportar el método logout
export const logout = async () => {
  try {
    await apiService.logout();
  } catch (error) {
    Alert.alert("Error", error.message);
  }
};

// Exportar el método para obtener el token
export const getToken = async () => {
  try {
    const token = await apiService.getToken();
    return token;
  } catch (error) {
    Alert.alert("Error", error.message);
    return null;
  }
};

// Exportar el método para obtener el usuario por username
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

// Exportar el método para listar categorias
export const getCategories = async () => {
  try {
    const categorias = await apiService.getCategories();
    return categorias;
  } catch (error) {
    console.error("Error al listar categorias", error.message);
    return null;
  }
};
