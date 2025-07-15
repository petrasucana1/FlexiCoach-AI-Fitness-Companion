import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import {Colors} from '../../constants/Colors';


interface DismissibleButtonProps{
    onPressX: () => void;
    title: string;
};

const DismissibleButton: React.FC<DismissibleButtonProps> = ({onPressX,title}) => {
  const [visible, setVisible] = useState(true);


  if (!visible) {
    return null; 
  }

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} >
        <Text style={styles.buttonText}>{title}</Text>
        <TouchableOpacity onPress={onPressX} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>x</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    margin: 10,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: Colors.light_purple, 
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Bitter',
  },
  closeButton: {
    backgroundColor: 'transparent', 
    borderRadius: 25,
    paddingHorizontal:7,
    marginLeft: 10,
  },
  closeButtonText: {
    color: Colors.white, 
    fontFamily:'Poppins',
    fontSize: 12,
  },
});

export default DismissibleButton;
