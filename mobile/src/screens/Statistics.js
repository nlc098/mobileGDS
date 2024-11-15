import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import MainMenu from '../components/MainMenu';
import Dropdown from '../components/Dropdown';

const screenWidth = Dimensions.get('window').width;

const Statistics = () => {

  const [selectedOption, setSelectedOption] = useState("Max. ganadas");

  const data = Array.from({ length: 30 }, (_, index) => ({
    tipo: index % 2 === 0 ? 'Single' : 'Multi',
    aciertos: Math.floor(Math.random() * 3) + 1,
    resultado: index % 2 === 0 ? 'Win' : 'Loss',
    fecha: `14/06/24`,
  }));

  const rankingsData = {
    "Max. ganadas": Array.from({ length: 10 }, (_, index) => ({
      user: `User${index + 1}`,
      partidasGanadas: Math.floor(Math.random() * 10) + 1,
    })),
    "Max. aciertos": Array.from({ length: 10 }, (_, index) => ({
      user: `User${index + 1}`,
      aciertosTotales: Math.floor(Math.random() * 30) + 10,
    })),
    "Mín. tiempos": Array.from({ length: 10 }, (_, index) => ({
      user: `User${index + 1}`,
      fase: ["MC", "GP", "OW"][Math.floor(Math.random() * 3)],
      categoria: ["Cine", "Historia", "Deportes", "Ciencia", "Música"][Math.floor(Math.random() * 5)],
      tiempo: Math.floor(Math.random() * 27) + 3,
    })),
  };

  return (
    <MainMenu>
      <View style={styles.container}>
        {/* Primera tabla: Partidas Jugadas */}
        <View style={styles.tableContainer}>
          <Text style={styles.title}>Partidas Jugadas</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Tipo</Text>
            <Text style={styles.headerCell}>Aciertos</Text>
            <Text style={styles.headerCell}>Resultado</Text>
            <Text style={styles.headerCell}>Fecha</Text>
          </View>
          <ScrollView style={styles.tableBody}>
            {data.map((item, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.cell}>{item.tipo}</Text>
                <Text style={styles.cell}>{item.aciertos}</Text>
                <Text style={styles.cell}>{item.resultado}</Text>
                <Text style={styles.cell}>{item.fecha}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Segunda tabla: Rankings */}
        <View style={styles.tableContainer}>
          <Text style={styles.title}>Rankings</Text>
          <Dropdown
            options={["Max. ganadas", "Max. aciertos", "Mín. tiempos"]}
            selectedValue={selectedOption}
            onValueChange={setSelectedOption}
          />

          <View style={styles.tableHeader}>
            {selectedOption === "Mín. tiempos" ? (
              <>
                <Text style={styles.headerCell}>User</Text>
                <Text style={styles.headerCell}>Fase</Text>
                <Text style={styles.headerCell}>Categoría</Text>
                <Text style={styles.headerCell}>Tiempo</Text>
              </>
            ) : (
              <>
                <Text style={styles.headerCell}>User</Text>
                <Text style={styles.headerCell}>
                  {selectedOption === "Max. ganadas" ? "Partidas ganadas" : "Aciertos totales"}
                </Text>
              </>
            )}
          </View>
          <ScrollView style={styles.tableBody}>
            {rankingsData[selectedOption].map((item, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.cell}>{item.user}</Text>
                {selectedOption === "Mín. tiempos" ? (
                  <>
                    <Text style={styles.cell}>{item.fase}</Text>
                    <Text style={styles.cell}>{item.categoria}</Text>
                    <Text style={styles.cell}>{item.tiempo}</Text>
                  </>
                ) : (
                  <Text style={styles.cell}>
                    {selectedOption === "Max. ganadas" ? item.partidasGanadas : item.aciertosTotales}
                  </Text>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </MainMenu>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignContent: "flex-start"
  },
  tableContainer: {
    width: screenWidth * 0.9,
    height: 400,
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F8ECD9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#774936',
    marginBottom: 10,
    textAlign: 'center',
  },
  dropdownContainer: {
    marginBottom: 10,
  },
  dropdownButton: {
    padding: 10,
    backgroundColor: '#E8D5C4',
    borderRadius: 5,
    alignItems: 'center',
  },
  dropdownButtonText: {
    color: '#774936',
    fontSize: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E8D5C4',
    paddingVertical: 8,
    borderRadius: 5,
  },
  headerCell: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#774936',
    textAlign: 'center',
  },
  tableBody: {
    maxHeight: 280,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#D9BFB0',
  },
  cell: {
    flex: 1,
    fontSize: 16,
    color: '#774936',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#F8ECD9',
    borderRadius: 5,
    padding: 10,
    width: 200,
  },
  option: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  optionText: {
    color: '#774936',
    fontSize: 16,
  },
});

export default Statistics;