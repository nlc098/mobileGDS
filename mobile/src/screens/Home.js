import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Logo from '../components/Logo';
import { buttonStyles } from '../styles/buttons';
import MainMenu from '../components/MainMenu';

const Home = () => {
  const navigation = useNavigation();

  const handleNavigation = (gameMode) => {
    // Navegar a la pantalla 'GameSet' y pasar el parámetro 'gameMode'
    navigation.navigate('GameSet', { gameMode });
  };

  return (
    <MainMenu>
        <Logo />
        <TouchableOpacity 
          style={buttonStyles.buttonfullwidth}
          onPress={() => handleNavigation('individual')}>
          <Text style={buttonStyles.buttonText}>Partida Individual</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={buttonStyles.buttonfullwidth}
          onPress={() => handleNavigation('multiplayer')}>
          <Text style={buttonStyles.buttonText}>Partida Multijugador</Text>
        </TouchableOpacity>
    </MainMenu>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 253, 220, 0.4)',
    padding: 16,
  },
  button: {
    backgroundColor: '#B36F6F',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  username: {
    fontSize: 20,
    color: "black", // Cambiado a negro
    marginBottom: 20,
    fontWeight: "bold",
  },
});

export default Home;
