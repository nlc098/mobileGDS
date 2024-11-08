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
        <Text 
          style={[
            styles.categoryText, 
            isSelected ? styles.selectedCategoryText : styles.unselectedCategoryText
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleShowSelected = () => {
    // Obtiene los nombres de las categorías seleccionadas
    const selectedCategoryID = categories
      .filter(category => selectedCategories.includes(category.id))
      .map(category => category.id);
    navigation.navigate('IndividualGameSet', { selectedCategoryID }); // Redirige y envía los nombres de las categorías seleccionadas
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
        <Text style={styles.categoriesAlert}>Selecciona 3 categorías</Text>
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
          style={[styles.startButton, selectedCategories.length !== 3 && styles.disabledButton]} 
          onPress={handleShowSelected} 
          disabled={selectedCategories.length !== 3}
        >
          <Text 
            style={[styles.buttonText, selectedCategories.length === 3 && styles.selectedButtonText]}
          >
            Iniciar partida
          </Text>
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
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "#653532"
  },
  card: {
    width: '90%',
    backgroundColor: '#F9F5DC',
    borderRadius: 50, 
    padding: 20, 
    borderColor: '#653532', 
    borderWidth: 2, 
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
    borderRadius: 25, 
    margin: 5, 
    backgroundColor: '#F9F5DC', 
    opacity: 0.8,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  selectedCategory: {
    backgroundColor: '#B36F6F', 
  },
  categoryText: {
    fontSize: 22,
    textAlign: 'center',
    justifyContent: 'center', 
    fontWeight: 'bold', 
  },
  selectedCategoryText: {
    color: '#F9F5DC',  // Color de texto cuando la categoría está seleccionada
  },
  unselectedCategoryText: {
    color: '#653532',  // Color de texto cuando la categoría no está seleccionada
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
  },
  startButton: {
    backgroundColor: '#B36F6F',
    borderRadius: 40,
    padding: 10,
    marginTop: 10,
    width: "70%",  // Asegúrate de que el ancho coincida con el tamaño de los otros botones
    alignItems: "center",
    justifyContent: 'center',
    paddingVertical: 15, // Asegura que tenga un buen alto
  },
  buttonText: {
    color: 'white',
    fontSize: 25,  // Asegúrate de que el tamaño de texto sea el mismo
    fontWeight: 'bold',
  },
  selectedButtonText: {
    color: '#F9F5DC',  // Color de texto cuando el botón está seleccionado (habilitado)
  },
  disabledButton: {
    backgroundColor: 'gray',
  },
  categoriesAlert: {
    color: "#653532",
    marginBottom: 30,
    fontSize: 25,
  },
});

export default GameSet;
