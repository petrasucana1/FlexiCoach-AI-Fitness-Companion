import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import {Colors} from '../../constants/Colors';

interface PurpleButtonProps{
    onPress: () => void;
    title: string;
}

const PurpleButton: React.FC<PurpleButtonProps> = ({onPress, title}) => {
    return(
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Text style={styles.text}>{title}</Text>
            <Image source={require('../../assets/images/arrow_icon.png')} style={styles.icon}/>
        </TouchableOpacity>
    )
};

const styles= StyleSheet.create({
    button:{
        flexDirection: 'row',
        backgroundColor: Colors.orange,
        paddingLeft:25,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        padding:2,
    },
    icon:{
        width:45,
        height:45,
        resizeMode: 'contain',
        marginLeft:20,
    },
    text:{
        color: Colors.white,
        fontSize:26,
        fontFamily:'Bitter',
    }


});

export default PurpleButton;