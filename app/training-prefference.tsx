import React, {useState, useEffect} from 'react';
import { View,Alert, Text, TextInput, Image, StyleSheet, ScrollView} from 'react-native';
import { Link,useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import StaticLine from '../components/lines/StaticLine';
import {Colors} from '../constants/Colors';
import ColoredButton from '../components/buttons/ColoredButton';

const TrainingPrefferenceScreen = () => {

  const router = useRouter();

  const handleTrainingByChoice = () => {
    router.push('/trainingByChoice_signup'); 
  }

  const handlePersonalisedTraining = () => {
    router.push('/personalisedTraining_signup'); 
  }

  return (
    <LinearGradient
      colors={[Colors.black_purple, Colors.dark_purple, Colors.black_purple]}
      start={{ x: 0, y: 0 }} 
      end={{ x: 1, y: 0 }}
      style={styles.backgroundImage}
    >
    
    <View style={styles.logo_container}>
      <Image source={require('../assets/images/logo-partial.png')} style={styles.logo} />
    </View>

    <View style={styles.container}>
        <View style={styles.title}>
            <Text style={styles.text_title}>Please choose your training prefference</Text>
        </View>
    
        <Image source={require('../assets/images/purple_dumbbell.png')} style={styles.dumbbell} />
     </View>

     <View style={styles.container}>

        <ColoredButton 
                onPress={handleTrainingByChoice} 
                title="     Training by choice*    " 
                colorBackground='#01cabd'
         />

        <ColoredButton 
                onPress={handlePersonalisedTraining} 
                title="Personalised training**" 
                colorBackground='#ff972b'
         />
         
     </View>

      <View style={styles.bottom}>
        <View style={styles.links_container}>
             <Text style={styles.stars}>* <Text style={styles.text_red}>Training by choice <Text style={styles.text_blue}>means that you can create your own workout plan based on your training exeperience <Text style={styles.link}>(suitable for advenced users)</Text></Text></Text></Text>
             <Text style={styles.stars}>** <Text style={styles.text_red}>Personalised training <Text style={styles.text_blue}>means that you will take a questionnaire followed by a daily generated personalised workout plan <Text style={styles.link}>(suitable for beginners)</Text></Text></Text></Text>
        </View>
         <StaticLine />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  logo_container:{
    flex:1,
    alignItems:'flex-start',
    padding:5,
  },
  dumbbell:{
    width:200,
    height:200,
    resizeMode: 'contain',
    position:'absolute',
    bottom: -15, 
    right: -30, 
    transform: [{ rotate: '-15deg' }],
  },
  logo: {
    width: 120, 
    height: 100,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    gap:20,
    justifyContent:'flex-start',
    marginBottom:'10%',
    position:'relative',
  },
  title:{
    paddingVertical:10,
    paddingHorizontal:30,
    width:'75%',
    backgroundColor:Colors.white,
    borderColor:Colors.blue,
    borderWidth:4,
    borderRadius:25,
    position:'relative'
 },
  text_title:{
    color:Colors.blue_purple,
    fontFamily:'Calistoga',
    fontSize:25,
    textAlign:'center',
  },

  bottom:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom:30,
    gap:30,
  },
  links_container:{
    paddingHorizontal:15,
    gap:10,
  },
  stars:{
    color: Colors.white,
    fontSize:11,
    fontFamily:'Montserrat',
  },
  text_red:{
    color: Colors.red,
    fontSize:12,
    fontFamily:'Montserrat',
  },
  text_blue:{
    color: Colors.blue,
    fontSize:11,
    fontFamily:'Montserrat',
  },
  link:{
    color: Colors.light_purple,
    fontSize:11,
    fontFamily:'Montserrat',
  },
});

export default TrainingPrefferenceScreen;
