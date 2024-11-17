import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
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
      <View style={styles.container}>
      <Logo/>
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
      </View>
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
    alignItems: 'center',
    marginTop:150,
  },
  logo: {
    marginTop: 80,
  }
});

export default Home;
