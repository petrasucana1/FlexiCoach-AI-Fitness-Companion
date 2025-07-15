import React, { useState, useEffect} from 'react';
import { View, Text, Modal, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import StaticLine from '../../components/lines/StaticLine';
import { Colors } from '../../constants/Colors';
import OrangeButton from '../../components/buttons/OrangeButton';
import LittlePurpleButton from '@/components/buttons/LittlePurpleButton';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import MiniExerciseComponent from '@/components/MiniExerciseComponent';
import BodyBackSvgLittle from '../../components/svg/BodyBackSvg_little';
import BodySvgLittle from '../../components/svg/BodySvg_little';
import { useExerciseContext } from '../../components/ExerciseContext';
import {useUser} from '../../components/UserContext';
import { ScrollView } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';



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

interface Ex {
  name: string;
  sets: number;
  reps: number;
  completedSets: number;
  completedReps: number;
  weight?: number; 
}


interface Plan {
  id: string;
  timestamp: any;  // dacă știi că e un string sau Date, poți tipiza mai precis
  exercises: Ex[];  // sau tipizează mai corect decât unknown dacă poți
}


const TrackProgressScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { selectedExercises } = useExerciseContext();
  const { selectedMuscles } = useLocalSearchParams();
  const { getExercisesCount } = useExerciseContext();

  const { user } = useUser();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch(
          `https://project1---flexicoach-default-rtdb.europe-west1.firebasedatabase.app/users/${user.Id}/Plans.json`
        );
        const data = await response.json();

        if (data) {
          // Transformăm obiectul în array și filtrăm planurile valide
          const planList = Object.entries(data)
            .map(([planId, planData]: [string, any]) => {
              if (!planData.exercises) return null;

              const completedExercises = Object.values(planData.exercises).filter(
                (ex: any) => ex.completedSets !== undefined && ex.completedReps !== undefined
              );

              if (completedExercises.length === 0) return null;

              return {
                id: planId,
                timestamp: planData.timestamp,
                exercises: completedExercises,
              };
            })
            .filter((plan): plan is Plan => plan !== null) 
            .sort((a, b) => new Date(b?.timestamp).getTime() - new Date(a?.timestamp).getTime());

          setPlans(planList);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchPlans();
  }, [user]);

  const toggleExpand = (planId: string) => {
    setExpandedPlan(prev => (prev === planId ? null : planId));
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-GB'); // e.g. 16.07.2024
  };


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
  const [expandedExercises, setExpandedExercises] = useState<string[]>([]);

  const toggleExerciseDetails = (workout: string) => {
    if (expandedExercises.includes(workout)) {
      setExpandedExercises(expandedExercises.filter((item) => item !== workout));
    } else {
      setExpandedExercises([...expandedExercises, workout]);
    }
  };

  const renderItem = ({ item }: { item: Exercise }) => {
    const isExpanded = expandedExercises.includes(item.WorkOut);

    return (
      <View style={styles.exerciseContainer}>
        <View style={styles.exerciseRow}>
          <TouchableOpacity
            onPress={() => toggleExerciseDetails(item.WorkOut)}
            style={[styles.checkbox, isExpanded && styles.checkboxChecked]}
          />
          <Text style={styles.exerciseTitle}>{item.WorkOut}</Text>
        </View>
        {isExpanded && (
          <View style={styles.exerciseDetails}>
            <Text style={styles.detailText}>Sets: {item.Beginner_Sets}</Text>
          </View>
        )}
      </View>
    );
  };

  const handlePressOrangeButton = () => {
    router.push('/live-screen');
  };

  const handlePressArrow = () => {
    navigation.goBack();
  };

  const onToggle = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <LinearGradient
      colors={[Colors.black_purple, Colors.dark_purple, Colors.black_purple]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.backgroundImage}
    >
      <View style={styles.topContainer}>
        <View style={styles.logoContainer}>
          <TouchableOpacity onPress={handlePressArrow}>
            <Image source={require('../../assets/images/back_arrow_icon.png')} style={styles.logo} />
          </TouchableOpacity>
        </View>
        <View style={styles.sidebarContainer}>
          <TouchableOpacity onPress={onToggle}>
            <Image source={require('../../assets/images/sidebar_icon.png')} style={styles.sidebarIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Your Progress</Text>
      </View>


      <View style={styles.bottom_screen}>
         <StaticLine />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {plans.map((plan) => (
          <View key={plan.id} style={styles.planContainer}>
            <TouchableOpacity
              style={styles.planHeader}
              onPress={() => toggleExpand(plan.id)}
            >
              <Text style={styles.planDate}>
                {plan.timestamp === plans[0].timestamp
                  ? 'LAST WORKOUT:'
                  : `${formatDate(plan.timestamp)} WORKOUT:`}
              </Text>
              <Ionicons
                name={expandedPlan === plan.id ? 'chevron-up' : 'chevron-down'}
                size={24}
                color={Colors.white}
              />
            </TouchableOpacity>
            {expandedPlan === plan.id && (
              <View style={styles.exerciseList}>
                {plan.exercises.map((exercise, idx) => (
                  <View key={idx} style={styles.exerciseItem}>
                    <Ionicons
                      name={exercise.completedSets > 0 ? 'checkmark-circle' : 'close-circle'}
                      size={24}
                      color={exercise.completedSets > 0 ? Colors.blue : Colors.red}
                    />
                    <View style={styles.exerciseTextContainer}>
                      <Text style={styles.exerciseName}>{exercise.name}</Text>
                      <Text style={styles.exerciseDetail}>{`${exercise.completedSets} sets, ${exercise.completedReps} reps, ${exercise.weight || 0} kg`}</Text>
                    </View>
                  {/*<TouchableOpacity style={styles.actionButton}>
                      <Text style={styles.actionButtonText}>See the mistakes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButtonSecondary}>
                      <Text style={styles.actionButtonText}>Download recording</Text>
                    </TouchableOpacity>*/}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>


    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  sidebarContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  sidebarIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  bottom_screen:{
    alignItems: 'center',
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
    marginHorizontal: 10,
  },
  headerText: {
    fontFamily: 'Calistoga',
    fontSize: 25,
    color: Colors.white,
    textAlign: 'center',
    flex: 1,
  },
  text: {
    fontFamily: 'Calistoga',
    fontSize: 10,
    color: Colors.white,
    textAlign: 'center',
    flex: 1,
    marginBottom: 10,
  },
  exercisesContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  flatListContent: {
    paddingVertical: 10,
  },
  exerciseContainer: {
    marginBottom: 10,
    borderWidth: 3,
    borderColor: Colors.light_purple,
    borderRadius: 25,
    padding: 10,
    backgroundColor: Colors.white,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.dark_purple,
    borderRadius: 10,
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: Colors.dark_purple,
  },
  exerciseTitle: {
    fontSize: 16,
    fontFamily: 'Bitter',
    color: Colors.dark_purple,
  },
  exerciseDetails: {
    marginTop: 10,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Bitter',
    color: Colors.blue_purple,
  },
  buttonContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },

  container: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Calistoga',
    color: Colors.white,
    marginBottom: 20,
    textAlign: 'center',
  },
  planContainer: {
    backgroundColor: Colors.transparent_light_purple,
    borderRadius: 20,
    marginBottom: 20,
    padding: 10,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planDate: {
    fontSize: 18,
    color: Colors.white,
    fontFamily: 'Bitter',
  },
  exerciseList: {
    marginTop: 10,
  },
  exerciseItem: {
    backgroundColor: Colors.black_purple,
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  exerciseTextContainer: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontFamily: 'Bitter',
    color: Colors.white,
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#ccc',
  },
  actionButton: {
    backgroundColor: Colors.blue,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  actionButtonSecondary: {
    backgroundColor: Colors.red,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginLeft: 5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Montserrat',
  },

});

export default TrackProgressScreen;








/*import React, { useState } from 'react';
import { View, Text, Modal, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import StaticLine from '../../components/lines/StaticLine';
import { Colors } from '../../constants/Colors';
import OrangeButton from '../../components/buttons/OrangeButton';
import LittlePurpleButton from '@/components/buttons/LittlePurpleButton';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import MiniExerciseComponent from '@/components/MiniExerciseComponent';
import BodyBackSvgLittle from '../../components/svg/BodyBackSvg_little';
import BodySvgLittle from '../../components/svg/BodySvg_little';
import { useExerciseContext } from '../../components/ExerciseContext';

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

const TrackProgressScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { selectedExercises } = useExerciseContext();
  const { selectedMuscles } = useLocalSearchParams();
  const { getExercisesCount } = useExerciseContext();

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
  const [expandedExercises, setExpandedExercises] = useState<string[]>([]);

  const toggleExerciseDetails = (workout: string) => {
    if (expandedExercises.includes(workout)) {
      setExpandedExercises(expandedExercises.filter((item) => item !== workout));
    } else {
      setExpandedExercises([...expandedExercises, workout]);
    }
  };

  const renderItem = ({ item }: { item: Exercise }) => {
    const isExpanded = expandedExercises.includes(item.WorkOut);

    return (
      <View style={styles.exerciseContainer}>
        <View style={styles.exerciseRow}>
          <TouchableOpacity
            onPress={() => toggleExerciseDetails(item.WorkOut)}
            style={[styles.checkbox, isExpanded && styles.checkboxChecked]}
          />
          <Text style={styles.exerciseTitle}>{item.WorkOut}</Text>
        </View>
        {isExpanded && (
          <View style={styles.exerciseDetails}>
            <Text style={styles.detailText}>Sets: {item.Beginner_Sets}</Text>
          </View>
        )}
      </View>
    );
  };

  const handlePressOrangeButton = () => {
    router.push('/live-screen');
  };

  const handlePressArrow = () => {
    navigation.goBack();
  };

  const onToggle = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <LinearGradient
      colors={[Colors.black_purple, Colors.dark_purple, Colors.black_purple]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.backgroundImage}
    >
      <View style={styles.topContainer}>
        <View style={styles.logoContainer}>
          <TouchableOpacity onPress={handlePressArrow}>
            <Image source={require('../../assets/images/back_arrow_icon.png')} style={styles.logo} />
          </TouchableOpacity>
        </View>
        <View style={styles.sidebarContainer}>
          <TouchableOpacity onPress={onToggle}>
            <Image source={require('../../assets/images/sidebar_icon.png')} style={styles.sidebarIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Track Your Progress</Text>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.text}>Tick the exercises done and change the number of sets/repetitions if necessary</Text>
      </View>

      <View style={styles.bottom_screen}>
         <StaticLine />
      </View>

      <View style={styles.exercisesContainer}>
        <FlatList
          data={selectedExercises}
          renderItem={renderItem}
          keyExtractor={(item) => item.WorkOut}
          contentContainerStyle={styles.flatListContent}
        />
      </View>

      <View style={styles.buttonContainer}>
        <OrangeButton onPress={handlePressOrangeButton} title="Start Workout" />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  sidebarContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  sidebarIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  bottom_screen:{
    alignItems: 'center',
    marginBottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginHorizontal: 10,
  },
  headerText: {
    fontFamily: 'Calistoga',
    fontSize: 25,
    color: Colors.white,
    textAlign: 'center',
    flex: 1,
  },
  text: {
    fontFamily: 'Calistoga',
    fontSize: 10,
    color: Colors.white,
    textAlign: 'center',
    flex: 1,
    marginBottom: 10,
  },
  exercisesContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  flatListContent: {
    paddingVertical: 10,
  },
  exerciseContainer: {
    marginBottom: 10,
    borderWidth: 3,
    borderColor: Colors.light_purple,
    borderRadius: 25,
    padding: 10,
    backgroundColor: Colors.white,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.dark_purple,
    borderRadius: 10,
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: Colors.dark_purple,
  },
  exerciseTitle: {
    fontSize: 16,
    fontFamily: 'Bitter',
    color: Colors.dark_purple,
  },
  exerciseDetails: {
    marginTop: 10,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Bitter',
    color: Colors.blue_purple,
  },
  buttonContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
});

export default TrackProgressScreen;
*/