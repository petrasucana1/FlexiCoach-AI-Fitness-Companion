import React, {useState, useEffect} from 'react';
import { View, Alert,Text, TextInput,TouchableOpacity, Image, StyleSheet, Animated,Dimensions} from 'react-native';
import { Link,useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import StaticLine from '../components/lines/StaticLine';
import {Colors} from '../constants/Colors';
import TransparentButton from '../components/buttons/TransparentButton';
import { ScrollView } from 'react-native-gesture-handler';
import { gql, useMutation} from '@apollo/client';


const CREATE_USER = gql`
  mutation CreateUser($Email: String!, $FirstName: String!, $LastName: String!, $Gender: String!, $Password: String!) {
    createUser(Email: $Email, FirstName: $FirstName, LastName: $LastName, Gender: $Gender, Password: $Password) {
      name
    }
  }
`;

const TrainingByChoiceSignUpScreen = () => {

  
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword]= useState('');
  const [passwordConfirmation, setPasswordConfirmation]= useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const [createUser, { loading, error, data }] = useMutation(CREATE_USER);


  const handlePress = () => {
    if (!firstName || !lastName || !gender || !email || !password || !passwordConfirmation) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (password !== passwordConfirmation) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const response = createUser({
      variables: {
        Email: email,
        FirstName: firstName,
        LastName: lastName,
        Gender: gender,
        Password: password,
      },
    });

   

    

    setErrorMessage('');

    router.push('/login');
  };

  return (
    <LinearGradient
      colors={[Colors.black_purple, Colors.dark_purple, Colors.black_purple]}
      start={{ x: 0, y: 0 }} 
      end={{ x: 1, y: 0 }}
      style={styles.backgroundImage}
    >
    
    <View style={styles.logo_container}>
      <Image source={require('../assets/images/logo-partial.png')} style={styles.logo} />
    </View>

    <View style={styles.container}>
        <Text style={styles.title}>Create Your Account</Text>
            <View style={styles.input_container}>
            {errorMessage ? (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}
              <ScrollView contentContainerStyle={{gap:10}}>
              <Text style={styles.label}>First Name:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="ex. Emily"
                    placeholderTextColor={Colors.light_purple}
                    onChangeText={setFirstName}
                    value={firstName}
                    />
                
                <Text style={styles.label}>Last Name:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="ex. Smith"
                    placeholderTextColor={Colors.light_purple}
                    onChangeText={setLastName}
                    value={lastName}
                    />

                <Text style={styles.label}>Select your gender:</Text>

                <TouchableOpacity 
                      style={styles.radioButtonContainer} 
                      onPress={() => setGender('male')}
                >
                      <View style={styles.radioButton}>
                        {gender === 'male' && <View style={styles.radioButtonSelected} />}
                      </View>
                      <Text style={styles.radioButtonText}>Male</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                      style={styles.radioButtonContainer} 
                      onPress={() => setGender('female')}
                    >
                      <View style={styles.radioButton}>
                        {gender === 'female' && <View style={styles.radioButtonSelected} />}
                      </View>
                      <Text style={styles.radioButtonText}>Female</Text>
                </TouchableOpacity>


                <Text style={styles.label}>E-mail:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="example@yahoo.com"
                    placeholderTextColor={Colors.light_purple}
                    onChangeText={setEmail}
                    value={email}
                    />

                <Text style={styles.label}>Password:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="password"
                    placeholderTextColor={Colors.light_purple}
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry={true}
                    />

                <Text style={styles.label}>Password Confirmation:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="password confirmation"
                    placeholderTextColor={Colors.light_purple}
                    onChangeText={setPasswordConfirmation}
                    value={passwordConfirmation}
                    secureTextEntry={true}
                    />
                <Text style={styles.text1}>
                   By pressing on the SIGN UP button and creating this account I agree with <Link href="/start-screen" style={styles.red_link}>Terms</Link> and <Link href="/start-screen" style={styles.red_link}>Global Privacy Statement</Link>.
                </Text>

                <TransparentButton 
                    onPress={handlePress} 
                    title="SIGN UP" 
                    size={26}
                />
              </ScrollView>
            </View>
      </View>

      <View style={styles.bottom}>
         <Text style={styles.text}>You already have an account?  <Link href="/login" style={styles.link}>Login</Link></Text>
        
         <StaticLine />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  logo_container:{
    flex:1,
    alignItems:'flex-start',
    padding:5,
  },
  container: {
    flex:6,
    alignItems: 'center',
    padding:30,
    gap:30,
    justifyContent:'center',
    marginVertical:10,
  },
  input_container:{
    padding:30,
    backgroundColor:Colors.transparent_purple,
    width:'100%',
    borderRadius:45,
    alignItems:'center'
  },
  label: {
    fontSize: 16,
    marginTop:10,
    color:Colors.white,
    fontFamily:'Montserrat',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginLeft:20,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: Colors.blue,
  },
  radioButtonText: {
    fontSize: 16,
    color:Colors.white,
  },
  errorMessage: {
    color: Colors.red,
    fontSize: 14,
    fontFamily: 'Montserrat',
    marginBottom: 10,
  },
  bottom:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom:30,
    gap:30,
  },

  icon:{
    width:100,
    height:100,
    resizeMode: 'contain',
    
  },
  logo: {
    width: 120, 
    height: 100,
    resizeMode: 'contain',
  },
  input:{
    height:50,
    borderColor:Colors.purple,
    borderWidth: 0.3,
    paddingHorizontal:15,
    width:'95%',
    borderRadius:25,
    fontFamily: 'Montserrat',
    fontSize:16,
    color:Colors.gray,
    textDecorationLine: 'none',
    backgroundColor:Colors.transparent_light_purple,
  },
  red_link:{
    color: Colors.red,
    fontSize:13,
    fontFamily:'Montserrat',
  },
  text:{
    color: Colors.light_purple,
    fontSize:16,
    fontFamily:'Montserrat',
  },
  text1:{
    color: Colors.blue,
    fontSize:11,
    fontFamily:'Montserrat',
    marginTop:20,
    marginBottom:10,
  },
  title:{
    color: Colors.white,
    fontSize:25,
    fontFamily:'Calistoga',
  },
  link:{
    color: Colors.blue,
    fontSize:16,
    fontFamily:'Montserrat',
  },
});

export default TrainingByChoiceSignUpScreen;
