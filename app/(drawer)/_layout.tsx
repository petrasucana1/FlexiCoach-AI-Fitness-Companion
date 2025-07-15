import React from 'react';
import 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import {Colors} from "../../constants/Colors"
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { View, Text, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ExerciseProvider } from '@/components/ExerciseContext'; 
import { ExerciseProvider2 } from '@/components/ExerciseContext2'; 
import { ApolloProvider } from '@apollo/client';
import client from '../../apolloClient';
import { useUser } from '@/components/UserContext'; 

const CustomDrawer=(props :any) => {
    const router=useRouter();
    const {top, bottom} = useSafeAreaInsets();
    return(
        <View style={{flex:1}}>
            <DrawerContentScrollView {...props} scrollEnabled={false}
            contentContainerStyle={{backgroundColor:'#dde3fe'}}>
            <View style={{padding:30}}>
                <Image 
                    source={require('@/assets/images/icon_no_background.png')}
                     style={{width:100, height:100, alignSelf: 'center'}} 
                />
                <Text style={{
                  alignSelf: 'center',
                  fontFamily: 'Montserrat',
                  paddingTop:10,
                  color: Colors.blue_purple,
                  fontSize:20,
                }}> 
                FlexiCoach 
                </Text>
            </View>
              <View style={{backgroundColor: Colors.white, paddingTop: 10}}>
                   <DrawerItemList {...props} />
                   <DrawerItem label={"Logout"} onPress={() => router.replace ('/')} 
                     icon={({ size, color }) => (
                      <Ionicons name="log-out-outline" size={size} color={color} />
                    )}
                    />
              </View>
            </DrawerContentScrollView>

            <View
                style={{
                    borderTopColor:'#dde3fe',
                    borderTopWidth:2,
                    padding:20,
                    paddingBottom:30+bottom,
                }}>
                
                </View>
        </View>

        
    

    );
}

const DrawerLayout = () => {
  const { screen } = useUser(); 
  

  return (
    <GestureHandlerRootView style={{ flex:1 }}>
      <ApolloProvider client={client}>
        <ExerciseProvider> 
          <ExerciseProvider2> 
            <Drawer
              drawerContent={CustomDrawer}
              screenOptions={{
                drawerHideStatusBarOnOpen: true,
                drawerActiveBackgroundColor: Colors.light_purple,
                drawerActiveTintColor: Colors.white,
              }}
            >
              {/* Home activ - vizibil */}
              <Drawer.Screen
                name={screen}
                options={{
                  drawerLabel: 'Home',
                  headerShown: false,
                  headerTitle: '',
                  drawerIcon: ({size, color}) => (
                    <Ionicons name="barbell-outline" size={size} color={color} />
                  ),
                }}
              />

              {/* Home inactiv - ascuns */}
              <Drawer.Screen
                name={screen === 'home_1' ? 'home_2' : 'home_1'}
                options={{
                  drawerLabel: '',
                  headerShown: false,
                  drawerItemStyle: { display: 'none' },
                }}
              />

              {/* Alte pagini */}
              <Drawer.Screen
                name="track_progress"
                options={{
                  drawerLabel: 'Workouts Done',
                  headerShown: false,
                  headerTitle: '',
                  drawerIcon: ({size, color}) => (
                    <Ionicons name="stats-chart-outline" size={size} color={color} />
                  ),
                }}
              />

              {/* Restul paginilor, toate ascunse */}
              <Drawer.Screen name="progress" options={{
                drawerLabel: '',
                headerShown: false,
                drawerItemStyle: { display: 'none' },
              }} />
              <Drawer.Screen name="live-screen" options={{
                drawerLabel: '',
                headerShown: false,
                drawerItemStyle: { display: 'none' },
              }} />
              <Drawer.Screen name="live-screen2" options={{
                drawerLabel: '',
                headerShown: false,
                drawerItemStyle: { display: 'none' },
              }} />
              <Drawer.Screen name="exercises2" options={{
                drawerLabel: '',
                headerShown: false,
                drawerItemStyle: { display: 'none' },
              }} />
              <Drawer.Screen name="exercises" options={{
                drawerLabel: '',
                headerShown: false,
                drawerItemStyle: { display: 'none' },
              }} />

            </Drawer>
          </ExerciseProvider2> 
        </ExerciseProvider>
      </ApolloProvider>
    </GestureHandlerRootView>
  );
};


export default DrawerLayout;




