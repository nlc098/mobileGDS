import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const OrderByDate = ({ infoGame }) => {
    const { infoEvent } = infoGame; // Este debe ser un array de eventos que necesitas ordenar
    const [sortedEvents, setSortedEvents] = useState([]);

    const handleSortEvents = () => {
        if (!infoEvent || infoEvent.length === 0) {
            alert("Este juego aún no fue implementado.");
            return;
        }
        // Aquí debes implementar la lógica de ordenamiento según las fechas
        const sorted = [...infoEvent].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        setSortedEvents(sorted);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ordena los eventos por fecha:</Text>
            <Button title="Ordenar Eventos" onPress={handleSortEvents} />
            {sortedEvents.length > 0 ? (
                sortedEvents.map((event, index) => (
                    <Text key={index} style={styles.event}>{event.event}</Text>
                ))
            ) : (
                <Text>No hay eventos para mostrar.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
    },
    event: {
        fontSize: 16,
        marginVertical: 5,
    },
});

export default OrderByDate;