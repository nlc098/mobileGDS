import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SocketContext } from '../WebSocketProvider';

const GameLobby = () => {
    const [players, setPlayers] = useState([]); // Lista de jugadores
    const [search, setSearch] = useState(''); // Texto de búsqueda
    const [filteredPlayers, setFilteredPlayers] = useState([]); // Lista de jugadores filtrados
    const { users, sendInvitation } = useContext(SocketContext); // Obtén los usuarios del contexto del WebSocket

    const invitePlayer = (username) => {
        sendInvitation(username);
    }

    // Filtrado de jugadores basado en la búsqueda
    const handleSearch = (text) => {
        setSearch(text);
        if (text) {
            const filtered = players.filter(player =>
                player.toLowerCase().includes(text.toLowerCase()) // Filtra por nombre
            );
            setFilteredPlayers(filtered); // Actualiza la lista filtrada
        } else {
            setFilteredPlayers(players); // Muestra todos los jugadores si no hay búsqueda
        }
    };

    // Actualizar la lista de jugadores cuando los usuarios cambian
    useEffect(() => {
        console.log("Usuarios conectados: ", users);  // Verifica la estructura de los datos
        setPlayers(users);  // Guardamos la lista de usuarios
        setFilteredPlayers(users);  // Actualizamos la lista filtrada cuando 'users' cambia
    }, [users]);


    // Renderizar un jugador en la lista
    const renderPlayer = ({ item }) => {
        return (
            <View style={styles.playerContainer}>
                <View style={styles.playerInfo}>
                    <Icon name="account-circle" size={40} color="#77492f" />
                    {/* Si item es una cadena (nombre del jugador), se renderiza aquí */}
                    <Text style={styles.playerText}>{item}</Text>
                </View>
                <View style={styles.playerActions}>
                    <TouchableOpacity style={styles.actionButton}
                                      onPress={invitePlayer(item)}>
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
                keyExtractor={(item, index) => index.toString()} // Asegúrate de tener un identificador único
                style={styles.playerList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f3d4',
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#77492f',
        textAlign: 'center',
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ede6bc',
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        marginHorizontal: 10,
        color: '#77492f',
    },
    playerList: {
        flex: 1,
    },
    playerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ede6bc',
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
    },
    playerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playerText: {
        marginLeft: 10,
        color: '#77492f',
        fontSize: 16,
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
        fontSize: 14,
        marginLeft: 5,
    },
});

export default GameLobby;
