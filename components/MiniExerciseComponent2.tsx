import React , {useState, useEffect}from 'react';
import { View, Text, TouchableOpacity, Image, Modal, TextInput, StyleSheet} from 'react-native';
import { Colors } from '@/constants/Colors';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useExerciseContext } from './ExerciseContext2';  
import { Ionicons } from '@expo/vector-icons';
import BodySvgComponent from './svg/BodySvg_component';
import BodyBackSvgComponent from './svg/BodyBackSvg_compoonent';
import { gql, useMutation, useQuery} from '@apollo/client';
import {useUser} from './UserContext';

const ADD_EXERCISE = gql`
   mutation AddExerciseToPlan($id: ID!, $planId: ID!, $name: String!, $sets: Int, $reps: Int, $weight: Int) {
        addExerciseToPlan(
            id: $id
            planId: $planId
            reps: $reps
            sets: $sets
            weight: $weight
            name: $name
        ) {
            name
        }
    }
`;

const CHECK_EXERCISE = gql`
   query CheckExerciseExistsInPlan($id: ID!, $planId: ID!, $name: String!) {
        checkExerciseExistsInPlan(
            id: $id
            planId: $planId 
            name: $name
        ) {
            name
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

interface MiniExerciseComponent2Props{
    exercise: Exercise;
    orderNumber: number;
    planId: string;
    showIcon: boolean;
}

const MiniExerciseComponent2: React.FC<MiniExerciseComponent2Props> = ({exercise,orderNumber,planId,showIcon}) =>{
    const [sets, setSets] = useState<string | null>("3");
    const [reps, setReps] = useState<string | null>("15");
    const [weight, setWeight] = useState<string | null>(null);

    const [isArrowIconExtended, setIsArrowIconExtended] = useState(false);
 
    const [modifiedSetsNumber, setModifiedSetsNumber] = useState(sets || '');
    const [modifiedRepsNumber, setModifiedRepsNumber] = useState(reps || '');
    const [modifiedWeight, setModifiedWeight] = useState(weight || '0');

    const [temporarySetsNumber, setTemporarySetsNumber] = useState(modifiedSetsNumber);
    const [temporaryRepsNumber, setTemporaryRepsNumber] = useState(modifiedRepsNumber);
    const [temporaryWeight, setTemporaryWeight] = useState(modifiedWeight);

    const [isExpanded, setIsExpanded] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);


    const storageKeyPrefix = `exercise2-${exercise.Muscles}-${exercise.WorkOut}`;

    const { addExercise, removeExercise , isExerciseInList} = useExerciseContext(); 


    const {user}= useUser();
        const [addExerciseToPlan, { loading, error, data }] = useMutation(ADD_EXERCISE);    
        const { data: sameExercises, refetch } = useQuery(CHECK_EXERCISE, {
            variables: {
              id: user.Id,
              planId: planId,
              name: exercise.WorkOut,
            },
            fetchPolicy: 'network-only', // Always fetch from the network
            skip: !user.Id || !planId || !exercise.WorkOut, // Dacă datele nu sunt disponibile, nu face query
          });
        
    useEffect(() => {
            if (modifiedSetsNumber && modifiedRepsNumber && modifiedWeight) {
              refetch({
                id: user.Id,
                planId: planId,
                name: exercise.WorkOut,
              });
            }
          }, [modifiedSetsNumber, modifiedRepsNumber, modifiedWeight, planId, exercise.WorkOut, user.Id, refetch]);
    
    useEffect(() => {
    
            if (planId && modifiedSetsNumber && modifiedRepsNumber && modifiedWeight) {
    
                if(sameExercises?.checkExerciseExistsInPlan?.length === 0) {
                    addExerciseToPlan({
                        variables: {
                            id: user.Id,
                            planId: planId,
                            name: exercise.WorkOut,
                            sets: parseInt(modifiedSetsNumber),
                            reps: parseInt(modifiedRepsNumber),
                            weight: parseInt(modifiedWeight),
                        },
                    })
                    .then(response => {
                        console.log('Exercițiul a fost adăugat:', response.data.addExerciseToPlan.name);
                    })
                    .catch(err => {
                        console.error('Eroare la adăugarea exercițiului:', err);
                    });
                    
                }else if (sameExercises?.checkExerciseExistsInPlan?.length > 0) {
                    const sameExercise = sameExercises.checkExerciseExistsInPlan[0];
                }
                
            }
        }, [sameExercises]);

    const loadData = async () => {
        try {
            const savedSets = await AsyncStorage.getItem(`${storageKeyPrefix}-sets`);
            const savedReps = await AsyncStorage.getItem(`${storageKeyPrefix}-reps`);
            const savedWeight = await AsyncStorage.getItem(`${storageKeyPrefix}-weight`);
    
            if (savedSets !== null) {
                setSets(savedSets);
                setModifiedSetsNumber(savedSets); 
            }
            if (savedReps !== null) {
                setReps(savedReps);
                setModifiedRepsNumber(savedReps); 
            }
            if (savedWeight !== null) {
                setWeight(savedWeight);
                setModifiedWeight(savedWeight);
            }
    
        } catch (e) {
            console.log("Failed to load data", e);
        }
    };
    

  
    useEffect(() => {
        loadData();
    }, [exercise.Muscles,exercise.WorkOut]);

    useEffect(() => {
        if (modalVisible) {
            setTemporarySetsNumber(modifiedSetsNumber); 
            setTemporaryRepsNumber(modifiedRepsNumber);
            setTemporaryWeight(modifiedWeight);
        }
    }, [modalVisible, modifiedSetsNumber, modifiedRepsNumber, modifiedWeight]);
    

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const handleIconPress = () => {
        removeExercise(exercise.WorkOut); 
    };

    const handleModify = () => {
        setModalVisible(true);
    };

    const handleSave = async () => {
        setModalVisible(false);
        setModifiedSetsNumber(temporarySetsNumber);
        setModifiedRepsNumber(temporaryRepsNumber);
        setModifiedWeight(temporaryWeight);
        
        try {
            await AsyncStorage.setItem(`${storageKeyPrefix}-sets`, temporarySetsNumber || '');
            await AsyncStorage.setItem(`${storageKeyPrefix}-reps`, temporaryRepsNumber || '');
            await AsyncStorage.setItem(`${storageKeyPrefix}-weight`, temporaryWeight || '');
        } catch (e) {
            console.error("Failed to save data", e);
        }
    };
    

    const handleCancel = () => {
        setModalVisible(false);
        setTemporarySetsNumber(modifiedSetsNumber);
        setTemporaryRepsNumber(modifiedRepsNumber);
        setTemporaryWeight(modifiedWeight);
    };

    const handleExtensionIcon =() =>{
        setIsArrowIconExtended(!isArrowIconExtended); 
    }

    const handlePress1 = (muscle: string) => {
   
    };
    
    return (
        <View style={{paddingHorizontal:15,paddingVertical:10,backgroundColor:Colors.transparent_light_purple, marginVertical:5, borderRadius:20}} >
          <View style={{flexDirection:'row',  justifyContent: 'space-between', alignItems: 'center' }} >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
             {showIcon ? (
                <TouchableOpacity onPress={handleIconPress}>
                     <Image 
                        source={require('../assets/images/cross_icon.png') }
                        style={{width:25, height:25, resizeMode: 'contain', marginRight:10}} />
                </TouchableOpacity>
             ):(
                <View style={styles.circle}>
                         <Text style={styles.orderText}>{orderNumber}</Text>
                </View>
             )}
                <View style={{marginBottom:10}}>
                   
                    <Text style={{color: Colors.light_purple, fontFamily: 'Bitter', fontSize: 20}}>
                        {exercise.WorkOut}
                    </Text>
                  
                    <View style={{flexDirection:'row', gap:10, marginTop:0}}>
                        <Text style={{color: Colors.dark_purple, fontFamily: 'Montserrat', fontSize: 13,}}>
                            {`Sets: ${modifiedSetsNumber || '-'}, Reps: ${modifiedRepsNumber || '-'}, Weight: ${modifiedWeight || '-'} kg`}
                        </Text>
                        {showIcon && (
                    
                        <TouchableOpacity onPress={handleModify} style={{backgroundColor:Colors.red,paddingHorizontal:8, paddingVertical:1, borderRadius:5}}>
                            <Text style={{color:Colors.white,fontSize:11, fontFamily: 'Montserrat'}}>Modify</Text>
                        </TouchableOpacity>
                        )}
                    </View>
                </View>
                </View>
            
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={styles.modalTitle}>Sets:</Text>

                            <TextInput
                            style={styles.input}
                            placeholder="Enter Sets Number"
                            keyboardType="numeric"
                            value={temporarySetsNumber}
                            onChangeText={setTemporarySetsNumber}
                            />
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={styles.modalTitle}>Reps:</Text>

                            <TextInput
                            style={styles.input}
                            placeholder="Enter Reps Number"
                            keyboardType="numeric"
                            value={temporaryRepsNumber}
                            onChangeText={setTemporaryRepsNumber}
                            />
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={styles.modalTitle}>Weight:</Text>

                            <TextInput
                            style={styles.input}
                            placeholder="Enter Weight"
                            keyboardType="numeric"
                            value={temporaryWeight}
                            onChangeText={setTemporaryWeight}
                            />
                        </View>

                        <View style={styles.modalButtons}>
                        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                    </View>
                </Modal>

                <View style={{alignSelf:'flex-start', marginRight:5, marginLeft:10}}>
                    <TouchableOpacity onPress={handleExtensionIcon}>
                        {isArrowIconExtended
                        ? (<Ionicons name="chevron-up-outline" size={35} color={Colors.dark_purple} />)
                        : (<Ionicons name="chevron-down-outline" size={35} color={Colors.dark_purple} />)
                        }
                    </TouchableOpacity>
                </View>
                

                            
            </View>
                 
            <View>
             {isArrowIconExtended && (
                <View>

                <Text style={{color: Colors.dark_purple, fontFamily: 'Montserrat', fontSize: 12}} numberOfLines={isExpanded ? undefined : 2}>
                    {exercise['Explaination']}
                </Text>
                
                {!isExpanded && (
                    <TouchableOpacity onPress={toggleExpanded}>
                    <Text style={{color: Colors.blue, fontSize: 11}}>Read More</Text>
                    </TouchableOpacity>
                )}

                {isExpanded && (
                    <TouchableOpacity onPress={toggleExpanded}>
                    <Text style={{color: Colors.blue, fontSize: 11}}>Read Less</Text>
                    </TouchableOpacity>
                )}

                
                <View style={{flexDirection:'row', justifyContent:'center'}}>
                    <BodySvgComponent selected={[exercise.Muscles.toLowerCase()]} onPress={handlePress1} /> 
                    <BodyBackSvgComponent selected={[exercise.Muscles.toLowerCase()]} onPress={handlePress1} />
                </View>

                <WebView
                    source={{ uri: exercise.Video }}
                    style={{width: '100%', height: 200, marginTop: 10}}
                    allowsFullscreenVideo 
                />
                </View>
            )}
                
            </View>
            
        
        </View>
    );
};



const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '60%',
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 13,
    fontFamily: 'Bitter',
    marginTop:5,
  },
  input: {
    width: '60%',
    paddingVertical: 3,
    paddingHorizontal:20,
    borderWidth: 2,
    borderColor: Colors.blue,
    borderRadius: 50,
    marginBottom: 10,
    marginLeft:10,
    fontFamily: 'Bitter',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop:5,
    width: '100%',
  },
  saveButton: {
    backgroundColor: Colors.blue,
    padding: 10,
    borderRadius: 50,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.white,
    fontFamily: 'Bitter',
  },
  cancelButton: {
    backgroundColor: Colors.red,
    padding: 10,
    borderRadius: 50,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Colors.white,
    fontFamily: 'Bitter',
  },
  circle: {
    width: 30,  
    height: 30, 
    borderRadius: 20,  
    backgroundColor: Colors.blue, 
    justifyContent: 'center', 
    alignItems: 'center',  
    marginRight: 10,  
  },
  orderText: {
    color: Colors.white, 
    fontSize: 15,  
    fontWeight: 'bold',  
  },
});

  export default MiniExerciseComponent2;

  