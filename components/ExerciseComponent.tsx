import React , {useState, useEffect}from 'react';
import { View, Text, TouchableOpacity, Image, Modal, TextInput, StyleSheet} from 'react-native';
import { Colors } from '@/constants/Colors';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useExerciseContext } from './ExerciseContext';  

function extractFirstAndLastNumber(text: string): { setsNumber: string | null, repsNumber: string | null } {
    const numbers = text.match(/\d+/g);
    const setsNumber = numbers ? numbers[0] : null;
    const repsNumber = numbers ? numbers[numbers.length - 1] : null;
    return { setsNumber, repsNumber};
  }
  
  
const ExerciseComponent = React.memo(({ exercise }: { exercise: any }) => {
    const { addExercise, removeExercise , isExerciseInList} = useExerciseContext(); 
    const storageKeyPrefix = `exercise-${exercise.Muscles}-${exercise.WorkOut}`;

    const saveData = async () => {
        try {
            await AsyncStorage.setItem(`${storageKeyPrefix}-sets`, modifiedSetsNumber);
            await AsyncStorage.setItem(`${storageKeyPrefix}-reps`, modifiedRepsNumber);
            await AsyncStorage.setItem(`${storageKeyPrefix}-weight`, modifiedWeight);
            
            console.log("save data");
            
        } catch (e) {
            console.log("Failed to save data", e);
        }
    };

    const loadData = async () => {
        try {
            const savedSets = await AsyncStorage.getItem(`${storageKeyPrefix}-sets`);
            const savedReps = await AsyncStorage.getItem(`${storageKeyPrefix}-reps`);
            const savedWeight = await AsyncStorage.getItem(`${storageKeyPrefix}-weight`);

            if (savedSets !== null) {
                setModifiedSetsNumber(savedSets);
                setTemporarySetsNumber(savedSets); 
            }
            if (savedReps !== null) {
                setModifiedRepsNumber(savedReps);
                setTemporaryRepsNumber(savedReps); 
            }
            if (savedWeight !== null) {
                setModifiedWeight(savedWeight);
                setTemporaryWeight(savedWeight); 
            }

            console.log("load data");
        } catch (e) {
            console.log("Failed to load data", e);
        }
    };
   
    const [isPlusIcon, setIsPlusIcon] = useState(true);

    const { setsNumber, repsNumber } = extractFirstAndLastNumber(exercise['Beginner_Sets'] || '');
    
    const [modifiedSetsNumber, setModifiedSetsNumber] = useState(setsNumber || '');
    const [modifiedRepsNumber, setModifiedRepsNumber] = useState(repsNumber || '');
    const [modifiedWeight, setModifiedWeight] = useState('0');

    const [temporarySetsNumber, setTemporarySetsNumber] = useState(modifiedSetsNumber);
    const [temporaryRepsNumber, setTemporaryRepsNumber] = useState(modifiedRepsNumber);
    const [temporaryWeight, setTemporaryWeight] = useState(modifiedWeight);

    const [isExpanded, setIsExpanded] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        loadData();
    }, [exercise.Muscles,exercise.WorkOut]);

    useEffect(() => {
        saveData();
    }, [modifiedSetsNumber, modifiedRepsNumber, modifiedWeight,]);

    useEffect(() => {
        setIsPlusIcon(!isExerciseInList(exercise));
    }, [isExerciseInList(exercise)]);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const handleIconPress = () => {
        setIsPlusIcon(!isPlusIcon); 

        if (isPlusIcon) {
            addExercise(exercise); 
        } else {
            removeExercise(exercise.WorkOut); 
        }
    };

    const handleModify = () => {
        setModalVisible(true);
    };

    const handleSave = () => {
        setModalVisible(false);
        setModifiedSetsNumber(temporarySetsNumber);
        setModifiedRepsNumber(temporaryRepsNumber);
        setModifiedWeight(temporaryWeight);
    };

    const handleCancel = () => {
        setModalVisible(false);
        setTemporarySetsNumber(modifiedSetsNumber);
        setTemporaryRepsNumber(modifiedRepsNumber);
        setTemporaryWeight(modifiedWeight);
    };
    
    return (
        <View style={{padding:20,backgroundColor:Colors.transparent_blue,marginHorizontal:10, marginVertical:5, borderRadius:20}} >
             <View style={{flexDirection:'row'}} >
                <TouchableOpacity onPress={handleIconPress}>
                     <Image 
                        source={isPlusIcon
                            ? require('../assets/images/plus_icon.png') 
                            : require('../assets/images/cross_icon.png') }
                        style={{width:35, height:35, resizeMode: 'contain', marginRight:30}} />
                </TouchableOpacity>
                <View style={{marginBottom:10}}>
                    <Text style={{color: Colors.white, fontFamily: 'Bitter', fontSize: 20}}>
                        {exercise.WorkOut}
                    </Text>
                    <View style={{flexDirection:'row', gap:10, marginTop:5}}>
                        <Text style={{color: Colors.blue, fontFamily: 'Montserrat', fontSize: 13,}}>
                            {`Sets: ${modifiedSetsNumber || '0'}, Reps: ${modifiedRepsNumber || '0'}, Weight: ${modifiedWeight || '0'} kg`}
                        </Text>
                    
                        <TouchableOpacity onPress={handleModify} style={{backgroundColor:Colors.red,paddingHorizontal:8, paddingVertical:1, borderRadius:5}}>
                            <Text style={{color:Colors.white,fontSize:11, fontFamily: 'Montserrat'}}>Modify</Text>
                        </TouchableOpacity>
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
                            
            </View>
            <Text style={{color: Colors.white, fontFamily: 'Montserrat', fontSize: 12}} numberOfLines={isExpanded ? undefined : 2}>
                {exercise['Explaination']}
            </Text>
            {!isExpanded && (
                <TouchableOpacity onPress={toggleExpanded}>
                <Text style={{color:Colors.blue, fontSize:11}}>Read More</Text>
                </TouchableOpacity>
            )}

            {isExpanded && (
                <TouchableOpacity onPress={toggleExpanded}>
                <Text style={{color:Colors.blue, fontSize:11}}>Read Less</Text>
                </TouchableOpacity>
            )}
            <WebView
            source={{ uri: exercise.Video }}
            style={{width: '100%',height: 200, marginTop:10,}}
            allowsFullscreenVideo 
        />
        </View>
    );
}, (prevProps, nextProps) => {
    return prevProps.exercise === nextProps.exercise;
});



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
});

  export default ExerciseComponent;

  