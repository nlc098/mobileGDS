import React from "react";
import { GameProvider } from "./src/context/GameContext";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/AppNavigator";

const App = () => {
  return (
    <GameProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </GameProvider>
  );
};

export default App;
