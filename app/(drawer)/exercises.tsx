import React, {useState, useEffect} from 'react';
import { View, Text, Modal, Image, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import StaticLine from '../../components/lines/StaticLine';
import {Colors} from '../../constants/Colors';
import OrangeButton from '../../components/buttons/OrangeButton';
import LittlePurpleButton from '@/components/buttons/LittlePurpleButton';
import BodyBackSvg from '../../components/svg/BodyBackSvg';
import BodySvg from '../../components/svg/BodySvg';
import { useNavigation } from '@react-navigation/native';
import DrawerLayout from "@/app/(drawer)/_layout"
import { DrawerActions } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import exercises from '../../assets/data__for_testing/exercises+video.json'
import ExerciseComponent from '@/components/ExerciseComponent';
import { TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useExerciseContext } from '../../components/ExerciseContext';
import MiniExerciseComponent from '@/components/MiniExerciseComponent';
import { gql, useQuery } from '@apollo/client';
import BodyBackSvgLittle from '../../components/svg/BodyBackSvg_little';
import BodySvgLittle from '../../components/svg/BodySvg_little';


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

const ExercisesScreen = () => {


  const exercise= exercises[0];

  const router = useRouter(); 

  const navigation = useNavigation(); 

  const { selectedExercises } = useExerciseContext();

  const { selectedMuscles } = useLocalSearchParams(); 

  const { getExercisesCount} = useExerciseContext(); 

  let muscles: string[] = [];

  if (typeof selectedMuscles === 'string') {
    try {
      muscles = JSON.parse(selectedMuscles);
    } catch (e) {
      muscles = selectedMuscles.split(',');
    }
  } else if (Array.isArray(selectedMuscles)) {
    muscles = selectedMuscles;
  }
  
  const [activeMuscle, setActiveMuscle] = useState(muscles[0]);
  
  const { data, refetch: refetch } = useQuery(EXERCISES_QUERY, {
    variables: { muscle: activeMuscle, name: '' },
    fetchPolicy: "cache-first",
  });

  const { data: VideosData} = useQuery(VIDEOS_QUERY, {
    variables: {},
    fetchPolicy: "cache-first",
  });

  useEffect(() => {
    refetch({ muscle: activeMuscle, name: '' });
  }, [activeMuscle]);

  console.log(data)

  const exercisesData: Exercise[] = data?.exercises?.map((exercise: ExercisesResponse) => {
    
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
  

  console.log(exercisesData)
  
  const filteredExercises = exercisesData?.filter(exercise  => exercise.Muscles.toLowerCase() === activeMuscle);

  console.log(filteredExercises)

  const [searchQuery, setSearchQuery]= useState("");

  const [filteredExercisesSearch, setFilteredExercisesSearch] = useState(filteredExercises);

  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = React.useCallback(({ item }:{ item: any }) => {
    return <ExerciseComponent exercise={item} />;
  }, [filteredExercisesSearch]);

  
  const renderItemInModal = ( { item }:{ item: Exercise } ) => {
    return <MiniExerciseComponent 
              exercise={item}
              planId=""
              />
  };
  
  const handlePressOrangeButton=() => {
   router.push('/live-screen'); 
   //router.push('/(drawer)/track_progress'); 
  };

  const handlePress1 = (muscle: string) => {
   
  };

  const handlePressArrow = () => {
    navigation.goBack();
  };

  const handleXModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    if (exercisesData.length > 0) {
      const filtered = exercisesData.filter(
        (exercise) => exercise.Muscles.toLowerCase() === activeMuscle.toLowerCase()
      );
      setFilteredExercisesSearch(filtered);
    }
  }, [activeMuscle, data]);
  
  const handlePurpleButton = React.useCallback((muscle: string) => {
    setActiveMuscle(muscle);   
  }, [exercisesData]);


  
  const handleSearch = (query: string) =>{
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredExercisesSearch(filteredExercises);
    } else {
      const filtered = filteredExercises.filter((exercise) =>
        exercise.WorkOut.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredExercisesSearch(filtered);
    }
  }

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredExercisesSearch(filteredExercises);
  }

  const onToggle = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  }

  const openModal = () => {
    setModalVisible(true);
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
       <TouchableOpacity onPress={handlePressArrow}>
        <Image source={require('../../assets/images/back_arrow_icon.png')} style={styles.logo} />
        </TouchableOpacity>
      </View>
      <View style={styles.sidebar_container}>
        <TouchableOpacity onPress={onToggle}>
          <Image source={require('../../assets/images/sidebar_icon.png')} style={styles.sidebar_icon} />
        </TouchableOpacity>
      </View>
    </View>

    <View style={styles.middle_container}>
        <FlatList
          data={muscles}
          renderItem={({ item }) => (
            <LittlePurpleButton
              key={item}
              onPress={() => handlePurpleButton(item)}
              title={item}
              backgroundColor={activeMuscle === item ? Colors.light_purple : Colors.transparent_light_purple}
              textColor={activeMuscle === item ? Colors.white : Colors.white}
            />
          )}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      </View>

      <View style={{ flex: 1, marginHorizontal: 50 }}>
        <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            backgroundColor: Colors.white, 
            borderRadius: 50, 
            paddingHorizontal: 20, 
            paddingVertical: 6 
          }}>
          <TextInput
            placeholder='Search Exercise'
            style={{ flex: 1 }}
            autoCapitalize='none'
            autoCorrect={false}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length === 0 ? (
              <Ionicons name="search" size={30} color={Colors.blue} />
            ) : (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={30} color={Colors.blue} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      

      <View style={styles.exercises_container}>
          <FlatList
            data={filteredExercisesSearch}
            renderItem={renderItem}
            keyExtractor={(item) => item.WorkOut}
            />
      </View>


    <View style={styles.bottom_screen}>
         <StaticLine />
      </View>

    
    <TouchableOpacity
        style={styles.floatingButton}
        onPress={openModal}
        >
        <Text style={styles.buttonText}>PLAN</Text>

        <View style={styles.exercisesCountBubble}>
          <Text style={styles.bubbleText}>{getExercisesCount()}</Text>
        </View>

    </TouchableOpacity>


    <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
    >
        <View style={styles.modalContainer}>
          <View style={{alignSelf:'flex-end',marginTop:5, marginRight:5}}>
            <TouchableOpacity onPress={handleXModal}>
              <Ionicons name="close-circle" size={35} color={Colors.blue} />
            </TouchableOpacity>
          </View>
          <View style={{flexDirection:'row', marginVertical:5,marginHorizontal:10,alignItems:'center'}}>
            <BodySvgLittle selected={muscles} onPress={handlePress1} /> 
            <View style={{flex: 1, paddingHorizontal: 5}}> 
                <Text style={{
                fontFamily: 'Calistoga', 
                fontSize: 25, 
                color: Colors.dark_purple, 
                textAlign: 'center', 
                flexShrink: 1
                }}>
                This is your Today's Workout Plan
                </Text>
            </View>
            <BodyBackSvgLittle selected={muscles} onPress={handlePress1} />
          </View>
          <StaticLine />
          <View style={styles.exercises_container_modal}>   
            <FlatList
              data={selectedExercises}
              renderItem={renderItemInModal}
              keyExtractor={(item) => item.WorkOut}
              />

          </View>

          <View style={styles.orange_button_modal}>
            <OrangeButton 
                  onPress={handlePressOrangeButton} 
                  title="Start Workout" 
          />
          </View>
        
        </View>
    </Modal>

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
    paddingTop:25,
    paddingLeft:20,
  },
  sidebar_container:{
    flex:1,
    alignItems:'flex-end',
    paddingTop:30,
    paddingRight:20,
  },
  middle_container: {
    flex: 1,
    justifyContent:"flex-start",

  },
  exercises_container:{
    flex:10,
    
  },
  flatListContent: {
    paddingVertical: 10, 
  },
  bottom_screen:{
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom:30,
  },

  icon:{
    width:70,
    height:30,
    resizeMode: 'contain',
    opacity: 0.8,
    
  },
  logo: {
    width: 30, 
    height: 30,
    resizeMode: 'contain',
  },
  sidebar_icon:{
    width: 25, 
    height: 25,
    resizeMode: 'contain',
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
  floatingButton: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    backgroundColor: Colors.white,
    borderRadius: 50,
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderColor:Colors.blue,
    borderWidth:5,
  },
  buttonText: {
    color: Colors.blue,
    fontSize: 20,
    fontFamily:'Bitter',
  },
  exercisesCountBubble: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.red,
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bubbleText: {
    color: Colors.white,
    fontSize: 13,
    fontFamily:'Bitter',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    margin:'5%',
    borderRadius:25,
    borderColor:Colors.blue,
    borderWidth:5,
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
  orange_button_modal:{
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom:20,
    paddingTop:20,
    gap:30,
  },
});

export default ExercisesScreen;
