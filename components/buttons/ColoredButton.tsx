import React from 'react';
import { TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Colors} from '../../constants/Colors';

interface PurpleButtonProps{
    onPress: () => void;
    title: string;
    colorBackground:string;
}

const PurpleButton: React.FC<PurpleButtonProps> = ({onPress, title, colorBackground
}) => {
    return(
        <TouchableOpacity onPress={onPress} style={[styles.button, {backgroundColor:colorBackground}]}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    )
};

const styles= StyleSheet.create({
    button:{
        paddingVertical: 10,
        paddingHorizontal:20,
        borderRadius: 35,
        borderColor: Colors.white,
        borderWidth:3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text:{
        color: Colors.white,
        fontSize:18,
        fontFamily:'Calistoga',
    }


});

export default PurpleButton;