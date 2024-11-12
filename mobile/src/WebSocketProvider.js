import React, { createContext, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import "text-encoding";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    //const [username, setUsername] = useState('');
    const [users, setUsers] = useState([]);
    const [isInvitationSended] = useState(false);

    const client = React.useRef(null);

    const connect = (username) => {
        const socket = new SockJS('http://192.168.0.106:8080/ws');
        
        client.current = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                client.current.subscribe('/topic/lobby', message => {
                    setUsers(JSON.parse(message.body)); // Actualizar usuarios conectados
                });
                client.current.publish({
                    destination: '/app/join',
                    body: username
                });
                // // Escuchar notificaciones de invitación
                // client.current.subscribe("/game/invitations/" + username, (message) => {
                //     console.log("invitacion enviada context");
                //     const invitation = JSON.parse(message.body);
                //     console.log(invitation);
                //     setIsInvitationSended(true);
                //     //showInvitation(invitation);
                // });

                // // Escuchar respuestas a las invitaciones
                // client.current.subscribe("/game/invitations/responses/" + username, (message) => {
                //     const response = JSON.parse(message.body);
                //     console.log(response);
                //     //handleResponse(response);
                // });
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

    return (
        <SocketContext.Provider value={{connect, disconnect, users, isInvitationSended}}>
            {children}
        </SocketContext.Provider>
    );
};


