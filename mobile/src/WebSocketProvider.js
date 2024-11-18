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

    const client = useRef(null);

    useEffect(() => {
        // Guarda los usuarios conectados en AsyncStorage
        AsyncStorage.setItem("connectedUsers", JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        if (invitationCollection.length > 0) {
            console.log("Nueva invitación recibida!");
            console.log(invitationCollection);
        }
    }, [invitationCollection]);

    // Conexión al servidor WebSocket
    const connect = (dtoUserOnline) => {
        client.current = Stomp.over(() => new SockJS('http://192.168.56.1:8080/ws'));

        if (dtoUserOnline === null) {
            console.error("DtoUserOnline NULL");
            return;
        }

        client.current.connect({}, () => {
            console.log("Usuario conectado!");

            // Suscripción a usuarios en el lobby
            client.current.subscribe('/topic/lobby', (message) => {
                console.log(message.body);
                setUsers(JSON.parse(message.body)); 
            });

            // Suscripción a invitaciones de un usuario específico
            client.current.subscribe(`/topic/lobby/${dtoUserOnline.userId}`, (message) => {
                const invitationBody = JSON.parse(message.body);
                console.log(invitationBody);
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

    // Función para manejar la respuesta a las invitaciones (Aceptar o Rechazar)
    const handleInvitationResponse = async (invitationId, accepted) => {
        const updatedInvitationCollection = invitationCollection.filter(
            (invitation) => invitation.id !== invitationId
        );
        setInvitationCollection(updatedInvitationCollection);

        // Eliminar de AsyncStorage también si es necesario
        await AsyncStorage.setItem('invitations', JSON.stringify(updatedInvitationCollection));

        if (accepted) {
            console.log('Invitación aceptada');
        } else {
            console.log('Invitación rechazada');
        }

        // Aquí podrías enviar la respuesta al servidor si fuera necesario
        // Ejemplo de mensaje que podrías enviar:
        const invitationResponse = {
            action: "INVITE_RESPONSE",
            invitationId,
            accepted,
        };

        if (client.current) {
            client.current.send(`/topic/lobby/${invitation.userIdHost}`, {}, JSON.stringify(invitationResponse));
        }
    };

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
                handleInvitationResponse,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};
