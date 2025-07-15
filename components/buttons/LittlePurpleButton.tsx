import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import {Colors} from '../../constants/Colors';


interface LittlePurpleButtonProps{
    onPress: () => void;
    title: string;
    backgroundColor: string;
    textColor: string;
};

const LittlePurpleButton: React.FC<LittlePurpleButtonProps> = ({onPress,title,backgroundColor,textColor}) => {

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={onPress} style={{flexDirection: 'row',backgroundColor: backgroundColor, paddingVertical: 5, paddingHorizontal: 25,borderRadius:10, alignItems: 'center',}} >
        <Text style={{color: textColor, fontSize: 16,fontFamily: 'Bitter',}}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 8,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: Colors.light_purple, 
    paddingVertical: 5,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
 
});

export default LittlePurpleButton;
