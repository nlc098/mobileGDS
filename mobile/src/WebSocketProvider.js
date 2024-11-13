import React, { createContext, useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import "text-encoding";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [username, setUsername] = useState('');
    const [users, setUsers] = useState([]);
    const [isInvitationSended, setIsInvitationSended] = useState(false);
    const [isConnected, setIsConnected] = useState(false); // Estado para verificar conexión

    const hostUsername = AsyncStorage.getItem("username");

    useEffect(() => {
        // Si la conexión está activa, podemos enviar invitaciones.
        if (isConnected) {
            console.log("Conexión STOMP establecida.");
        }
    }, [isConnected]);

    const client = Stomp.over(() => new SockJS('http://localhost:8080/ws'));


    const connect = (username) => {
        client.current = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                setIsConnected(true); // Marcar como conectado

                client.current.subscribe('/topic/lobby', message => {
                    setUsers(JSON.parse(message.body)); // Actualizar usuarios conectados
                });
                client.current.publish({
                    destination: '/app/join',
                    body: username
                });

                // Escuchar notificaciones de invitación
                client.current.subscribe("/game/invitations/" + username, (message) => {
                    console.log("invitacion enviada context");
                    const invitation = JSON.parse(message.body);
                    console.log(invitation);
                });

                // Escuchar respuestas a las invitaciones
                client.current.subscribe("/game/invitations/responses/" + username, (message) => {
                    const response = JSON.parse(message.body);
                    console.log(response);
                });
            },
            onDisconnect: () => {
                setIsConnected(false); // Marcar como desconectado
                console.log("Conexión STOMP cerrada.");
            },
            onStompError: (frame) => {
                console.error("Error STOMP:", frame);
            }
        });
        client.current.activate();
    };
    
    const disconnect = (username) => {
        if (client.current) {
            client.current.publish({
                destination: '/app/leave',
                body: username
            });
            client.current.deactivate();
        }
    };

    const sendInvitation = (recipient) => {
        if (!isConnected) {
            console.log("No estás conectado, no se puede enviar la invitación.");
            return;
        }

        const invitation = {
            gameId: "2222",
            fromPlayerId: hostUsername,
            toPlayerId: recipient
        };

        // Enviar la invitación solo si client.current está definido
        if (client.current) {
            client.current.send(`/app/invite/${recipient}`, {}, JSON.stringify(invitation));
            console.log(`Invitación enviada a ${recipient}`);
            setIsInvitationSended(true); // Actualizar estado de invitación enviada
        }
    }

    return (
        <SocketContext.Provider value={{connect, disconnect, sendInvitation, users, isInvitationSended}}>
            {children}
        </SocketContext.Provider>
    );
};
