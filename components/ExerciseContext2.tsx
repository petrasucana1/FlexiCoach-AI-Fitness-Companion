import React, {createContext, useState, useEffect,useContext, ReactNode} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

interface ExerciseContextType{
    selectedExercises2: Exercise[];
    setSelectedExercises2: React.Dispatch<React.SetStateAction<Exercise[]>>;
    addExercise: (exercise: Exercise) => void;
    removeExercise: (exerciseName: string) => void;
    isExerciseInList: (exercise: Exercise) => boolean;
    getExercisesCount: () => number;
    clearExercises: () => void;
}

const defaultContextValue: ExerciseContextType={
    selectedExercises2:[],
    setSelectedExercises2:() =>[],
    addExercise:() =>{},
    removeExercise:()=> {},
    isExerciseInList:() =>false,
    getExercisesCount: () =>0,
    clearExercises:()=> {},
};

const ExerciseContext2 = createContext<ExerciseContextType>(defaultContextValue);

const STORAGE_KEY= 'selectedExercises2';

export const ExerciseProvider2 =({children} : {children: ReactNode}) =>{
    const [selectedExercises2, setSelectedExercises2]=useState<Exercise[]>(defaultContextValue.selectedExercises2);

    useEffect(() => {
        loadExercises();
    }, []);

    const loadExercises = async () => {
        try{
            const storedExercises = await AsyncStorage.getItem(STORAGE_KEY);
            if(storedExercises) {
                setSelectedExercises2(JSON.parse(storedExercises));
            }
        } catch(e){
            console.log("Failed to load exercises",e);
        }   
    };

    const saveExercises= async (exercises: Exercise[]) =>{
        try{
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(exercises));

        } catch(e){
            console.log("Failed to save exercises", e);
        }
    };

    const addExercise = (exercise: Exercise) => {
        console.log("Adding exercise:", exercise);
    
        setSelectedExercises2((prev) => {
            const updated = [...prev, exercise];
            saveExercises(updated).then(() => {
                console.log("Exercises saved successfully");
            }).catch((error) => {
                console.log("Failed to save exercises:", error);
            });
    
            return updated;
        });
    };

    const getExercisesCount=() =>{
        return selectedExercises2.length;
    }

    const removeExercise = (exerciseName: string) => {
        setSelectedExercises2((prev) =>{
            const updated=prev.filter(e => e.WorkOut != exerciseName);
            saveExercises(updated);
            return updated;
        });
    };

    const isExerciseInList = (exercise: Exercise) => {
        return selectedExercises2.some(e => e.WorkOut === exercise.WorkOut);
    };

    const clearExercises = async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY); 
            setSelectedExercises2([]); 
            console.log("Exercises cleared from AsyncStorage and state.");
        } catch (e) {
            console.log("Failed to clear exercises", e);
        }
    };
    

    return (
        <ExerciseContext2.Provider value={{selectedExercises2,setSelectedExercises2,addExercise,removeExercise,isExerciseInList, getExercisesCount, clearExercises}}>
            {children}
        </ExerciseContext2.Provider>
    );
};

export const useExerciseContext = () => {
    const context = useContext(ExerciseContext2);
    if (context === undefined) {
        throw new Error('useExerciseContext must be used within an ExerciseProvider');
    }
    return context;
};