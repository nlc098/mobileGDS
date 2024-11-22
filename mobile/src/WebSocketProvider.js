import React, { createContext, useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import AsyncStorage from "@react-native-async-storage/async-storage";
import 'text-encoding';

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [invitation, setInvitation] = useState(null);
    const [users, setUsers] = useState([]);
    const [invitationCount, setInvitationCount] = useState(0);
    const [invitationCollection, setInvitationCollection] = useState([]);
    const [isWaiting, setIsWaiting] = useState(false); // Nuevo estado para `isWaiting`
    const [waitingData, setWaitingData] = useState(null); // Nuevo estado para datos de espera
    const [gameId, setGameId] = useState(null);
    const [implementationGameBody, setImplementationGameBody] = useState(null);
    const client = useRef(null);
    const [usernameHost, setUsernameHost] = useState(null);
    const [initGameModes, setInitGameModes] = useState({});
    const [ answer, setAnswer ] = useState(null);
    const [ isCorrectAnswer, setIsCorrectAnswer ] = useState(null);

    useEffect(() => {
        // Guarda los usuarios conectados en AsyncStorage
        AsyncStorage.setItem("connectedUsers", JSON.stringify(users));
    }, [users]);

    // Conexión al servidor WebSocket
    const connect = (dtoUserOnline) => {
        client.current = Stomp.over(() => new SockJS('http://192.168.1.11:8080/ws'));

        if (dtoUserOnline === null) {
            console.error("DtoUserOnline NULL");
            return;
        }

        client.current.connect({}, () => {
            //console.log("Usuario conectado!");

            // Suscripción a usuarios en el lobby
            client.current.subscribe('/topic/lobby', (message) => {
                //console.log(message.body);
                setUsers(JSON.parse(message.body)); 
            });

            // Suscripción a invitaciones de un usuario específico
            client.current.subscribe(`/topic/lobby/${dtoUserOnline.userId}`, (message) => {
                const invitationBody = JSON.parse(message.body);
                //console.log(invitationBody);
                setInvitation(invitationBody);

                // Agregar la invitación a la colección si no está ya en ella
                setInvitationCollection((prev) => {
                    if (!prev.some((inv) => inv.id === invitationBody.id)) {
                        return [...prev, invitationBody];
                    }
                    return prev;
                });
            });

            // Unirse al lobby con el usuario
            client.current.send('/app/join', {}, JSON.stringify(dtoUserOnline));
        });
    };

    // Desconectar del servidor WebSocket
    const disconnect = (dtoUserOnline) => {
        if (client.current) {
            console.log("Usuario desconectado!");
            client.current.send('/app/leave', {}, JSON.stringify(dtoUserOnline));
            client.current.disconnect();
        }
    };

    const suscribeToGameSocket = (gameId) => {
        if (client.current) {
            client.current.subscribe(`/game/${gameId}/`, (message) => {
                const implementGame = JSON.parse(message.body);
                //console.log("Recibido desde el socket: " + JSON.stringify(implementGame, null, 2));
                setImplementationGameBody(implementGame);
            });
        }
        else{
            console.error("Error con el cliente STOMP");
        }
    } 

    return (
        <SocketContext.Provider
            value={{
                connect,
                disconnect,
                users,
                invitation,
                setInvitation,
                client,
                invitationCount,
                setInvitationCount,
                invitationCollection,
                setInvitationCollection,
                isWaiting,  // Pasar el estado isWaiting
                setIsWaiting,  // Pasar la función setIsWaiting
                waitingData, // Pasar los datos de espera
                setWaitingData, // Pasar la función setWaitingData
                gameId, setGameId,
                suscribeToGameSocket,
                implementationGameBody,
                setImplementationGameBody,
                setGameId,
                usernameHost,
                setUsernameHost,
                initGameModes,
                setInitGameModes,
                setAnswer, 
                setIsCorrectAnswer,
                answer,
                isCorrectAnswer, 
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};
