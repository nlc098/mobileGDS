import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SocketContext } from '../WebSocketProvider'; // Importa el contexto de tu WebSocket
import { useNavigation } from '@react-navigation/native';

const InvitationScreen = () => {

  const navigation = useNavigation();
  const [invitations, setInvitations] = useState([]);
  const [isWaiting, setIsWaiting] = useState(false); // Controla si se muestra la sala de espera
  const [waitingData, setWaitingData] = useState(null); // Almacena la información del juego para la sala de espera
  const [userObj, setUserObj] = useState({}); // Estado para userObj
  const { invitationCollection, setInvitationCollection, client, invitation,setInvitation, suscribeToGameSocket,implementationGameBody,setImplementationGameBody,gameId } = useContext(SocketContext);

  useEffect(() => {
    return () => {
        setImplementationGameBody(null); // Reinicia el estado al desmontar
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
        console.log('Usuario cargado desde AsyncStorage:', storedUser);
      } else {
        console.log('No se encontró un usuario en AsyncStorage.');
      }
    } catch (error) {
      console.error('Error al obtener el usuario de AsyncStorage:', error);
    }
  };

  loadUser(); // Llamar a la función al montar el componente
}, []); // Se ejecuta solo al montar


  useEffect(() => {
    if (invitationCollection.length > 0) {
     
      setInvitations((prevInvitations) => [
        ...prevInvitations,
        ...invitationCollection
          .filter((invitation) => invitation.userIdGuest !== invitation.userIdHost) // Filtrar autoinvitaciones
          .map((invitation) => ({
            id: invitation.id || Date.now().toString(), // Genera un id único si no existe
            usernameHost: invitation.usernameHost,
            message: invitation.message,
            userIdHost: invitation.userIdHost,
            userIdGuest: invitation.userIdGuest,
            gameId: invitation.gameId || 'pendingGameId',
            status: 'Pendiente',
          })),
      ]);

      setInvitationCollection([]); // Limpiar la colección de invitaciones después de procesarlas
    }
  }, [invitationCollection]);

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
        userIdHost: invitation.userIdHost,
        userIdGuest: invitation.userIdGuest,
        usernameHost: invitation.usernameHost,
        usernameGuest: usernameGuest,
        accepted: accepted,
        message: accepted
          ? `Aceptaste la invitación de ${invitation.usernameHost}`
          : `Rechazaste la invitación de ${invitation.usernameHost}`,
        gameId: invitation.gameId,
      };

      console.log('Respuesta actualizada:', JSON.stringify(invitationData, null, 2));
      

      // Enviar la respuesta al servidor a través de WebSocket
      if (client.current) {
        client.current.send(`/topic/lobby/${invitation.userIdHost}`, {}, JSON.stringify(invitationData));
        console.log('Respuesta enviada al servidor:', JSON.stringify(invitationData, null, 2));
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
      console.log('Invitación aceptada');
      const HostObj = {username: invitation.usernameHost, userId: invitation.userIdHost}
      const Host = JSON.stringify(HostObj);
      AsyncStorage.setItem('Host', Host);


      const Invitado = JSON.stringify(userObj);
      AsyncStorage.setItem('Guest', Invitado);
    
      // Activar la sala de espera
      setWaitingData({
        gameId: invitation.gameId,
        hostUsername: invitation.usernameHost,
      });
      setIsWaiting(true);
    }
  };

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
  useEffect(() => {
    if (invitation) {
        handleInvitationInteraction(invitation);
    }
}, [invitation]);

   // 2.1)
   const handleInvitationInteraction = (invitation) => {
    if (invitation) {
        if (invitation.action === 'RESPONSE_IDGAME') {
            suscribeToGameSocket(invitation.gameId);
        }
    } else {
        console.error("Invalid Invitation");
    }
};


useEffect(() => {
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
}, [implementationGameBody]);


  // Lógica de la sala de espera
  useEffect(() => {
    if (isWaiting && client.current && waitingData?.gameId) {
      console.log(`Suscribiéndose al canal del juego con ID: ${waitingData.gameId}`);
      const subscription = client.current.subscribe(`/topic/game/${waitingData.gameId}`, (message) => {
        const gameData = JSON.parse(message.body);
        console.log('Datos del juego recibidos:', gameData);

        // Si el juego comienza, puedes agregar lógica adicional aquí
        if (gameData.status === 'STARTED') {
          console.log('El juego ha comenzado');
          // Ejemplo: navegar a la pantalla de juego
        }
      });

      return () => {
        console.log(`Cancelando la suscripción al canal del juego con ID: ${waitingData.gameId}`);
        subscription.unsubscribe();
      };
    }
  }, [isWaiting, waitingData, client]);

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

  // Render principal
  if (isWaiting && waitingData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sala de Espera</Text>
        <Text>Esperando que {waitingData.hostUsername || 'el anfitrión'} inicie la partida...</Text>
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invitaciones Recibidas</Text>
      {invitations.length === 0 ? (
        <Text style={styles.noInvitationsText}>No hay invitaciones por el momento.</Text>
      ) : (
        <FlatList
          data={invitations}
          keyExtractor={(item) => item.id.toString()} // Usamos el id como clave única
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
    elevation: 3,
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
  loader: {
    marginVertical: 20,
  },
  noInvitationsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },
});

export default InvitationScreen;
