import React, { createContext, useState } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children  }) => {
    const [answer, setAnswer] = useState(); // Respuesta enviada del jugador
    const [iscorrect, setIsCorrect] = useState(); // Respuesta correcta o incorrecta

    return (
        <GameContext.Provider value={{ answer, setAnswer, iscorrect, setIsCorrect }}>
            {children}
        </GameContext.Provider>
    );
};