import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import AnimatedLine from '../components/lines/AnimatedLine';
import {Colors} from '../constants/Colors';


const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/start-screen'); // Navighează la ecranul principal după 3 secunde
    }, 4000); // Am schimbat timpul pentru a fi 3 secunde în loc de 100000 milisecunde

    return () => clearTimeout(timer); // Curăță timerul dacă componenta este demontată
  }, [router]);

  return (
    <LinearGradient
      colors={[Colors.black_purple, Colors.dark_purple, Colors.black_purple]} // Culorile gradientului
      start={{ x: 0, y: 0 }} // Punctul de start al gradientului (colțul stâng sus)
      end={{ x: 1, y: 0 }} // Punctul de sfârșit al gradientului (colțul drept sus)
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Image source={require('../assets/images/logo1.png')} style={styles.logo} />
        <AnimatedLine />
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -100,
  },
  logo: {
    width: 350, // Setează dimensiunile logo-ului
    height: 200,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
