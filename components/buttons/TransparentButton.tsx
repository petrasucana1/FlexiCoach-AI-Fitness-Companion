import React from 'react';
import { TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Colors} from '../../constants/Colors';

interface PurpleButtonProps{
    onPress: () => void;
    title: string;
    size: number;
}

const PurpleButton: React.FC<PurpleButtonProps> = ({onPress, title,size}) => {
    return(
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Text style={[styles.text, {  fontSize:size,}]}>{title}</Text>
        </TouchableOpacity>
    )
};

const styles= StyleSheet.create({
    button:{
        backgroundColor: 'transparent',
        paddingVertical: 2,
        paddingHorizontal: 60,
        borderRadius: 35,
        borderColor: Colors.white,
        borderWidth:6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text:{
        color: Colors.blue,
        fontFamily:'Poppins',
        textAlign:'center'
    }


});

export default PurpleButton;