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
    selectedExercises: Exercise[];
    setSelectedExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
    addExercise: (exercise: Exercise) => void;
    removeExercise: (exerciseName: string) => void;
    isExerciseInList: (exercise: Exercise) => boolean;
    getExercisesCount: () => number;
    clearExercises: () => void;
}

const defaultContextValue: ExerciseContextType={
    selectedExercises:[],
    setSelectedExercises:() =>[],
    addExercise:() =>{},
    removeExercise:()=> {},
    isExerciseInList:() =>false,
    getExercisesCount: () =>0,
    clearExercises:()=> {},
};

const ExerciseContext = createContext<ExerciseContextType>(defaultContextValue);

const STORAGE_KEY= 'selectedExercises';

export const ExerciseProvider =({children} : {children: ReactNode}) =>{
    const [selectedExercises, setSelectedExercises]=useState<Exercise[]>(defaultContextValue.selectedExercises);

    useEffect(() => {
        loadExercises();
    }, []);

    const loadExercises = async () => {
        try{
            const storedExercises = await AsyncStorage.getItem(STORAGE_KEY);
            if(storedExercises) {
                setSelectedExercises(JSON.parse(storedExercises));
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
    
        setSelectedExercises((prev) => {
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
        return selectedExercises.length;
    }

    const removeExercise = (exerciseName: string) => {
        setSelectedExercises((prev) =>{
            const updated=prev.filter(e => e.WorkOut != exerciseName);
            saveExercises(updated);
            return updated;
        });
    };

    const isExerciseInList = (exercise: Exercise) => {
        return selectedExercises.some(e => e.WorkOut === exercise.WorkOut);
    };

    const clearExercises = async () => {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY); 
            setSelectedExercises([]); 
        } catch (e) {
            console.log("Failed to clear exercises", e);
        }
    };
    

    return (
        <ExerciseContext.Provider value={{selectedExercises,setSelectedExercises,addExercise,removeExercise,isExerciseInList, getExercisesCount, clearExercises}}>
            {children}
        </ExerciseContext.Provider>
    );
};

export const useExerciseContext = () => {
    const context = useContext(ExerciseContext);
    if (context === undefined) {
        throw new Error('useExerciseContext must be used within an ExerciseProvider');
    }
    return context;
};