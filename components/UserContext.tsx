import React, { createContext, useState , ReactNode} from 'react';

type User = {
    Id: String
    Email: String
    FirstName: String
    Gender: String
    LastName: String
    Password: String
}

type Questionnaire = {
    Days: string;
    Height: string;
    Level: string;
    Purpose: string;
    Time: string;
    UserId: string;
    Weight: string;
}

interface UserContextType{
    daysDone: number;
    setDaysDone: React.Dispatch<React.SetStateAction<number >>;
    alternate: number | null;
    setAlternate : React.Dispatch<React.SetStateAction<number | null>>;
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    questionnaire: Questionnaire;
    setQuestionnaire: React.Dispatch<React.SetStateAction<Questionnaire>>;
    screen:string;
    setScreen: React.Dispatch<React.SetStateAction<string >>;
};

const defaultContextValue: UserContextType={
    daysDone: 1,
    setDaysDone: () => {},
    alternate: 1,
    setAlternate: () => {},
    user: {
        Id: '',
        Email: '',
        FirstName: '',
        Gender: '',
        LastName: '',
        Password: '',
    },
    setUser: () => {},
    questionnaire: {
        Days: '',
        Height: '',
        Level: '',
        Purpose: '',
        Time: '',
        UserId: '',
        Weight: '',
    },
    setQuestionnaire: () => {},
    screen: 'home_1',
    setScreen: () => {},
};

const UserContext = createContext<UserContextType>(defaultContextValue);

const STORAGE_KEY_USER= 'user_data';

export const UserProvider = ({children} : {children: ReactNode}) => {
  const [daysDone, setDaysDone] = useState<number>(defaultContextValue.daysDone);
  const [alternate, setAlternate] = useState<number | null>(defaultContextValue.alternate);
  const [user, setUser] = useState<User>(defaultContextValue.user);
  const [questionnaire, setQuestionnaire] = useState<Questionnaire>(defaultContextValue.questionnaire);
  const [screen, setScreen] = useState<string>(defaultContextValue.screen);

  return (
    <UserContext.Provider value={{daysDone, setDaysDone, alternate, setAlternate,user, setUser, questionnaire, setQuestionnaire,screen,setScreen }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
