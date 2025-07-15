import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {Colors} from '../../constants/Colors';

const StaticLine = () => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.red, Colors.blue]}
                start={{ x:0, y:0}}
                end={{x:1, y:0}}
                style={styles.gradient}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: 4,
        backgroundColor: Colors.blue,
        overflow: 'hidden',
        borderRadius: 2,
    },

    gradient: {
        flex: 1,
    },
});

export default StaticLine;