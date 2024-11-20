// Debug objects
export const logObject = ({ object }) => {
	if (object) {
		console.log(JSON.stringify(object, null, 2));
	}
}

// Función para obtener un elemento aleatorio de un array
export const getRandomItem = (array) => {
	return array[Math.floor(Math.random() * array.length)];
};

// Return random array
export const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

export const invitationData = {
	action: "",          // INVITE, INVITE_RESPONSE, RESPONSE_IDGAME
	userIdHost: "",      // INVITE, INVITE_RESPONSE, RESPONSE_IDGAME
	usernameHost: "",    // INVITE
	userIdGuest: "",     // INVITE, INVITE_RESPONSE, RESPONSE_IDGAME
	usernameGuest: "",   // INVITE, INVITE_RESPONSE
	gameId: "",          // RESPONSE_IDGAME
	accepted: null,      // INVITE_RESPONSE, RESPONSE_IDGAME
	message: "",         // INVITE, INVITE_RESPONSE
}

// Función para actualizar la invitación
export function setInviteAction(usernameHost, userIdHost, userIdGuest, message) {
	invitationData.action = "INVITE";
	invitationData.userIdHost = userIdHost;
	invitationData.usernameHost = usernameHost;
	invitationData.userIdGuest = userIdGuest;
	invitationData.message = message;
	console.log('Datos de la invitación actualizados:', invitationData);
}

// Función para actualizar la respuesta de la invitación
export function setInviteResponse(accepted, usernameGuest, userIdGuest, message) {
	invitationData.action = "INVITE_RESPONSE";
	invitationData.userIdGuest = userIdGuest;
	invitationData.usernameGuest = usernameGuest;
	invitationData.accepted = accepted;
	invitationData.message = message;
	console.log('Respuesta actualizada:', invitationData);
}

// Función para actualizar la respuesta de la invitación
export function setResponseIdGame(idGame, message) {
	invitationData.action = "RESPONSE_IDGAME";
	invitationData.gameId = idGame;
	invitationData.message = message;
	console.log('Respuesta actualizada:', invitationData);
}