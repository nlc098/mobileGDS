import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SocketContext } from '../WebSocketProvider';
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderMain from '../components/HeaderMain';
import { useNavigation,useRoute,useIsFocused  } from '@react-navigation/native';
import {createGame,loadGame,loadGameMulti} from '../CallsAPI'
import { invitationData, setInviteAction, setResponseIdGame,logObject } from '../Helpers';

const GameLobby = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [players, setPlayers] = useState([]); // Lista de jugadores
    const [search, setSearch] = useState(''); // Texto de búsqueda
    const [filteredPlayers, setFilteredPlayers] = useState([]); // Lista de jugadores filtrados
    const { users, client, invitation,setInvitation, setInvitationCollection,gameId, setGameId,suscribeToGameSocket,implementationGameBody,setImplementationGameBody,usernameHost,setUsernameHost} = useContext(SocketContext);
    const [isWaiting, setIsWaiting] = useState(false); // Estado para mostrar la sala de espera
    const [waitingData, setWaitingData] = useState({}); // Datos para la sala de espera
    const [userObj, setUserObj] = useState({}); // Estado para userObj
    const [invitationSent, setInvitationSent] = useState(false);
    const [continuar, setContinuar] = useState(null);
    const route = useRoute();
    const { selectedCategoryID } = route.params;
    const [gameData, setGameData] = useState([]); 

    useEffect(() => {
        return () => {
            setImplementationGameBody(null); // Reinicia el estado al desmontar
            const Host = JSON.stringify(userObj);
            AsyncStorage.setItem('Host', Host);
        };
    }, []);

    useEffect(() => {
        const loadUser = async () => {
          try {
            // Obtener el dato almacenado en AsyncStorage
            const jsonValue = await AsyncStorage.getItem('userObj');
            if (jsonValue != null) {
              const storedUser = JSON.parse(jsonValue); // Parsear el JSON
              setUserObj(storedUser); // Establecer el estado con los datos recuperados
              //console.log('Usuario cargado desde AsyncStorage:', storedUser);
            } else {
              //console.log('No se encontró un usuario en AsyncStorage.');
            }
          } catch (error) {
            console.error('Error al obtener el usuario de AsyncStorage:', error);
          }
        };
    
        loadUser(); // Llamar a la función al montar el componente
      }, []); // Se ejecuta solo al montar
    

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                const response = await loadGame(selectedCategoryID, 'Multiplayer');
                setGameData(response);
            } catch (error) {
                Alert.alert("Error", "No se pudieron cargar los datos del juego");
            }
        };
    
        fetchGameData();
    }, [selectedCategoryID]);
    

    useEffect(() => {
        if (users && userObj.userId) {
            const filteredPlayers = users.filter(player => player.userId !== userObj.userId);
            setPlayers(filteredPlayers);
            setFilteredPlayers(filteredPlayers);
        }
    }, [users, userObj.userId]);

    // Función para manejar la búsqueda
    const handleSearch = (text) => {
        setSearch(text);
        if (text) {
            const filtered = players.filter(player =>
                player.username.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredPlayers(filtered);
        } else {
            setFilteredPlayers(players);
        }
    };


    // 1.1)
    // Enviar la invitación al canal del destinatario del guest
 
    function sendInvitation(userGuest) {
        setInviteAction(userObj.username, userObj.userId, userGuest.userId, `${userObj.username} - Te ha invitado a jugar`);
        client.current.send(`/topic/lobby/${userGuest.userId}`, {}, JSON.stringify(invitationData));
        setUsernameHost(userObj.username);
        const Invitado = JSON.stringify(userObj);
        AsyncStorage.setItem('Guest', Invitado);
        setWaitingData({
            host: { id: userObj.userId, username: userObj.username },
            guest: { id: userGuest.userId, username: null }, // Aún no se conoce el username del invitado
            gameId: 'pendingGameId',
        });
        setIsWaiting(true);
    }

    // 2)
    // Se gestiona que accion realizar dependiendo de la respuesta de la invitacion del socket
    useEffect(() => {
        console.log("1   ", JSON.stringify(invitation, null, 2));
        if (invitation) {
            handleInvitationInteraction(invitation);
            
        }
    }, [invitation]);

    // 2.1)
    const handleInvitationInteraction = (invitation) => {
        if (invitation) {
            console.log("2   ", JSON.stringify(invitation, null, 2));
            if (invitation.action === 'INVITE_RESPONSE') {
                //console.log("Se ha respondido a la invitación!");
                setWaitingData(prev => ({
                    ...prev,
                    guest: { id: invitation.userIdGuest, username: invitation.usernameGuest },
                }));
                handleResponse(invitation);
            }
        } else {
            console.error("Invalid Invitation");
        }
    };

    // 3) solo guest si acepta (esto se gestiona en la vista de invitations)
    // solo si soy host
    // Enviar la respuesta al canal destinatario del guest
    const handleResponse = async (invitation) => {
        console.log("3   ", JSON.stringify(invitation, null, 2));
        if (invitation.accepted) {
            console.log("4   ", JSON.stringify(invitation, null, 2));
            handleCreateGame(invitation); // retorna y seta el gameId
        }
    }

    const handleCreateGame = async (invitation) => {
        console.log("5   ", JSON.stringify(invitation, null, 2));
        console.log(invitation);
        if (invitation.accepted == false) {
            console.log("Invitación rechazada.");
        } else {
            console.log("12345");
            const userHost = {
                username: invitation.usernameHost,
                userId: invitation.userIdHost
            };
    
            const userGuest = {
                username: invitation.usernameGuest,
                userId: invitation.userIdGuest
            };
    
            try {
                // Llamar a la función para crear el juego, pasando los datos del anfitrión e invitado
                const response = await createGame(userHost, userGuest);
                if (response) {
                    console.log("6");
                    const gameId = response;  
                    setGameId(gameId); // Devolver el gameId para usarlo después
                } else {
                    console.error("Error: No se recibió un gameId válido en la respuesta.");
                }
            } catch (error) {
                console.error("Error al crear el juego: ", error);
            }
        }
    
        // Imprimir la respuesta de la invitación para depuración
        //console.log('Respuesta a la invitación:', JSON.stringify(invitation, null, 2));
    };

    useEffect(() => {
        console.log("7      " +gameId);
        if (gameId !== null) {
            console.log("8");
            setResponseIdGame(gameId, "Se ha enviado el id de la partida");
            client.current.send(`/topic/lobby/${invitation.userIdGuest}`, {}, JSON.stringify(invitationData));
            suscribeToGameSocket(gameId);
            setInvitationSent(true);
        }
    }, [gameId]);


    const getRandomItem = (array) => {
        return array[Math.floor(Math.random() * array.length)];
    };
    // Se carga en la BD el inicio de la partida
    const initGameHost = async () => {
        try {
            gameData.finalSlot1 = getRandomItem(gameData.categories[0].gameModes);
            gameData.finalSlot2 = getRandomItem(gameData.categories[1].gameModes);
            gameData.finalSlot3 = getRandomItem(gameData.categories[2].gameModes);
    
            console.log("Datos que se envían al servidor:", JSON.stringify(gameData, null, 2));

            // Llamar a `loadGameMulti` sin esperar un retorno
            await loadGameMulti(gameData, gameId);
            setContinuar(true);
            console.log("El juego se cargó correctamente en el servidor");
        } catch (error) {
            console.error("Error al inicializar el juego:", error.message);
            Alert.alert("Error", "No se pudieron cargar los datos del juego");
        }
    };
    

    // Luego de dar inicio a la partida redirecciona al host a la vista de la ruleta
    useEffect(() => {
        console.log("useEffect ejecutado. implementationGameBody:", implementationGameBody);
        if (continuar) {  
            setContinuar(false);
            if (implementationGameBody) {
                if (implementationGameBody.status === "INVITE_RULETA") {
                    console.log("Estado INVITE_RULETA detectado. Navegando a Home..."+gameId);
                    setTimeout(() => {
                        navigation.navigate("SlotMachineMulti", {
                            
                                ruletaGame: implementationGameBody.ruletaGame,
                                finalSlot1: implementationGameBody.finalSlot1,
                                finalSlot2: implementationGameBody.finalSlot2,
                                finalSlot3: implementationGameBody.finalSlot3,
                                idGame: gameId,
                        
                        });
                    }, 3000);
                }
            }
        }
    }, [continuar, implementationGameBody]);

    // Componente para la sala de espera
    const WaitingRoom = () => (
        <View style={styles.waitingContainer}>
            <Text style={styles.waitingTitle}>Sala de Espera</Text>
            <Text>Host: {waitingData.host.username}</Text>
            <Text>Invitado: {waitingData.guest.username || "Esperando..."}</Text>
            <TouchableOpacity
                style={[styles.startButton, !waitingData.guest.username && styles.disabledButton]}
                onPress={initGameHost}
                disabled={!waitingData.guest.username}
            >
                <Text style={styles.buttonText}>Iniciar partida</Text>
            </TouchableOpacity>
        </View>
    );

    // Renderizar un jugador
    const renderPlayer = ({ item }) => (
        <View style={styles.playerContainer}>
            <View style={styles.playerInfo}>
                <Icon name="account-circle" size={40} color="#77492f" />
                <Text style={styles.playerText}>{item.username}</Text>
            </View>
            <TouchableOpacity style={styles.actionButton} onPress={() => sendInvitation(item)}>
                <Icon name="person-add" size={20} color="#77492f" />
                <Text style={styles.actionText}>Invitar</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <HeaderMain />
            {isWaiting ? (
                <WaitingRoom />
            ) : (
                <>
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
                    </View>
                    <FlatList
                        data={filteredPlayers}
                        renderItem={renderPlayer}
                        keyExtractor={(item) => item.userId.toString()}
                        style={styles.playerList}
                    />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
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
        width: '100%', // Asegura que ocupa el 90% del ancho
        alignSelf: 'center', // Centra el contenedor horizontalmente
    },
    playerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, // Permite que el contenido se expanda dentro del 90%
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
