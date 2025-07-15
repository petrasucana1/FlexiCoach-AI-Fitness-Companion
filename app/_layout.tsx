import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DrawerLayout from "@/app/(drawer)/_layout"
import { ApolloProvider } from '@apollo/client';
import client from '../apolloClient';
import {UserProvider} from '../components/UserContext';



export default function RootLayout() {

  const navigation = useNavigation();

  const [loaded] = useFonts({
    Bitter: require('../assets/fonts/Bitter-Bold.ttf'),
    Calistoga: require('../assets/fonts/Calistoga-Regular.ttf'),
    Montserrat: require('../assets/fonts/Montserrat-Regular.ttf'),
    Poppins: require('../assets/fonts/Poppins-Black.ttf'),
  });

  if (!loaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
  <ApolloProvider client={client}>
  <UserProvider>

 <GestureHandlerRootView style={{ flex: 1 }}> 
   <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="splash" options={{ headerShown: false ,statusBarColor:'black',}} />
        <Stack.Screen name="index" options={{ headerShown: false , statusBarColor:'black',}} />
        <Stack.Screen
          name="start-screen"
          options={{ 
            headerShown: false, 
            statusBarColor:'black',
             // Ascunde bara de navigare
            // Alternativ, pentru personalizare
            // title: 'Custom Title',
            // headerStyle: {
            //   backgroundColor: '#f4511e',
            // },
            // headerTintColor: '#fff',
            // headerTitleStyle: {
            //   fontWeight: 'bold',
            // },
          }}
        />
      
        <Stack.Screen name="login" options={{ headerShown: false, statusBarHidden:false, statusBarColor:'black', }} />
        <Stack.Screen name="training-prefference" options={{ headerShown: false, statusBarHidden:false, statusBarColor:'black',}} />
        <Stack.Screen name="trainingByChoice_signup" options={{ headerShown: false, statusBarHidden:false, statusBarColor:'black',}} />
        <Stack.Screen name="personalisedTraining_signup" options={{ headerShown: false, statusBarHidden:false, statusBarColor:'black',}} />
        <Stack.Screen name="questionnaire" options={{ headerShown: false, statusBarHidden:false, statusBarColor:'black',}} />
        <Stack.Screen name="(drawer)" options={{ headerShown: false, statusBarHidden:false, statusBarColor:'black',}}  />
      </Stack> 
      </SafeAreaProvider>
      </GestureHandlerRootView>
      </UserProvider>
      </ApolloProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',  
  },
});
