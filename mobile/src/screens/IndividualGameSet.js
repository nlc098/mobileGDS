import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MainMenu from '../components/MainMenu';
import { useRoute } from '@react-navigation/native';

const IndividualGameSet = () => {
  const route = useRoute();
  const { selectedCategoryNames } = route.params; // Obtén los nombres de las categorías seleccionadas de los parámetros de navegación

  return (
    <MainMenu>
      <View style={styles.container}>
        <Text style={styles.title}>Categorías Seleccionadas:</Text>
        <Text style={styles.selectedCategories}>
          {selectedCategoryNames.length > 0 ? selectedCategoryNames.join(', ') : 'Ninguna categoría seleccionada'}
        </Text>
      </View>
    </MainMenu>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedCategories: {
    fontSize: 18,
    textAlign: 'center',
  },
});

export default IndividualGameSet;
