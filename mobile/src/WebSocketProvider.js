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

    // Stomp client socket
    const client = useRef(null);

    useEffect(() => {
        AsyncStorage.setItem("connectedUsers", JSON.stringify(users));
    }, [users]);

    useEffect(() => {
        if(invitationCollection.length > 0){
            console.log("Nueva invitacion recibida!");
            console.log(invitationCollection);
        }
    }, [invitationCollection]);

    const connect = (dtoUserOnline) => {
        client.current = Stomp.over(() => new SockJS('http://192.168.1.11:8080/ws'));

        if(dtoUserOnline === null){
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

            // Suscripcion a cualquier tipo de invitaciones
            client.current.subscribe(`/topic/lobby/${dtoUserOnline.userId}`, (message) => {
                const invitationBody = JSON.parse(message.body);
                console.log(invitationBody);
                setInvitation(invitationBody);
                //setInvitationCollection(invitationBody);
            });



            // Unirse al lobby con el usuario
            client.current.send('/app/join', {}, JSON.stringify(dtoUserOnline));
        });
    };

    const disconnect = (dtoUserOnline) => {
        if (client.current) {
            console.log("Usuario desconectado!");
            client.current.send('/app/leave', {}, JSON.stringify(dtoUserOnline));
            client.current.disconnect();
        }
    };

    return (
        <SocketContext.Provider value={{ connect, disconnect, users, invitation,setInvitation, client, invitationCount, setInvitationCount, invitationCollection, setInvitationCollection }}>
            {children}
        </SocketContext.Provider>
    );
};
