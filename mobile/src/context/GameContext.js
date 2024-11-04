import React, { createContext, useState } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children  }) => {
    const [answer, setAnswer] = useState(); // Respuesta enviada del jugador

    return (
        <GameContext.Provider value={{ answer, setAnswer}}>
            {children}
        </GameContext.Provider>
    );
};