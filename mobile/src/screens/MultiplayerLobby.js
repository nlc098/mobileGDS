import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SocketContext } from '../WebSocketProvider';
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderMain from '../components/HeaderMain';
import { useNavigation } from '@react-navigation/native';
import { createGame } from '../CallsAPI';

const GameLobby = () => {
    const [players, setPlayers] = useState([]); // Lista de jugadores
    const [search, setSearch] = useState(''); // Texto de búsqueda
    const [filteredPlayers, setFilteredPlayers] = useState([]); // Lista de jugadores filtrados
    const { users, client, invitation, invitationCount, setInvitationCount, invitationCollection, setInvitationCollection } = useContext(SocketContext);
    const [gameId, setGameId] = useState('');
    const [isHost, setIsHost] = useState(false);
    const [userObj, setUserObj] = useState({}); // Estado para userObj
    const navigation = useNavigation();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = await AsyncStorage.getItem("userId");
                const username = await AsyncStorage.getItem("username");
                const userObjString = await AsyncStorage.getItem("userObj");
    
                const parsedUserObj = userObjString ? JSON.parse(userObjString) : { username: '', userId: '' };
    
                setUserObj(parsedUserObj);  // Actualiza el estado de userObj con los datos obtenidos
            } catch (error) {
                console.error("Error obteniendo los datos del usuario:", error);
            }
        };
    
        fetchUserData();
    }, []);

    // Remover elementos de AsyncStorage
    useEffect(() => {
        const clearStorage = async () => {
            try {
                await AsyncStorage.removeItem("guest");
                await AsyncStorage.removeItem("host");
            } catch (error) {
                console.error("Error limpiando el AsyncStorage:", error);
            }
        };

        clearStorage(); // Llamada para limpiar el storage
    }, []);

    // Efecto para manejar invitaciones
    useEffect(() => {
        if (invitationCollection.length > 0) {
            console.log("Nueva invitación recibida!");
            console.log(invitationCollection);
        }
    }, [invitationCollection]);

    const invitationData = {
        action: "",          // INVITE, INVITE_RESPONSE, RESPONSE_IDGAME
        userIdHost: "",      // INVITE, INVITE_RESPONSE, RESPONSE_IDGAME
        usernameHost: "",    // INVITE
        userIdGuest: "",     // INVITE, INVITE_RESPONSE, RESPONSE_IDGAME
        usernameGuest: "",   // INVITE, INVITE_RESPONSE
        gameId: "",          // RESPONSE_IDGAME
        accepted: null,      // INVITE_RESPONSE, RESPONSE_IDGAME
        message: "",         // INVITE, INVITE_RESPONSE
    };

    // Función para actualizar la invitación
    function setInviteAction(usernameHost, userIdHost, userIdGuest, message) {
        invitationData.action = "INVITE";
        invitationData.userIdHost = userIdHost;
        invitationData.usernameHost = usernameHost;
        invitationData.userIdGuest = userIdGuest;
        invitationData.message = message;
        console.log('Datos de la invitación actualizados:', invitationData);
    }

    // Función para actualizar la respuesta del ID de la partida
    function setResponseIdGame(idGame, message) {
        invitationData.action = "RESPONSE_IDGAME";
        invitationData.gameId = idGame;
        invitationData.message = message;
        console.log('Respuesta actualizada:', invitationData);
    }


    // Filtrado de jugadores basado en la búsqueda por username
    const handleSearch = (text) => {
        setSearch(text);
        if (text) {
            const filtered = players.filter(player =>
                player.username.toLowerCase().includes(text.toLowerCase()) // Filtra por 'username'
            );
            setFilteredPlayers(filtered); // Actualiza la lista filtrada
        } else {
            setFilteredPlayers(players); // Muestra todos los jugadores si no hay búsqueda
        }
    };

    useEffect(() => {
        console.log("Usuarios conectados: ", users);  // Verifica la estructura de los datos
        // Filtra al jugador actual de la lista
        const filteredPlayers = users.filter(player => player.userId !== userObj.userId);
        setPlayers(filteredPlayers);  // Guardamos la lista de objetos userObj sin el jugador actual
        setFilteredPlayers(filteredPlayers);  // Actualizamos la lista filtrada cuando 'users' cambia
    }, [users, userObj.userId]);
    

    useEffect(() => {
        if (invitation) {
            console.log("hola")
            handleInvitationInteraction(invitation);
        }
    }, [invitation]);

    const handleInvitationInteraction = (invitation) => {
        if (invitation) {
            console.log(invitation.action);
            switch (invitation.action) {
                case 'INVITE':
                    console.log("Se ha realizado una invitacion!");
                    setInvitationCount(invitationCount+1);
                    setInvitationCollection([...invitationCollection, invitation]);
                    console.log(invitation);
                    break;

                case 'INVITE_RESPONSE':
                    console.log("Se ha respondido a la invitacion!");
                    handleResponse(invitation);
                    break;

                case 'RESPONSE_IDGAME':
                    console.log("Se iniciara la partida!");
                    client.current.subscribe(`/topic/game/${invitation.idGame}`);
                    /*setTimeout(() => {
                        navigate(PUBLIC_ROUTES.SELECTION_PHASE);
                    }, 3000); // 3000 ms para esperar 3 segundos adicionales*/
                    break;

                default:
                    console.warn("Action type not recognized:", buttonKey);
            }
        } else {
            console.error("Invalid Invitation");
        }
    };

    // Enviar la invitación al canal del destinatario del guest
    function sendInvitation(userIdGuest) {
        if (userObj.username && userObj.userId) {
            setInviteAction(userObj.username, userObj.userId, userIdGuest, `${userObj.username} - Te ha invitado a jugar`);
            client.current.send(`/topic/lobby/${userIdGuest}`, {}, JSON.stringify(invitationData));
            setIsHost(true);
    
            // Redirigir al host a la sala de espera
           // navigation.navigate('Waiting'); // Asegúrate de que 'WaitingScreen' sea el nombre correcto de la pantalla de espera
        } else {
            console.error("userObj no está definido correctamente");
        }
    }
    
    const handleResponse = (invitation) => {
        // Verificar si la invitación fue aceptada o rechazada
        if (invitation.accepted === false) {
          console.log("Invitación rechazada.");
        } else {
          // Si la invitación es aceptada, continuamos con la creación del juego
          console.log("Invitación aceptada. Continuando con el juego.");
      
          // Extraemos los datos necesarios de la invitación
          const userHost = {
            username: invitation.usernameHost,
            userId: invitation.userIdHost
          };
      
          const userGuest = {
            username: invitation.usernameGuest,
            userId: invitation.userIdGuest
          };
      
          // Llamar a la función para crear el juego, pasando los datos del anfitrión e invitado
          console.log("hola")
          createGame(userHost, userGuest)
            .then(response => {
              if (response) {
                const gameId = response;
                console.log("Juego creado con éxito! ID del juego: ", gameId);
      
                // Enviar el mensaje de creación del juego a través del WebSocket
                const messageSocket = {
                  gameId: gameId,
                  userHost: userHost,
                  userGuest: userGuest
                };
      
                console.log("Datos para WebSocket -> ", JSON.stringify(messageSocket, null, 2));
                client.current.send("/app/game/create", {}, JSON.stringify(messageSocket)); // Enviar mensaje al WebSocket
              } else {
                console.error("Error: No se recibió un gameid válido en la respuesta.");
              }
            })
            .catch(error => {
              console.error("Error al crear el juego: ", error);
            });
        }
      
        // Imprimir la respuesta de la invitación para depuración
        console.log('Respuesta a la invitación:', invitation);
      };
      
    
    
// Renderizar un jugador en la lista
const renderPlayer = ({ item }) => {
    return (
        <View style={styles.playerContainer}>
            <View style={styles.playerInfo}>
                <Icon name="account-circle" size={40} color="#77492f" />
                {/* Envuelve 'item.username' dentro de un componente <Text> */}
                <Text style={styles.playerText}>{item.username}</Text> 
            </View>
            <View style={styles.playerActions}>
                <TouchableOpacity style={styles.actionButton}
                    onPress={() => sendInvitation(item.userId)}>
                    <Icon name="person-add" size={20} color="#77492f" />
                    <Text style={styles.actionText}>Invitar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                    <Icon name="info" size={20} color="#77492f" />
                    <Text style={styles.actionText}>Detalles</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

    return (
        <View style={styles.container}>
            <HeaderMain />
            <Text style={styles.title}>Game Lobby</Text>
            <View style={styles.searchContainer}>
                <Icon name="search" size={24} color="#77492f" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar..."
                    placeholderTextColor="#77492f"
                    value={search}
                    onChangeText={handleSearch}
                />
                <Icon name="filter-list" size={24} color="#77492f" />
                <Icon name="sort" size={24} color="#77492f" />
            </View>
            <FlatList
                data={filteredPlayers} // Usamos los jugadores filtrados
                renderItem={renderPlayer} // Usamos la función renderPlayer
                keyExtractor={(item) => item.userId.toString()} // Usamos 'userId' como clave única
                style={styles.playerList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        backgroundColor: '#f6f3d4',
        paddingHorizontal: 16,
        marginTop: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#77492f',
        textAlign: 'center',
        marginTop:80,
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ede6bc',
        padding: 8,
        borderRadius: 10,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        color: '#77492f',
        fontSize: 16,
        marginHorizontal: 10,
    },
    playerList: {
        marginTop: 20,
    },
    playerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#fff1d0',
        borderRadius: 8,
        marginBottom: 10,
    },
    playerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playerText: {
        fontSize: 18,
        color: '#77492f',
        marginLeft: 10,
    },
    playerActions: {
        flexDirection: 'row',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    actionText: {
        color: '#77492f',
        fontSize: 12,
    },
});

export default GameLobby;
