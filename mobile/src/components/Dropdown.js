import React, { useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, ScrollView } from 'react-native';

const Dropdown = ({ options, selectedValue, onValueChange }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (value) => {
    onValueChange(value);
    setModalVisible(false);
  };

  return (
    <View style={styles.dropdownContainer}>
      <Pressable style={styles.dropdownButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownButtonText}>{selectedValue || "Select an option"}</Text>
      </Pressable>

      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            {options.map((option, index) => (
              <Pressable key={index} style={styles.option} onPress={() => handleSelect(option)}>
                <Text style={styles.optionText}>{option}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default Dropdown;
