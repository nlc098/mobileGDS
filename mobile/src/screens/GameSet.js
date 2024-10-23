import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ImageBackground, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importa el hook de navegación
import HeaderMain from '../components/HeaderMain';
import FooterButtons from '../components/FooterButtons';
import { getCategories } from '../CallsAPI';

const GameSet = () => {
  const navigation = useNavigation(); // Usa el hook para obtener la instancia de navegación
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categorias = await getCategories();
        console.log(categorias);
        if (categorias == null) {
          throw new Error('Error al obtener las categorías');
        }
        setCategories(categorias);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryPress = (category) => {
    if (selectedCategories.includes(category.id)) {
      setSelectedCategories(selectedCategories.filter(id => id !== category.id));
    } else {
      if (selectedCategories.length >= 3) {
        const newSelectedCategories = [...selectedCategories.slice(1), category.id];
        setSelectedCategories(newSelectedCategories);
      } else {
        setSelectedCategories([...selectedCategories, category.id]);
      }
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedCategories.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.categoryItem, isSelected && styles.selectedCategory]}
        onPress={() => handleCategoryPress(item)}
      >
        <Text style={styles.categoryText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const handleShowSelected = () => {
    // Obtiene los nombres de las categorías seleccionadas
    const selectedCategoryNames = categories
      .filter(category => selectedCategories.includes(category.id))
      .map(category => category.name);
      
    navigation.navigate('IndividualGameSet', { selectedCategoryNames }); // Redirige y envía los nombres de las categorías seleccionadas
  };

  return (
    <ImageBackground 
      source={require('../../assets/GDS-Words-Footer.png')} 
      style={styles.background} 
      resizeMode="cover" 
    >
      <View style={styles.container}>
        <HeaderMain />
        <Text style={styles.title}>Categorías</Text>
        <View style={styles.card}>
          <FlatList
            data={categories}
            renderItem={renderItem}
            keyExtractor={(category) => category.id.toString()}
            numColumns={2} // Establece el número de columnas a 2
            columnWrapperStyle={styles.row}
          />
        </View>

        <TouchableOpacity 
          style={styles.showSelectedButton} 
          onPress={handleShowSelected} // Cambia para usar la función de redirección
        >
          <Text style={styles.buttonText}>Ir a Juego Individual</Text>
        </TouchableOpacity>

        <FooterButtons />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 253, 220, 0.8)',
    paddingTop: 100, 
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    width: '90%',
    backgroundColor: '#F9F5DC',
    borderRadius: 10, 
    padding: 20, 
    borderColor: '#000000', 
    borderWidth: 4, 
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 5, 
  },
  categoryItem: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 15, // Esquinas circulares
    margin: 5,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#D3D3D3',
  },
  categoryText: {
    fontSize: 18, // Aumenta el tamaño de la letra
    textAlign: 'center', // Centra el texto
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
  },
  showSelectedButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default GameSet;
