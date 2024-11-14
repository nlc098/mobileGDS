import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SocketContext } from '../WebSocketProvider'; // Importa el contexto de tu WebSocket
import { useNavigation } from '@react-navigation/native';

const InvitationScreen = () => {
  const [invitations, setInvitations] = useState([]);
  const { invitation, client  } = useContext(SocketContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (invitation && invitation.usernameHost && invitation.userIdHost) {
      console.log("Nueva invitación recibida:", invitation);
      setInvitations((prevInvitations) => [
        ...prevInvitations,
        { 
          id: invitation.id || Date.now().toString(),
          usernameHost: invitation.usernameHost, 
          message: invitation.message, 
          userIdHost: invitation.userIdHost,
          userIdGuest: invitation.userIdGuest,
          status: 'Pendiente' 
        }
      ]);
    }
  }, [invitation]);
  

  // Función para actualizar la respuesta de la invitación y enviarla por WebSocket
  const setInviteResponse = async (accepted, invitation) => {
    try {
      const usernameGuest = await AsyncStorage.getItem("username");

      if (!usernameGuest) {
        console.log("No se encontró el nombre de usuario del invitado en AsyncStorage.");
        return;
      }

      const invitationData = {
        action: "INVITE_RESPONSE",
        userIdHost: invitation.userIdHost, // Desde los datos de la invitación
        userIdGuest: invitation.userIdGuest, // Desde los datos de la invitación
        usernameHost: invitation.usernameHost, // Desde los datos de la invitación
        usernameGuest: usernameGuest, // Recuperado de AsyncStorage
        accepted: accepted,
        message: accepted ? `Aceptaste la invitación de ${invitation.usernameHost}` : `Rechazaste la invitación de ${invitation.usernameHost}`,
        gameId: "", // Esto no aplica en este punto
      };

      console.log('Respuesta actualizada:', invitationData);

      // Enviar la respuesta al servidor a través de WebSocket
      if (client.current) {
        client.current.send(`/topic/lobby/${invitation.userIdHost}`, {}, JSON.stringify(invitationData));
        console.log('Respuesta enviada al servidor:', invitationData);
      } else {
        console.log('No se pudo enviar la respuesta, cliente WebSocket no está disponible.');
      }

    } catch (error) {
      console.error("Error al recuperar el usernameGuest de AsyncStorage:", error);
    }
  };

  const handleAccept = (invitationId) => {
    const invitation = invitations.find((inv) => inv.id === invitationId);

    if (invitation) {
        setInviteResponse(true, invitation);
        setInvitations((prevInvitations) =>
            prevInvitations.filter((inv) => inv.id !== invitationId)
        );
        console.log('Invitación aceptada', '¡Disfruta el juego!');
        
        // Redirige a la pantalla de espera
       // navigation.navigate('Waiting');
    }
};


  // Función para rechazar invitaciones
  const handleReject = (invitationId) => {
    const invitation = invitations.find((inv) => inv.id === invitationId);

    if (invitation) {
      setInviteResponse(false, invitation);
      setInvitations((prevInvitations) =>
        prevInvitations.filter((inv) => inv.id !== invitationId)
      );
      Alert.alert('Invitación rechazada', 'La invitación fue rechazada.');
    }
  };

  // Renderiza cada invitación
  const renderInvitation = ({ item }) => (
    <View style={styles.invitationCard}>
      <Text style={styles.host}>{item.usernameHost}</Text>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.status}>Estado: {item.status}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'green' }]}
          onPress={() => handleAccept(item.id)}
        >
          <Text style={styles.buttonText}>Aceptar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'red' }]}
          onPress={() => handleReject(item.id)}
        >
          <Text style={styles.buttonText}>Rechazar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invitaciones Recibidas</Text>
      {invitations.length === 0 ? (
        <Text style={styles.noInvitationsText}>No hay invitaciones por el momento.</Text>
      ) : (
        <FlatList
          data={invitations}
          keyExtractor={(item) => item.id}
          renderItem={renderInvitation}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  invitationCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 3, // Sombra para el efecto de tarjeta
  },
  host: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    marginVertical: 5,
  },
  status: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  noInvitationsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },
});

export default InvitationScreen;
