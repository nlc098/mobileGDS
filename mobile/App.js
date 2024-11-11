import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/AppNavigator";
import { SocketProvider } from './src/WebSocketProvider';

const App = () => {
  return (
    <SocketProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      </SocketProvider>
  );
};

export default App;
