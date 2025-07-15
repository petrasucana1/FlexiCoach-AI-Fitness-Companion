import React, {useState, useEffect} from 'react';
import { View, Alert,Text, TextInput,TouchableOpacity, Image, StyleSheet, Animated,Dimensions} from 'react-native';
import { Link,useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import StaticLine from '../components/lines/StaticLine';
import {Colors} from '../constants/Colors';
import TransparentButton from '../components/buttons/TransparentButton';
import { ScrollView } from 'react-native-gesture-handler';
import { useExerciseContext } from '../components/ExerciseContext2';
import SplitWorkouts from '../assets/data__for_testing/split_workot.json'
import Exercises from '../assets/data__for_testing/exercises+video.json'
import {useUser} from '../components/UserContext';
import { useLocalSearchParams } from 'expo-router';
import { gql, useMutation} from '@apollo/client';
import { create } from 'react-test-renderer';


const CREATE_QUESTIONNAIRE = gql`
  mutation CreateQuestionnaire($days: String!, $height: String!, $level: String!, $purpose: String!, $time: String!, $userId: String!, $weight: String!) {
    createQuestinnaire(
      Height: $height
      Level: $level
      Purpose: $purpose
      Time: $time
      UserId: $userId
      Weight: $weight
      Days: $days
    ) {
      name
    }
  }
`;

interface Exercise {
    Muscles: string;
    WorkOut: string;
    Intensity_Level: string; 
    'Beginner Sets': string; 
    'Intermediate Sets': string;
    'Expert Sets': string;
    Equipment: string; 
    Explaination: string; 
    'Long Explanation': string; 
    Video: string; 
    
  }
  

const QuestionnaireScreen = () => {

  const router = useRouter();
  const {Id} = useLocalSearchParams();
  const { selectedExercises2 ,setSelectedExercises2, addExercise, clearExercises} = useExerciseContext();
  const {user, setQuestionnaire}= useUser();

  const [weight, setWeight] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [level, setLevel] = useState('');
  const [days, setDays] = useState(Number);
  const [time, setTime] = useState(Number);
  const [purpose, setPurpose] = useState('');
  //const [daysDone, setDaysDone]= useState(2);
  const [errorMessage, setErrorMessage] = useState('');

  const [input1, setInput1] = useState<string>(''); 
  const [input2, setInput2] = useState<string>(''); 
  //const [alternate, setAlternate]=useState<number>(1);
  const [gender, setGender]= useState<string>('Female');

  const [createQuestinnaire, { loading, error, data }] = useMutation(CREATE_QUESTIONNAIRE);




  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handlePress = () => {
   /* if (!weight || !height || !level || !days || !time || !purpose) {
      setErrorMessage('All fields are required.');
      return;
    }

    setErrorMessage('');
*/
    const response = createQuestinnaire({
      variables: {
        days: days.toString(),
        height: height?.toString() ?? '0',
        level: level,
        purpose: purpose,
        time: time.toString(),
        userId: Id,
        weight: weight?.toString() ?? '0',
      },
    });
    router.push('/login');
    
     
  };

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
        <Text style={styles.title}>Training</Text>
        <Text style={[styles.title,{color:Colors.blue, marginTop:-5, marginBottom:30}]}>QUESTINNAIRE</Text>

            <View style={styles.input_container}>
            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}
              <ScrollView contentContainerStyle={{gap:10}}>

        {/*WEIGHT*/}

                <View style={{flexDirection:'row'}}>
                    <View style={styles.number_container}>
                        <Text style={styles.number}>1</Text>
                    </View>
                    <Text style={styles.label}>What is your body weight? (kg)</Text>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="ex. 57.8 kg"
                    placeholderTextColor={Colors.light_purple}
                    onChangeText={text => {
                        setInput1(text);
                        const match = text.match(/[\d.]+/);
                        if (match) {
                            setWeight(parseFloat(match[0])); 
                        } else {
                            setWeight(null); 
                        }
                    }}
                    value={input1}
                    />


         {/*HEIGHT*/}
                
                <View style={{flexDirection:'row',}}>
                    <View style={styles.number_container}>
                        <Text style={styles.number}>2</Text>
                    </View>
                    <Text style={styles.label}>What is your height? (cm)</Text>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="ex. 168 cm"
                    placeholderTextColor={Colors.light_purple}
                    onChangeText={text => {
                        setInput2(text);
                        const match = text.match(/[\d.]+/);
                        if (match) {
                            setHeight(parseFloat(match[0])); 
                        } else {
                            setHeight(null); 
                        }
                    }}
                    value={input2}
                    />

                
         {/*LEVEL*/}

                <View style={{flexDirection:'row',}}>
                    <View style={styles.number_container}>
                        <Text style={styles.number}>3</Text>
                    </View>
                    <Text style={styles.label}>What is your fitness level?</Text>
                </View>

                <TouchableOpacity 
                      style={styles.radioButtonContainer} 
                      onPress={() => setLevel('Beginner')}
                >
                      <View style={styles.radioButton}>
                        {level === 'Beginner' && <View style={styles.radioButtonSelected} />}
                      </View>
                      <Text style={styles.radioButtonText}>Beginner</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                      style={styles.radioButtonContainer} 
                      onPress={() => setLevel('Intermediate')}
                    >
                      <View style={styles.radioButton}>
                        {level === 'Intermediate' && <View style={styles.radioButtonSelected} />}
                      </View>
                      <Text style={styles.radioButtonText}>Intermediate</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                      style={styles.radioButtonContainer} 
                      onPress={() => setLevel('Expert')}
                    >
                      <View style={styles.radioButton}>
                        {level === 'Expert' && <View style={styles.radioButtonSelected} />}
                      </View>
                      <Text style={styles.radioButtonText}>Expert</Text>
                </TouchableOpacity>


        {/*DAYS*/}

                <View style={{flexDirection:'row',}}>
                    <View style={styles.number_container}>
                        <Text style={styles.number}>4</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text style={styles.label}>How many days a week do you want to train?</Text>
                    </View>
                </View>

                <TouchableOpacity 
                      style={styles.radioButtonContainer} 
                      onPress={() => setDays(2)}
                >
                      <View style={styles.radioButton}>
                        {days === 2 && <View style={styles.radioButtonSelected} />}
                      </View>
                      <Text style={styles.radioButtonText}>2 days <Text style={{ color: Colors.light_purple}}>(suitable if you have no fitness experience)</Text></Text>
                </TouchableOpacity>

                <TouchableOpacity 
                      style={styles.radioButtonContainer} 
                      onPress={() => setDays(3)}
                    >
                      <View style={styles.radioButton}>
                        {days === 3 && <View style={styles.radioButtonSelected} />}
                      </View>
                      <Text style={styles.radioButtonText}>3 days <Text style={{ color: Colors.light_purple}}>(suitable if you are a motivated beginner)</Text></Text>
                </TouchableOpacity>

                <TouchableOpacity 
                      style={styles.radioButtonContainer} 
                      onPress={() => setDays(4)}
                    >
                      <View style={styles.radioButton}>
                        {days === 4 && <View style={styles.radioButtonSelected} />}
                      </View>
                      <Text style={styles.radioButtonText}>4 days <Text style={{ color: Colors.light_purple}}>(suitable if you have at least 1    year fitness experience )</Text></Text>
                </TouchableOpacity>

                <TouchableOpacity 
                      style={styles.radioButtonContainer} 
                      onPress={() => setDays(5)}
                    >
                      <View style={styles.radioButton}>
                        {days === 5 && <View style={styles.radioButtonSelected} />}
                      </View>
                      <Text style={styles.radioButtonText}>5 days <Text style={{ color: Colors.light_purple}}>(suitable for gym rats)</Text></Text>
                </TouchableOpacity>


        {/*TIME*/}

                <View style={{flexDirection:'row',}}>
                    <View style={styles.number_container}>
                        <Text style={styles.number}>5</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text style={styles.label}>How much time a day can you train?</Text>
                    </View>
                </View>

                <TouchableOpacity 
                      style={styles.radioButtonContainer} 
                      onPress={() => setTime(60)}
                    >
                      <View style={styles.radioButton}>
                        {time === 60 && <View style={styles.radioButtonSelected} />}
                      </View>
                      <Text style={styles.radioButtonText}>1 hour </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                      style={styles.radioButtonContainer} 
                      onPress={() => setTime(90)}
                    >
                      <View style={styles.radioButton}>
                        {time === 90 && <View style={styles.radioButtonSelected} />}
                      </View>
                      <Text style={styles.radioButtonText}>1 hour 30 minutes</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                      style={styles.radioButtonContainer} 
                      onPress={() => setTime(120)}
                    >
                      <View style={styles.radioButton}>
                        {time === 120 && <View style={styles.radioButtonSelected} />}
                      </View>
                      <Text style={styles.radioButtonText}>2 hours </Text>
                </TouchableOpacity>


        {/*PURPOSE*/}

                <View style={{flexDirection:'row',}}>
                    <View style={styles.number_container}>
                        <Text style={styles.number}>6</Text>
                    </View>
                    <View style={{flex:1}}>
                        <Text style={styles.label}>What is your training purpose?</Text>
                    </View>
                </View>

                <TouchableOpacity 
                      style={styles.radioButtonContainer} 
                      onPress={() => setPurpose('gain')}
                >
                      <View style={styles.radioButton}>
                        {purpose === 'gain' && <View style={styles.radioButtonSelected} />}
                      </View>
                      <Text style={styles.radioButtonText}>To gain muscles</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                      style={styles.radioButtonContainer} 
                      onPress={() => setPurpose('lose')}
                    >
                      <View style={styles.radioButton}>
                        {purpose === 'lose' && <View style={styles.radioButtonSelected} />}
                      </View>
                      <Text style={styles.radioButtonText}>To lose weight</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                      style={styles.radioButtonContainer} 
                      onPress={() => setPurpose('maintain')}
                    >
                      <View style={styles.radioButton}>
                        {purpose === 'maintain' && <View style={styles.radioButtonSelected} />}
                      </View>
                      <Text style={styles.radioButtonText}>To maintain</Text>
                </TouchableOpacity>

                <Text style={styles.text1}>
                Your workouts will be generated based on your answers to the questions above. The muscle groups are divided by day by professional fitness trainers so that you get the best results. In the profile page, you will be able to change the answers to the questions above, but the workouts based on the new answers will only be generated on Monday of the following week.
                </Text>

                <TransparentButton 
                    onPress={handlePress} 
                    title="SIGN UP" 
                    size={25}
                />
              </ScrollView>
            </View>
      </View>

      <View style={styles.bottom}>
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
  container: {
    flex:6,
    alignItems: 'center',
    padding:20,
    marginTop:10,
    justifyContent:'center',
    marginVertical:10,
  },
  input_container:{
    paddingVertical:20,
    paddingHorizontal:18,
    backgroundColor:Colors.transparent_purple,
    width:'100%',
    borderRadius:45,
    alignItems:'center',
  },
  number_container:{
    backgroundColor:Colors.white,
    borderColor:Colors.red,
    borderWidth:6,
    borderRadius:50,
    paddingHorizontal:10,
    margin:5,
    alignItems:'center',
    marginRight:15,
    justifyContent:'center',
  
  },
  number:{
    color:Colors.red,
    fontFamily:'Poppins',
    fontSize:13,
    
  },
  label: {
    fontSize: 16,
    marginTop:10,
    color:Colors.white,
    fontFamily:'Montserrat',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginLeft:'15%',
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Colors.blue,
  },
  radioButtonText: {
    fontSize: 16,
    color:Colors.white,
  },
  errorMessage: {
    color: Colors.red,
    fontSize: 14,
    fontFamily: 'Montserrat',
    marginBottom: 10,
  },
  bottom:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom:30,
    gap:30,
  },

  icon:{
    width:100,
    height:100,
    resizeMode: 'contain',
    
  },
  logo: {
    width: 120, 
    height: 100,
    resizeMode: 'contain',
  },
  input:{
    height:40,
    borderColor:Colors.purple,
    borderWidth: 0.3,
    paddingHorizontal:15,
    width:'70%',
    borderRadius:25,
    fontFamily: 'Montserrat',
    fontSize:16,
    color:Colors.gray,
    textDecorationLine: 'none',
    backgroundColor:Colors.transparent_light_purple,
    marginLeft:50

  },
  red_link:{
    color: Colors.red,
    fontSize:13,
    fontFamily:'Montserrat',
  },
  text:{
    color: Colors.light_purple,
    fontSize:16,
    fontFamily:'Montserrat',
  },
  text1:{
    color: Colors.blue,
    fontSize:11,
    fontFamily:'Montserrat',
    marginTop:20,
    marginBottom:10,
  },
  title:{
    color: Colors.white,
    fontSize:25,
    fontFamily:'Calistoga',
  },
  link:{
    color: Colors.blue,
    fontSize:16,
    fontFamily:'Montserrat',
  },
});

export default QuestionnaireScreen;
