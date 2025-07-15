import React, {useState} from 'react';
import { View, Text, Modal, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import StaticLine from '../../components/lines/StaticLine';
import {Colors} from '../../constants/Colors';
import OrangeButton from '../../components/buttons/OrangeButton';
import DismissibleButton from '@/components/buttons/DismissibleButton';
import BodyBackSvg from '../../components/svg/BodyBackSvg';
import BodySvg from '../../components/svg/BodySvg';
import { useNavigation } from '@react-navigation/native';
import DrawerLayout from "@/app/(drawer)/_layout"
import { DrawerActions } from '@react-navigation/native';

const Home1Screen = () => {

    const router = useRouter(); 

    const handlePress = () => {
      router.push('/(drawer)/exercises'); 
    };

    const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);

    const handlePress1 = (muscle: string) => {
        if (!selectedMuscles.includes(muscle)) {
        setSelectedMuscles([...selectedMuscles, muscle]);
        }
    };

    const handleRemoveMuscle = (muscle: string) => {
        setSelectedMuscles(selectedMuscles.filter(item => item !== muscle));
    };

    const [isFirstSvg, setIsFirstSvg] = useState(true);

    const handleIconPress = () => {
        setIsFirstSvg(prevState => !prevState);
    };

    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigation = useNavigation(); 

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const onToggle = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  }
      
  return (
    <LinearGradient
      colors={[Colors.black_purple, Colors.dark_purple, Colors.black_purple]}
      start={{ x: 0, y: 0 }} 
      end={{ x: 1, y: 0 }}
      style={styles.backgroundImage}
    >
   <View style={styles.top_container}>
      <View style={styles.logo_container}>
        <Image source={require('../../assets/images/logo-partial.png')} style={styles.logo} />
      </View>
      <View style={styles.sidebar_container}>
        <TouchableOpacity onPress={onToggle}>
          <Image source={require('../../assets/images/sidebar_icon.png')} style={styles.sidebar_icon} />
        </TouchableOpacity>
      </View>
    </View>

    <Modal
        transparent={true}
        visible={isSidebarVisible}
        animationType="none"
        onRequestClose={toggleSidebar}
      >
        <View style={styles.modalContainer}>
          <View style={styles.sidebar}>
            <TouchableOpacity onPress={() => { toggleSidebar();  }}>
              <Text style={styles.menuItem}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { toggleSidebar();  }}>
              <Text style={styles.menuItem}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { toggleSidebar();  }}>
              <Text style={styles.menuItem}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleSidebar}>
              <Text style={styles.closeButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
    <View style={styles.container}>
       <Text style={styles.title}>Hello,  <Text style={styles.name}>Ana</Text> </Text>
       <View style={styles.body_container}>
           <Text style={styles.text}>Choose which muscles you want to train today:</Text>
           <Text style={styles.mini_text}>(Choose 1 up to 5 muscles)</Text>
           {isFirstSvg ? <BodySvg selected={selectedMuscles} onPress={handlePress1} /> : <BodyBackSvg selected={selectedMuscles} onPress={handlePress1} />}
           <TouchableOpacity onPress={handleIconPress}>
              <Image source={require('../../assets/images/turn_icon.png')} style={styles.icon} />
           </TouchableOpacity>
       </View>

       
       <View style={styles.list}>
          {selectedMuscles.map(muscle => (
            <DismissibleButton
              key={muscle}
              onPressX={() => handleRemoveMuscle(muscle)}
              title={muscle}
            />
          ))}
        </View>
    </View>

    <View style={styles.bottom}>
        <OrangeButton 
                onPress={handlePress} 
                title="Continue" 
         />
         <StaticLine />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  top_container:{
    flex:1,
    flexDirection:'row',
  },
  logo_container:{
    flex:1,
    alignItems:'flex-start',
  },
  sidebar_container:{
    flex:1,
    alignItems:'flex-end',
    paddingTop:50,
    paddingRight:20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding:30,
    gap:10,
    justifyContent:'center',
  },
  body_container:{
    padding:17,
    backgroundColor:Colors.transparent_blue_purple,
    width:'100%',
    borderRadius:45,
    gap:5,
    alignItems:'center'
  },
  list:{
    alignItems:'flex-start',
    flexDirection:'row',
  },
  bottom:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom:30,
    gap:30,
  },

  icon:{
    width:70,
    height:30,
    resizeMode: 'contain',
    opacity: 0.8,
    
  },
  logo: {
    width: 120, 
    height: 150,
    resizeMode: 'contain',
  },
  sidebar_icon:{
    width: 35, 
    height: 35,
    resizeMode: 'contain',
  },
  title:{
    color: Colors.white,
    fontSize:35,
    fontFamily:'Bitter',
  },
  name:{
    color: Colors.red,
  },
  text:{
    color: Colors.white,
    fontSize:20,
    fontFamily:'Calistoga',
  },
  mini_text:{
    color: Colors.blue,
    fontSize:14,
    fontFamily:'Montserrat',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: '60%',
    backgroundColor: Colors.white,
    paddingTop: 30,
    paddingHorizontal: 20,
    height: '100%',
  },
  menuItem: {
    fontSize: 18,
    marginVertical: 10,
  },
  closeButton: {
    marginTop: 30,
    fontSize: 16,
    color: 'red',
  },
});

export default Home1Screen;
