import React from 'react';
import { TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Colors} from '../../constants/Colors';

interface PurpleButtonProps{
    onPress: () => void;
    title: string;
}

const PurpleButton: React.FC<PurpleButtonProps> = ({onPress, title}) => {
    return(
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    )
};

const styles= StyleSheet.create({
    button:{
        backgroundColor: Colors.light_purple,
        paddingVertical: 3,
        paddingHorizontal: 75,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text:{
        color: Colors.white,
        fontSize:26,
        fontFamily:'Poppins',
    }


});

export default PurpleButton;