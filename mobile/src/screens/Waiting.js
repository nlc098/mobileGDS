import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { SocketContext } from '../WebSocketProvider';  // Para manejar el WebSocket
import { useNavigation } from '@react-navigation/native';  // Para la navegación

const Waiting = () => {
    const [hostReady, setHostReady] = useState(false);
    const [guestReady, setGuestReady] = useState(false);
    const [hostUsername, setHostUsername] = useState('');  // Estado para el nombre de usuario del host
    const [guestUsername, setGuestUsername] = useState('');  // Estado para el nombre de usuario del invitado
    const { client, gameId, userObj } = useContext(SocketContext);  // Obtén los datos del contexto
    const navigation = useNavigation();

    useEffect(() => {
        // Suponiendo que los datos del host y guest están disponibles en el contexto de WebSocket
        if (userObj && userObj.username) {
            setHostUsername(userObj.username);  // Setea el nombre del host desde el contexto
        }

        // Escuchar cuando el host y el invitado estén listos
        client.current.subscribe(`/topic/game/`, (message) => {
            const data = JSON.parse(message.body);

            if (data.action === 'HOST_READY') {
                setHostReady(true);
            } else if (data.action === 'GUEST_READY') {
                setGuestReady(true);
                setGuestUsername(data.usernameGuest);  // Asigna el nombre del invitado
            }

            // Iniciar la partida cuando ambos estén listos
            if (hostReady && guestReady) {
                navigation.navigate('GameScreen'); // Redirige a la pantalla del juego
            }
        });

        return () => {
            client.current.unsubscribe(`/topic/game/`);
        };
    }, [gameId, hostReady, guestReady, client, navigation, userObj]);

    // Función que el invitado puede usar para indicar que está listo
    const handleGuestReady = () => {
        client.current.send(`/app/game/${gameId}`, {}, JSON.stringify({ action: 'GUEST_READY' }));
        setGuestReady(true);
    };

    // Función que el host puede usar para indicar que está listo
    const handleHostReady = () => {
        client.current.send(`/app/game/${gameId}`, {}, JSON.stringify({ action: 'HOST_READY' }));
        setHostReady(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Esperando a que ambos jugadores estén listos</Text>
            <View style={styles.playersContainer}>
                <Text style={styles.playerText}>Host: {hostUsername} {hostReady ? 'Listo' : 'Esperando...'}</Text>
                <Text style={styles.playerText}>Invitado: {guestUsername ? guestUsername : 'Esperando...'} {guestReady ? 'Listo' : 'Esperando...'}</Text>
            </View>
            <View style={styles.buttonsContainer}>
                {!hostReady && (
                    <Button title="Host está listo" onPress={handleHostReady} />
                )}
                {!guestReady && (
                    <Button title="Invitado está listo" onPress={handleGuestReady} />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    playersContainer: {
        marginBottom: 20,
    },
    playerText: {
        fontSize: 16,
        marginBottom: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
});

export default Waiting;
