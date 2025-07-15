import React, { useEffect } from 'react';
import { View, Image, StyleSheet} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import StaticLine from '../components/lines/StaticLine';
import {Colors} from '../constants/Colors';
import PurpleButton from '../components/buttons/PurpleButton';
import TransparentButton from '../components/buttons/TransparentButton';

const StartScreen = () => {


  const router = useRouter();

  const handlePress1 = () => {
    router.push('/login'); 
  };

  const handlePress2 = () => {
    router.push('/training-prefference'); 
  };

  return (
    <LinearGradient
    colors={[Colors.black_purple, Colors.dark_purple, Colors.black_purple]} // Culorile gradientului
      start={{ x: 0, y: 0 }} // Punctul de start al gradientului (colțul stâng sus)
      end={{ x: 1, y: 0 }} // Punctul de sfârșit al gradientului (colțul drept sus)
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Image source={require('../assets/images/logo1.png')} style={styles.logo} />
        <View style={styles.mini_container}>
            <PurpleButton 
                onPress={handlePress1} 
                title="LOGIN" 
            />
            <TransparentButton 
                onPress={handlePress2} 
                title="SIGN UP"
                size={26} 
            />
            
        </View>
        <StaticLine />
      </View>
      
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop:100,
    paddingBottom:30,
  },
  mini_container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap:30,
    paddingBottom:200,

  },
  logo: {
    width: 350, // Setează dimensiunile logo-ului
    height: 200,
    resizeMode: 'contain',
  },
});

export default StartScreen;
