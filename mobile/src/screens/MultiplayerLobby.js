import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const GameLobby = () => {
    const [players, setPlayers] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredPlayers, setFilteredPlayers] = useState([]);

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        // Simulación de llamada al endpoint para obtener los usuarios conectados
        const fetchedPlayers = [
            { id: 1, name: 'pepe' },
            { id: 2, name: 'user' },
            // Agrega más usuarios según sea necesario
        ];
        setPlayers(fetchedPlayers);
        setFilteredPlayers(fetchedPlayers);
    };

    const handleSearch = (text) => {
        setSearch(text);
        if (text) {
            const filtered = players.filter(player => 
                player.name.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredPlayers(filtered);
        } else {
            setFilteredPlayers(players);
        }
    };

    const renderPlayer = ({ item }) => (
        <View style={styles.playerContainer}>
            <View style={styles.playerInfo}>
                <Icon name="account-circle" size={40} color="#77492f" />
                <Text style={styles.playerText}>#{item.id} {item.name}</Text>
            </View>
            <View style={styles.playerActions}>
                <TouchableOpacity style={styles.actionButton}>
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
                data={filteredPlayers}
                renderItem={renderPlayer}
                keyExtractor={(item) => item.id.toString()}
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
