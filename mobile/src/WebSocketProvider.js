import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import 'text-encoding';

// Crear el contexto
export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const client = React.useRef(null);

    // Función para conectar
    const connect = async (username) => {
        if (!isConnected) {
            console.log('Intentando conectar al WebSocket...'); // Log para verificar cuando se intente la conexión
            const socket = new SockJS('http://192.168.1.11:8080/ws'); // URL del WebSocket

            client.current = new Client({
                webSocketFactory: () => socket,
                onConnect: () => {
                    setIsConnected(true); // Marcar como conectado
                    console.log('¡Conexión WebSocket establecida!'); // Log para confirmar la conexión exitosa
                    client.current.subscribe('/topic/lobby', message => {
                        setUsers(JSON.parse(message.body)); // Actualizar usuarios conectados
                        console.log('Usuarios actualizados: ', JSON.parse(message.body)); // Log para ver los usuarios conectados
                    });
                    client.current.publish({
                        destination: '/app/join',
                        body: username
                    });
                    console.log('Enviado mensaje de unión al WebSocket'); // Log después de enviar el mensaje
                },
                onDisconnect: () => {
                    setIsConnected(false); // Desconectado
                    console.log('Conexión WebSocket cerrada'); // Log para desconexión
                },
                onStompError: (error) => {
                    console.log('Error en STOMP:', error); // Log para errores de STOMP
                },
                debug: (str) => console.log('Debug: ', str) // Log para la salida de depuración
            });

            client.current.activate();
        } else {
            console.log('Ya estamos conectados al WebSocket'); // Log cuando ya está conectado
        }
    };

    // Función para desconectar
    const disconnect = () => {
        if (client.current) {
            client.current.deactivate();
            setIsConnected(false);
            console.log('Desconectado del WebSocket'); // Log para cuando se desconecte
        } else {
            console.log('No hay cliente WebSocket activo para desconectar'); // Log si no hay cliente WebSocket
        }
    };

    // Reconectar al iniciar la app si el usuario está autenticado
    useEffect(() => {
        const tryReconnect = async () => {
            const storedUsername = await AsyncStorage.getItem("username"); // Recuperar el username
            if (storedUsername) {
                console.log('Reconectando al WebSocket con el usuario:', storedUsername); // Log para intentar reconectar
                connect(storedUsername); // Reconectar si ya está logueado
            } else {
                console.log('No hay username almacenado, no se puede reconectar'); // Log si no hay username en AsyncStorage
            }
        };

        tryReconnect(); // Ejecutar al iniciar el proveedor

        return () => {
            disconnect(); // Desconectar al cerrar la app
        };
    }, []);

    return (
        <SocketContext.Provider value={{ connect, disconnect, users }}>
            {children}
        </SocketContext.Provider>
    );
};

// Hook personalizado para acceder al contexto
export const useSocket = () => useContext(SocketContext);
