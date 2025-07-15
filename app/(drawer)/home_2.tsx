import React, {useState, useEffect} from 'react';
import { View, Text,FlatList, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import StaticLine from '../../components/lines/StaticLine';
import {Colors} from '../../constants/Colors';
import OrangeButton from '../../components/buttons/OrangeButton';
import DismissibleButton from '@/components/buttons/DismissibleButton';
import BodyBackSvgLittle from '../../components/svg/BodyBackSvg_little';
import BodySvgLittle from '../../components/svg/BodySvg_little';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import DrawerLayout from "@/app/(drawer)/_layout"
import { DrawerActions } from '@react-navigation/native';
import Questionnaries from '../../assets/data__for_testing/questionnaires.json'
import SplitWorkouts from '../../assets/data__for_testing/split_workot.json'
import Exercises from '../../assets/data__for_testing/exercises+video.json'
import { useExerciseContext } from '../../components/ExerciseContext2';
import MiniExerciseComponent2 from '@/components/MiniExerciseComponent2';
import LittlePurpleButton from '@/components/buttons/LittlePurpleButton';
import {useUser} from '../../components/UserContext';


interface Questionnaire {
  UserId : string,
  Weight: number,
  Height : number,
  Level : string, 
  Days : number,
  Time : number,
  Purpose: string,
  DaysDone: number | null
}

interface Exercise {
  Muscles: string;
  WorkOut: string;
  Intensity_Level: string; 
  'Beginner_Sets': string; 
  'Intermediate_Sets': string;
  'Expert_Sets': string;
  Equipment: string; 
  Explaination: string; 
  'Long_Explanation': string; 
  Video: string; 
  
}

const Home2Screen = () => {

    const router = useRouter(); 

    const { selectedExercises2 ,setSelectedExercises2, addExercise, clearExercises} = useExerciseContext();
    const {user}= useUser();
    const [muscles, setMuscles] = useState<string[]>([]);
    const [showIcon, setShowIcon] = useState(false);
    const {exercisesToAdd ,musclesArray} = useLocalSearchParams(); 

    

    useEffect(() => {

        if (typeof musclesArray === 'string') {
          setMuscles(JSON.parse(musclesArray)); 
        } else if (Array.isArray(musclesArray)) {
          setMuscles(musclesArray); 
        }
  
        let exercises: Exercise[] = [];

        if (typeof exercisesToAdd === 'string') {
            try {
                exercises = JSON.parse(exercisesToAdd) as Exercise[];
            } catch (e) {
                console.error("Parsing error:", e);
                exercises = []; 
            }
        } else {
            console.warn("exercisesToAdd is not a string");
        }

        console.log(exercises);

        
        if (JSON.stringify(exercises) !== JSON.stringify(selectedExercises2)) {
            setSelectedExercises2(exercises);
        }
    }, [exercisesToAdd]);  

    useEffect(() => {
        console.log('Selected Exercises:', selectedExercises2);
    }, [selectedExercises2]); 



    const handlePress = () => {
      router.push({
        pathname: '/(drawer)/exercises2',
        params: { selectedMuscles: JSON.stringify(muscles) }, 
    })};

    const handlePress1 = (muscle: string) => {
        if (!muscles.includes(muscle)) {
        setMuscles([...muscles, muscle]);
        }
    };


    const [isFirstSvg, setIsFirstSvg] = useState(true);

    const handleIconPress = () => {
        setIsFirstSvg(prevState => !prevState);
    };

   
  const navigation = useNavigation(); 


  const onToggle = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  }

  const renderItemInModal = ( { item, index }:{ item: Exercise, index: number } ) => {
    return <MiniExerciseComponent2 
              exercise={item}
              showIcon={showIcon}
              planId=''
              orderNumber={index + 1}
              />
  };
  
  const handlePressPurpleButton=() => {
    setShowIcon(!showIcon);
  };
  const handleAddPress=() => {
    setShowIcon(!showIcon);
  };
      
  return (
    <LinearGradient
      colors={[Colors.black_purple, Colors.dark_purple, Colors.black_purple]}
      start={{ x: 0, y: 0 }} 
      end={{ x: 1, y: 0 }}
      style={styles.backgroundImage}
    >
   <View style={styles.top_container}>
      <View style={styles.logo_container}>
        <Image source={require('../../assets/images/logo-partial.png')} style={styles.logo} />
      </View>
      <View style={styles.sidebar_container}>
        <TouchableOpacity onPress={onToggle}>
          <Image source={require('../../assets/images/sidebar_icon.png')} style={styles.sidebar_icon} />
        </TouchableOpacity>
      </View>
    </View>
      
    <View style={styles.container}>
       <Text style={styles.title}>Hello,  <Text style={styles.name}>{user.FirstName}</Text> </Text>
       <Text style={styles.text}>Here is your today's workout:</Text>
    </View>

    <View style={styles.modalContainer}>
          <View style={styles.exercises_container_modal}>   
            <FlatList
              data={selectedExercises2}
              renderItem={renderItemInModal}
              keyExtractor={(item) => item.WorkOut}
              />

          </View>
          {!showIcon?(
          <View style={styles.purple_button}>
             <View style={{flexDirection:'row',alignItems:'center'}}>
                      <LittlePurpleButton
                            onPress={handlePressPurpleButton} 
                            title="Change Workout" 
                            backgroundColor='#9685ff'
                            textColor='#ffffff'
                    />
                      <BodySvgLittle selected={muscles} onPress={handlePress1} /> 
                      <BodyBackSvgLittle selected={muscles} onPress={handlePress1} />
               
               </View>
          
          </View>
          ):(
            <View style={styles.purple_button}>
               <View style={{flexDirection:'row',alignItems:'center'}}>
                    <TouchableOpacity onPress={handlePress}>
                          <Image 
                              source={require('../../assets/images/plus_icon.png') }
                              style={{width:40, height:40, resizeMode: 'contain', marginRight:10}} />
                      </TouchableOpacity>
                      <Text style={{alignSelf:'center', color:Colors.blue, fontFamily:'Montserrat',fontSize:18,fontWeight:'bold',marginRight:10}}>Add Exercise</Text>
                      <BodySvgLittle selected={muscles} onPress={handlePress1} /> 
                      <BodyBackSvgLittle selected={muscles} onPress={handlePress1} />
               
               </View>
               
            </View>
          )}
        
        </View>

    <View style={styles.bottom_screen}>
        <OrangeButton 
                onPress={handlePress} 
                title="Start" 
         />
         <StaticLine />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  top_container:{
    flex:1,
    flexDirection:'row',
  },
  logo_container:{
    flex:1,
    alignItems:'flex-start',
  },
  sidebar_container:{
    flex:1,
    alignItems:'flex-end',
    paddingTop:30,
    paddingRight:20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding:30,
    gap:10,
    justifyContent:'center',
  },
  body_container:{
    padding:17,
    backgroundColor:Colors.transparent_blue_purple,
    width:'100%',
    borderRadius:45,
    gap:5,
    alignItems:'center',
  },
  list:{
    alignItems:'flex-start',
    flexDirection:'row',
    marginBottom:30,
  },
  bottom_screen:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom:30,
    gap:30,
  },

  icon:{
    width:70,
    height:30,
    resizeMode: 'contain',
    opacity: 0.8,
    
  },
  logo: {
    width: 120, 
    height: 100,
    resizeMode: 'contain',
  },
  sidebar_icon:{
    width: 25, 
    height: 25,
    resizeMode: 'contain',
  },
  title:{
    color: Colors.white,
    fontSize:30,
    fontFamily:'Bitter',
  },
  name:{
    color: Colors.red,
  },
  text:{
    color: Colors.white,
    fontSize:20,
    fontFamily:'Calistoga',
    marginTop:-10,
  },
  mini_text:{
    color: Colors.blue,
    fontSize:14,
    fontFamily:'Montserrat',
  },
  modalContainer: {
    flex: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray,
    borderRadius:25,
    borderColor:Colors.blue,
    borderWidth:4,
    marginBottom:50,
    marginTop:0,
    marginHorizontal:'5%',
  },
  modalContent: {
    width: '60%',
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
  },
  exercises_container_modal:{
    flex:1,
    width:'95%',
    marginTop:10,

  },
  purple_button:{
    paddingBottom:5,
    paddingTop:5,

  },
  sidebar: {
    width: '60%',
    backgroundColor: Colors.white,
    paddingTop: 30,
    paddingHorizontal: 20,
    height: '100%',
  },
  menuItem: {
    fontSize: 18,
    marginVertical: 10,
  },
  closeButton: {
    marginTop: 30,
    fontSize: 16,
    color: 'red',
  },
});

export default Home2Screen;
