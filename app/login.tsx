import React, {useState, useEffect, useContext} from 'react';
import { View, Text, TextInput, Image, StyleSheet} from 'react-native';
import { Link,useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import StaticLine from '../components/lines/StaticLine';
import {Colors} from '../constants/Colors';
import PurpleButton from '../components/buttons/PurpleButton';
import { gql, useQuery } from '@apollo/client';
import {useUser} from '../components/UserContext';
import SplitWorkouts from '../assets/data__for_testing/split_workot.json'
import { useExerciseContext } from '../components/ExerciseContext2';

interface Exercise {
  Muscles: string;
  WorkOut: string;
  Intensity_Level: string; 
  Beginner_Sets: string; 
  Intermediate_Sets: string;
  Expert_Sets: string;
  Equipment: string; 
  Explaination: string; 
  Long_Explanation: string; 
  Video: string; 
  
}

interface ExercisesResponse {
  name: string;
  muscle: string;
  difficulty: string,
  equipment: string,
  instructions: string,
  
}

const EXERCISES_QUERY= gql`
query exercises($muscle: String, $name: String) {
  exercises(muscle: $muscle, name: $name) {
    name
    muscle
    difficulty
    equipment
    instructions
  }
}
`;

const GET_QUESTIONNAIRES= gql`
query getQuestionnaires {
  getQuestionnaires {
    name
    value {
      Days
      Height
      Level
      Purpose
      Time
      UserId
      Weight
    }
  }
}
`;

const GET_USER_BY_EMAIL= gql`
query GetUserByEmail($email: String!) {
  getUserByEmail(Email: $email) {
    name
    value {
      Email
      FirstName
      Gender
      LastName
      Password
    }
  }
}
`;

const VIDEOS_QUERY= gql`
query GetVideos {
  getVideos {
    name
    value {
      name
      videoId
    }
  }
}
`;

const getRandomExercises = (exercises: any[], count: number) => {
  const shuffled = exercises.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const LoginScreen = () => {

  const router = useRouter();
  const {daysDone, setDaysDone, alternate, setAlternate,user,setUser, questionnaire, setQuestionnaire,screen,setScreen}= useUser();
  const {clearExercises} = useExerciseContext();
  const [activeMuscle, setActiveMuscle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword]= useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const {data:userData} = useQuery(GET_USER_BY_EMAIL, {
      variables: { email: email},
    });
  const { data: questionnaireData } = useQuery(GET_QUESTIONNAIRES);
  const { data , refetch} = useQuery(EXERCISES_QUERY, {
      variables: { muscle: activeMuscle, name: '' },
    });
    const { data: VideosData} = useQuery(VIDEOS_QUERY, {
        variables: {},
        fetchPolicy: "cache-first",
      });

  const [muscles, setMuscles] = useState<string | null>(null);
  const [mQuestionnaire, setMQuestionnaire] = useState(null);
  const [dataReady, setDataReady] = useState(false);
  const [musclesArray1, setMusclesArray1] = useState<string[]>([]);
  const [exercisesToAdd1, setExercisesToAdd1] = useState<Exercise[]>([]);

  const exercisesData: Exercise[] = data?.exercises?.map((exercise: ExercisesResponse) => {
      // Căutăm videoclipul corespunzător exercițiului
      const videoInfo = VideosData?.getVideos?.find(
        (video: any) => video.value.name.toLowerCase() === exercise.name.toLowerCase()
      );
      console.log(videoInfo)
  
      const videoId = videoInfo?.value.videoId || '';
  
      return {
        Muscles: exercise.muscle.toLowerCase(),
        WorkOut: exercise.name,
        Intensity_Level: exercise.difficulty,
        Equipment: exercise.equipment,
        Explaination: exercise.instructions,
        Beginner_Sets: '3 sets of 10 reps',
        Intermediate_Sets: '4 sets of 12 reps',
        Expert_Sets: '5 sets of 15 reps',
        Long_Explanation: 'This is a default long explanation.',
        Video: videoId ? `https://www.youtube.com/embed/${videoId}` : 'https://www.youtube.com/embed/3cD5UFWsNOA', // Construim linkul video
        
        
      };
    }) || [];

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  

  const handlePress = () => {
    if (!email || !password) {
      setErrorMessage('All fields are required.');
      return;
    }

    if(userData.getUserByEmail.length === 0) {
      setErrorMessage('Invalid email');
      return
    }else if(userData.getUserByEmail.length > 0){
        const user_data=userData.getUserByEmail[0];
        if(user_data.value.Password !== password){
          setErrorMessage('Invalid password');
          return
        }else{
          setUser({
            Id: user_data.name,
            Email: user_data.value.Email,
            FirstName: user_data.value.FirstName,
            Gender: user_data.value.Gender,
            LastName: user_data.value.LastName,
            Password: user_data.value.Password,
          });
          if (questionnaireData && questionnaireData.getQuestionnaires) {
              const matchedQuestionnaire = questionnaireData?.getQuestionnaires.find((q: { value: { UserId: string } }) => 
              q.value.UserId === user_data.name
            );
            if (matchedQuestionnaire) {
              setMQuestionnaire(matchedQuestionnaire);
              console.log('✅ Matched Questionnaire:', mQuestionnaire);
              setQuestionnaire(matchedQuestionnaire);
              generateWorkout(matchedQuestionnaire);
              setScreen('home_2');
            }
            else 
            {
              setScreen('home_1');
              router.push('/(drawer)/home_1');
              
            }
          }
 
        }
    }
    setErrorMessage('');  
  };

  const generateWorkout = (matchedQuestionnaire: any) => {
    const filteredWorkouts = SplitWorkouts.filter(item => 
        item["Number Of Days"] === Number(matchedQuestionnaire.value.Days) &&
        item["Gender"] === (user.Gender.charAt(0).toUpperCase() + user.Gender.slice(1).toLowerCase())

    );
    filteredWorkouts.forEach(item => {
        if (item["Alternate"]){
            if (item["Alternate"]==1) { 
                setAlternate(2);
                item["Alternate"] = 2; 
            }else{
                setAlternate(1);
                item["Alternate"] = 1; 
            }}
        
    });

    const musclesArray: string[] = filteredWorkouts.reduce((acc: string[], workout) => {
        if(daysDone > Number(matchedQuestionnaire.value.Days))
            setDaysDone(1);
        if (daysDone === 1 || daysDone == 3 || daysDone==4 || daysDone==5) {
            const dayMuscles = workout[`Day${daysDone}`];
            if (dayMuscles) {  
                const musclesArray = dayMuscles.split(',').map(muscle => muscle.trim());
                return acc.concat(musclesArray);
            }
        }else if(daysDone==2 && Number(matchedQuestionnaire.value.Days)==2){
            if(alternate==1){
                const dayMuscles = workout[`Day2_1`];
                if (dayMuscles) {  
                    const musclesArray = dayMuscles.split(',').map(muscle => muscle.trim());
                    return acc.concat(musclesArray);
                }
            }else{
                const dayMuscles = workout[`Day2_2`];
                if (dayMuscles) {  
                    const musclesArray = dayMuscles.split(',').map(muscle => muscle.trim());
                    return acc.concat(musclesArray);
                }
            }
        }else if(daysDone==2 && Number(matchedQuestionnaire.value.Days)==3){
            if(user.Gender=='Female'){
                if(alternate==1){
                    const dayMuscles = workout[`Day2_1`];
                    if (dayMuscles) {  
                        const musclesArray = dayMuscles.split(',').map(muscle => muscle.trim());
                        return acc.concat(musclesArray);
                    }
                }else{
                    const dayMuscles = workout[`Day2_2`];
                    if (dayMuscles) {  
                        const musclesArray = dayMuscles.split(',').map(muscle => muscle.trim());
                        return acc.concat(musclesArray);
                    }
                }
            }else{
                const dayMuscles = workout[`Day${daysDone}`];
                if (dayMuscles) {  
                    const musclesArray = dayMuscles.split(',').map(muscle => muscle.trim());
                    return acc.concat(musclesArray);
                }
            }
        }
        
        return acc;
    }, []);

    setMusclesArray1(musclesArray);
  }
  
  useEffect(() => {
    if (musclesArray1.length > 0) {
      const fetchExercisesForMuscles = async () => {
        const allExercises: Exercise[] = [];
  
        for (const muscle of musclesArray1) {
          console.log('🏋️‍♂️ Processing Muscle:', muscle);
          
          const { data } = await refetch({ muscle, name: '' });
  
          if (data?.exercises) {
            const exercises = data.exercises.map((exercise: ExercisesResponse) => {
              
              const videoInfo = VideosData?.getVideos?.find(
                (video:any) => video.value.name.toLowerCase() === exercise.name.toLowerCase()
              );
  
              console.log(videoInfo);
  
              const videoId = videoInfo?.value.videoId || '';
  
              return {
                Muscles: exercise.muscle.toLowerCase(),
                WorkOut: exercise.name,
                Intensity_Level: exercise.difficulty,
                Equipment: exercise.equipment,
                Explaination: exercise.instructions,
                Beginner_Sets: '3 sets of 10 reps',
                Intermediate_Sets: '4 sets of 12 reps',
                Expert_Sets: '5 sets of 15 reps',
                Long_Explanation: 'This is a default long explanation.',
                Video: videoId 
                  ? `https://www.youtube.com/embed/${videoId}` 
                  : 'https://www.youtube.com/embed/3cD5UFWsNOA'
              };
            });
            const randomExercises = getRandomExercises(exercises, 1);
            allExercises.push(...randomExercises);
          }
        }
  
        setExercisesToAdd1(allExercises);
        setDataReady(true);
      };
  
      fetchExercisesForMuscles();
    }
  }, [musclesArray1]);

  useEffect(() => {
    if (dataReady && exercisesToAdd1.length > 0 && musclesArray1.length > 0) {
      clearExercises()////o sa fac clear dupa ce executa planul, dar momentan e necesar aici
      router.push({ 
        pathname: '/(drawer)/home_2',
        params: { 
            exercisesToAdd: JSON.stringify(exercisesToAdd1),
            musclesArray: JSON.stringify(musclesArray1)
        } 
    });
    }
  }, [dataReady]);
  
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
        <Image source={require('../assets/images/user_icon.png')} style={styles.icon} />
        <View style={styles.input_container}>
        {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}
            <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor={Colors.gray}
                onChangeText={setEmail}
                value={email}
                />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={Colors.gray}
                onChangeText={setPassword}
                value={password}
                secureTextEntry={true}
                />
            <Link href="/start-screen" style={styles.link}>Forgot password?</Link>
        </View>
        <PurpleButton 
                onPress={handlePress} 
                title="LOGIN" 
         />
      </View>

      <View style={styles.bottom}>
         <Text style={styles.text}>Don't have an account?  <Link href="/training-prefference" style={styles.link}>Sign up now</Link></Text>
        
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
    flex: 1,
    alignItems: 'center',
    padding:30,
    gap:40,
    justifyContent:'center',
    marginBottom:20,
  },
  input_container:{
    padding:30,
    backgroundColor:Colors.transparent_purple,
    width:'100%',
    borderRadius:45,
    gap:20,
    alignItems:'center'
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
    height:50,
    borderColor:Colors.purple,
    borderWidth: 0.3,
    paddingHorizontal:15,
    width:'100%',
    borderRadius:25,
    fontFamily: 'Montserrat',
    fontSize:17,
    color:Colors.gray,
    textDecorationLine: 'none',
    backgroundColor:Colors.transparent_gray,
  },
  text:{
    color: Colors.light_purple,
    fontSize:16,
    fontFamily:'Montserrat',
  },
  link:{
    color: Colors.blue,
    fontSize:16,
    fontFamily:'Montserrat',
  },
});

export default LoginScreen;
