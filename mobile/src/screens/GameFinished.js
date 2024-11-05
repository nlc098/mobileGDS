import { ImageBackground, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Logo from '../components/Logo';
import { buttonStyles } from '../styles/buttons';

const GameFinished = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground 
        source={require('../../assets/fondo_mobile.jpeg')} 
        style={styles.background} 
        resizeMode="cover">
        <View style={styles.container}>
            <Logo />
            <TouchableOpacity style={buttonStyles.buttonfullwidth}
                            onPress={() => navigation.navigate('Home')}>
            <Text style={buttonStyles.buttonText}>Volver al inicio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyles.buttonfullwidth}
                            onPress={() => navigation.navigate('GameSet')}>
            <Text style={buttonStyles.buttonText}>Nueva partida</Text>
            </TouchableOpacity>
        </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
      },
      container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'rgba(249, 253, 220, 0.8)',
        paddingTop: 180,
        padding: 16,
      },
});

export default GameFinished;
