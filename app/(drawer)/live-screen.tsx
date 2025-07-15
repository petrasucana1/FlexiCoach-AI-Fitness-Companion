import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Button,
  Text,
  Modal,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import StaticLine from '../../components/lines/StaticLine';
import { Colors } from '../../constants/Colors';
import OrangeButton from '../../components/buttons/OrangeButton';
import LittlePurpleButton from '@/components/buttons/LittlePurpleButton';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import exercises from '../../assets/data__for_testing/exercises+video.json';
import ExerciseComponent from '@/components/ExerciseComponent';
import { Ionicons } from '@expo/vector-icons';
import { useExerciseContext } from '../../components/ExerciseContext';
import MiniExerciseComponent from '@/components/MiniExerciseComponent';
import { WebView } from 'react-native-webview';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import * as WebBrowser from 'expo-web-browser';
import * as Permissions from "expo-permissions";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { PermissionsAndroid, Platform } from 'react-native';
import {useUser} from '../../components/UserContext';
import { gql, useMutation} from '@apollo/client';


const ADD_PLAN = gql`
    mutation AddPlan($id:ID!,$timestamp:String!) {
    addPlan(id: $id, timestamp: $timestamp){
    name
    }
  }
`;

const UPDATE_EXERCISE = gql`
    mutation UpdateExerciseInPlan($id:ID!,$planId:ID!, $exerciseId:ID!,$completedSets:Int,$completedReps:Int) {
    updateExerciseInPlan(id: $id, planId: $planId, exerciseId: $exerciseId, completedSets: $completedSets, completedReps: $completedReps){
    completedSets
    completedReps
    }
  }
`;



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


const Home1Screen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { selectedExercises } = useExerciseContext();
  const { selectedMuscles } = useLocalSearchParams();
  const { getExercisesCount, clearExercises} = useExerciseContext();
  const {user}= useUser();
  const [addPlan, { loading, error, data }] = useMutation(ADD_PLAN, {
    onCompleted: (data) => {
      // Când planul este creat, setează ID-ul planului
      setPlanId(data.addPlan.name); // Salvează ID-ul în state
    }
  });
  const [updateExerciseInPlan] = useMutation(UPDATE_EXERCISE);

  const [planId, setPlanId] = useState(String);

  useEffect(() => {
    if (user && !planId) {
      // Apelăm mutația doar dacă nu există un plan deja creat
      addPlan({
        variables: {
          id: user.Id,
          timestamp: new Date().toISOString(),
        },
      }).then(response => {
        // Odată ce planul este creat, salvăm id-ul planului
        setPlanId(response.data.addPlan.name);
      }).catch(err => {
        console.error(err);
      });
    }
  }, [user, planId, addPlan]);
  
  let muscles: string[] = [];

  if (typeof selectedMuscles === 'string') {
    try {
      muscles = JSON.parse(selectedMuscles);
    } catch (e) {
      muscles = selectedMuscles.split(',');
    }
  } else if (Array.isArray(selectedMuscles)) {
    muscles = selectedMuscles;
  }

  const [activeMuscle, setActiveMuscle] = useState(muscles[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExercisesSearch, setFilteredExercisesSearch] =
  useState(exercises.filter(exercise => exercise.Muscles.toLowerCase() === activeMuscle));
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = React.useCallback(({ item }: { item: Exercise }) => {
    return <ExerciseComponent exercise={item} />;
  }, []);

  const renderItemInModal = ({ item }: { item: Exercise }) => {
    return <MiniExerciseComponent exercise={item} planId={planId} />;
  };

  const handlePressOrangeButton = async () => {
    try {
      const response = await fetch(`https://project1---flexicoach-default-rtdb.europe-west1.firebasedatabase.app/users/${user.Id}/Plans/${planId}/exercises.json`);
      const exercisesData = await response.json();
  
      if (!exercisesData) {
        console.error('Nu există exerciții în plan.');
        return;
      }
  
      for (const [exerciseId, exerciseData] of Object.entries(exercisesData)) {
        const { sets, reps } = exerciseData as { sets: number; reps: number };

  
        await fetch(`https://project1---flexicoach-default-rtdb.europe-west1.firebasedatabase.app/users/${user.Id}/Plans/${planId}/exercises/${exerciseId}.json`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            completedSets: sets,
            completedReps: reps,
          }),
        });
      }
  
      alert('Workout complet!');
    } catch (error) {
      console.error('Eroare la completarea workout-ului:', error);
      alert('A apărut o eroare la salvare.');
    }
    
    clearExercises();
    router.push('/track_progress');

  };

  const handleGoToLiveFeedback = () => {
  };

  const handleGoToProgress = () => {
    //router.push('/progress-screen');
  };

  const handlePressArrow = () => {
    navigation.goBack();
  };

  const handleXModal = () => {
    setModalVisible(false);
  };

  const handlePurpleButton = React.useCallback(
    (muscle: string) => {
      setActiveMuscle(muscle);
      const filtered = exercises.filter(
        exercise => exercise.Muscles.toLowerCase() === muscle.toLowerCase()
      );
      setFilteredExercisesSearch(filtered);
    },
    [exercises]
  );

  const onToggle = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const openModal = () => {
    setModalVisible(true);
  };


  useEffect(() => {
    if (activeMuscle) {
      const filtered = exercises.filter(
        exercise => exercise.Muscles.toLowerCase() === activeMuscle.toLowerCase()
      );
      setFilteredExercisesSearch(filtered);
    }
  }, [activeMuscle, exercises]);

  return (
    <LinearGradient
      colors={[Colors.black_purple, Colors.dark_purple, Colors.black_purple]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.backgroundImage}
    >
      <View style={styles.top_container}>
        <View style={styles.logo_container}>
          <TouchableOpacity onPress={handlePressArrow}>
            <Image
              source={require('../../assets/images/back_arrow_icon.png')}
              style={styles.logo}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.sidebar_container}>
          <TouchableOpacity onPress={onToggle}>
            <Image
              source={require('../../assets/images/sidebar_icon.png')}
              style={styles.sidebar_icon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.mainButton} onPress={handleGoToLiveFeedback}>
          <Text style={styles.mainButtonText}>Go to Live Feedback</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>or press Done Workout and skip directly to the progress page:</Text>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleGoToProgress}>
          <Text style={styles.secondaryButtonText}>Done Workout</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.bottom_screen}>
        <StaticLine />
      </View>

      <TouchableOpacity style={styles.floatingButton} onPress={openModal}>
        <Text style={styles.buttonText}>PLAN</Text>

        <View style={styles.exercisesCountBubble}>
          <Text style={styles.bubbleText}>{getExercisesCount()}</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={{ alignSelf: 'flex-end', marginTop: 5, marginRight: 5 }}>
            <TouchableOpacity onPress={handleXModal}>
              <Ionicons name="close-circle" size={35} color={Colors.blue} />
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: 40, marginBottom: 10 }}>
            <Text
              style={{
                fontFamily: 'Calistoga',
                fontSize: 25,
                color: Colors.dark_purple,
                textAlign: 'center',
              }}
            >
              This is your Today's Workout Plan
            </Text>
          </View>
          <StaticLine />
          <View style={styles.exercises_container_modal}>
            <FlatList
              data={selectedExercises}
              renderItem={renderItemInModal}
              keyExtractor={item => item.WorkOut}
            />
          </View>

          <View style={styles.orange_button_modal}>
            <OrangeButton onPress={handlePressOrangeButton} title="Workout Done" />
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  content: {
    alignItems: 'center',
    flex:1,
  },
  mainButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: Colors.blue,
    borderRadius: 25,
    marginBottom: 20,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Bitter',
  },
  orText: {
    color: Colors.white,
    fontSize: 14,
    margin:30,
    fontFamily: 'Montserrat',
    textAlign: 'center',
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.red,
    borderRadius: 20,
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Bitter',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  webView: {
    width: '100%',
    height: '100%',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  repsCounter: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: Colors.white,
  },
  camera: {
    flex: 1,
    borderRadius: 50,
  },
  /*buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },*/
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  backgroundImage: {
    flex: 1,
  },
  top_container: {
    flex: 1,
    flexDirection: 'row',
  },
  logo_container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: 25,
    paddingLeft: 20,
  },
  glView: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  sidebar_container: {
    flex: 1,
    alignItems: 'flex-end',
    paddingTop: 30,
    paddingRight: 20,
  },
  middle_container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  exercises_container: {
    flex: 10,
  },
  flatListContent: {
    paddingVertical: 10,
  },
  bottom_screen: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  sidebar_icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    backgroundColor: Colors.white,
    borderRadius: 50,
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderColor: Colors.blue,
    borderWidth: 5,
  },
  buttonText: {
    color: Colors.blue,
    fontSize: 20,
    fontFamily: 'Bitter',
  },
  exercisesCountBubble: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.red,
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bubbleText: {
    color: Colors.white,
    fontSize: 13,
    fontFamily: 'Bitter',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    margin: '5%',
    borderRadius: 25,
    borderColor: Colors.blue,
    borderWidth: 5,
  },
  modalContent: {
    width: '60%',
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
  },
  exercises_container_modal: {
    flex: 1,
    width: '95%',
    marginTop: 10,
  },
  orange_button_modal: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
    paddingTop: 20,
    gap: 30,
  },
});

export default Home1Screen;


/*import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Button,
  Text,
  Modal,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import StaticLine from '../../components/lines/StaticLine';
import { Colors } from '../../constants/Colors';
import OrangeButton from '../../components/buttons/OrangeButton';
import LittlePurpleButton from '@/components/buttons/LittlePurpleButton';
import { useNavigation } from '@react-navigation/native';
import { DrawerActions } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import exercises from '../../assets/data__for_testing/exercises+video.json';
import ExerciseComponent from '@/components/ExerciseComponent';
import { Ionicons } from '@expo/vector-icons';
import { useExerciseContext } from '../../components/ExerciseContext';
import MiniExerciseComponent from '@/components/MiniExerciseComponent';
import {
  CameraView,
  CameraType,
  useCameraPermissions,
} from 'expo-camera';
import { GLView } from 'expo-gl';
import { ExpoWebGLRenderingContext } from 'expo-gl';
import * as FileSystem from 'expo-file-system';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

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


const Home1Screen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { selectedExercises } = useExerciseContext();
  const { selectedMuscles } = useLocalSearchParams();
  const { getExercisesCount } = useExerciseContext();

  let muscles: string[] = [];

  if (typeof selectedMuscles === 'string') {
    try {
      muscles = JSON.parse(selectedMuscles);
    } catch (e) {
      muscles = selectedMuscles.split(',');
    }
  } else if (Array.isArray(selectedMuscles)) {
    muscles = selectedMuscles;
  }

  const [activeMuscle, setActiveMuscle] = useState(muscles[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExercisesSearch, setFilteredExercisesSearch] =
    useState(exercises.filter(exercise => exercise.Muscles.toLowerCase() === activeMuscle));
  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = React.useCallback(({ item }: { item: Exercise }) => {
    return <ExerciseComponent exercise={item} />;
  }, []);

  const renderItemInModal = ({ item }: { item: Exercise }) => {
    return <MiniExerciseComponent exercise={item} />;
  };

  const handlePressOrangeButton = () => {
    router.push('/live-screen');
  };

  const handlePressArrow = () => {
    navigation.goBack();
  };

  const handleXModal = () => {
    setModalVisible(false);
  };

  const handlePurpleButton = React.useCallback(
    (muscle: string) => {
      setActiveMuscle(muscle);
      const filtered = exercises.filter(
        exercise => exercise.Muscles.toLowerCase() === muscle.toLowerCase()
      );
      setFilteredExercisesSearch(filtered);
    },
    [exercises]
  );

  const onToggle = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const socket = useRef<WebSocket | null>(null); // Correct type for socket
  const [reps, setReps] = useState(0);
  const [gl, setGl] = useState<ExpoWebGLRenderingContext | null>(null);
  const glViewRef = useRef<GLView>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  useEffect(() => {
    console.log('Inițierea conexiunii WebSocket...');
    const newSocket = new WebSocket('ws://192.168.175.226:8765');  // Create a new WebSocket instance
    socket.current = newSocket;

    newSocket.onopen = () => {
      console.log('Conexiune WebSocket deschisă!');
    };

    newSocket.onerror = error => {
      console.error('Eroare WebSocket:', error);
    };

    newSocket.onclose = event => {
      console.log('Conexiune WebSocket închisă:', event);
      console.log('Conexiune WebSocket închisă. Încerc reconectarea...');
      setTimeout(() => {
        const newSocket = new WebSocket('ws://192.168.175.226:8765');
        socket.current = newSocket;
      }, 3000);
    };

    newSocket.onmessage = event => {
      console.log('Mesaj primit de la server:', event.data);
      setReps(parseInt(event.data.toString()));
    };

    return () => {
      newSocket.close();
      console.log('Conexiune WebSocket închisă');
    };
  }, []);

  const onContextCreate = async (gl:ExpoWebGLRenderingContext) => {

    const _gl = (gl as any).getContext() as WebGLRenderingContext;
    const pixelStorei = _gl.pixelStorei.bind(_gl);
    _gl.pixelStorei = function(...args: any[]) {
      const [parameter] = args;
      switch(parameter) {
        case _gl.UNPACK_FLIP_Y_WEBGL: 
        return pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, true);
        default:
          return; // Ignoră parametrii nesuportați
      }
    };

    setGl(gl)
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
  
    
    // Așteaptă inițializarea camerei
    if (!cameraRef.current) return;
  
    // Crează o textură din video feed
    const videoCanvas = document.createElement('canvas');
    const videoCtx = videoCanvas.getContext('2d');
    
    videoCanvas.width = gl.drawingBufferWidth;
    videoCanvas.height = gl.drawingBufferHeight;

    // ✅ Creează o textură WebGL din canvas
    const texture = new THREE.Texture(videoCanvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
  
    // Creează un material care folosește textura camerei
    const material = new THREE.MeshBasicMaterial({ map: texture });
  
    // Creează un obiect 3D (ex: un plan) care să afișeze textura
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
  
    // Creează o scenă și o cameră
    const scene = new THREE.Scene();
    scene.add(mesh);
  
    const camera = new THREE.PerspectiveCamera(
      75,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    camera.position.z = 2;
  
    // Funcție de randare
    const render = () => {
      requestAnimationFrame(render);

      if (cameraRef.current) {
        // Obține fluxul video din Camera (folosind un element video)
        const videoElement = document.createElement('video');

        // Setează fluxul de la camera (acesta este fluxul video care poate fi folosit de elementul video)
        const videoStream = cameraRef.current.getInternalCamera().stream;  // Camera este un component care conține fluxul video
        videoElement.srcObject = videoStream; // Setează fluxul video pe elementul video

        // Asigură-te că video-ul este gata pentru a fi desenat pe canvas
        videoElement.onloadeddata = () => {
          videoCtx?.drawImage(videoElement, 0, 0, videoCanvas.width, videoCanvas.height);
          texture.needsUpdate = true; // Actualizează textura
        };

        videoElement.play(); // Pornește redarea fluxului video
      }

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
  
    render();
  };

  useEffect(() => {
    const interval = setInterval(() => {
        if(gl  && glViewRef.current){
          takePictureAndSend(gl); 
        }
      
    }, 5000); 
  
    return () => clearInterval(interval); 
  }, [gl]); 


  const [isProcessing, setIsProcessing] = useState(false);

const takePictureAndSend = async (gl:any) => {
  try {
    if (glViewRef.current && !isProcessing) {
      setIsProcessing(true); // Start processing
      
      const photo = await glViewRef.current.takeSnapshotAsync({ format: 'jpeg' });
      if (!photo) {
        console.error("Eroare: Nu s-a putut captura imaginea.");
        setIsProcessing(false);
        return;
      }

      if (typeof photo.uri === 'string') {
          console.log("Imagine capturată cu succes:", photo.uri);
          setCapturedPhoto(photo.uri);
          console.log("Imagine AFISTAA");
      }

      if (typeof photo.uri === 'string') {
        
        
        const resizedBase64 = await FileSystem.readAsStringAsync(photo.uri, { encoding: FileSystem.EncodingType.Base64 });

        if (socket.current?.readyState === WebSocket.OPEN) {
          const message = `Incline Hammer Curls|${resizedBase64}`;
          console.log(message);
          socket.current.send(message);
          console.log("Imagine trimisă prin WebSocket");
        } else {
          console.error("WebSocket nu este deschis!");
        }
      }
      
      setIsProcessing(false);
    }
  } catch (error) {
    console.error("Eroare la procesarea imaginii:", error);
    setIsProcessing(false);
  }
};

  useEffect(() => {
    if (activeMuscle) {
      const filtered = exercises.filter(
        exercise => exercise.Muscles.toLowerCase() === activeMuscle.toLowerCase()
      );
      setFilteredExercisesSearch(filtered);
    }
  }, [activeMuscle, exercises]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
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
          <TouchableOpacity onPress={handlePressArrow}>
            <Image
              source={require('../../assets/images/back_arrow_icon.png')}
              style={styles.logo}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.sidebar_container}>
          <TouchableOpacity onPress={onToggle}>
            <Image
              source={require('../../assets/images/sidebar_icon.png')}
              style={styles.sidebar_icon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            facing={facing}
            ref={cameraRef}
          />

          <GLView
            style={styles.glView}
            ref={glViewRef}
            onContextCreate={onContextCreate}
            collapsable={false}
          />

        </View>
        <Text style={styles.repsCounter}>Reps: {reps}</Text>
      </View>

      {capturedPhoto && (
          <Image 
            source={{ uri: capturedPhoto }} 
            style={{ width: 200, height: 300, borderRadius: 10, margin: 10 }} 
          />
        )}


      <View style={styles.bottom_screen}>
        <StaticLine />
      </View>

      <TouchableOpacity style={styles.floatingButton} onPress={openModal}>
        <Text style={styles.buttonText}>PLAN</Text>

        <View style={styles.exercisesCountBubble}>
          <Text style={styles.bubbleText}>{getExercisesCount()}</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={{ alignSelf: 'flex-end', marginTop: 5, marginRight: 5 }}>
            <TouchableOpacity onPress={handleXModal}>
              <Ionicons name="close-circle" size={35} color={Colors.blue} />
            </TouchableOpacity>
          </View>
          <View style={{ paddingHorizontal: 40, marginBottom: 10 }}>
            <Text
              style={{
                fontFamily: 'Calistoga',
                fontSize: 25,
                color: Colors.dark_purple,
                textAlign: 'center',
              }}
            >
              This is your Today's Workout Plan
            </Text>
          </View>
          <StaticLine />
          <View style={styles.exercises_container_modal}>
            <FlatList
              data={selectedExercises}
              renderItem={renderItemInModal}
              keyExtractor={item => item.WorkOut}
            />
          </View>

          <View style={styles.orange_button_modal}>
            <OrangeButton onPress={handlePressOrangeButton} title="Start Workout" />
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 10,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  repsCounter: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: Colors.white,
  },
  camera: {
    flex: 1,
    borderRadius: 50,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  backgroundImage: {
    flex: 1,
  },
  top_container: {
    flex: 1,
    flexDirection: 'row',
  },
  logo_container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingTop: 25,
    paddingLeft: 20,
  },
  glView: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  sidebar_container: {
    flex: 1,
    alignItems: 'flex-end',
    paddingTop: 30,
    paddingRight: 20,
  },
  middle_container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  exercises_container: {
    flex: 10,
  },
  flatListContent: {
    paddingVertical: 10,
  },
  bottom_screen: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  logo: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  sidebar_icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    backgroundColor: Colors.white,
    borderRadius: 50,
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderColor: Colors.blue,
    borderWidth: 5,
  },
  buttonText: {
    color: Colors.blue,
    fontSize: 20,
    fontFamily: 'Bitter',
  },
  exercisesCountBubble: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.red,
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bubbleText: {
    color: Colors.white,
    fontSize: 13,
    fontFamily: 'Bitter',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    margin: '5%',
    borderRadius: 25,
    borderColor: Colors.blue,
    borderWidth: 5,
  },
  modalContent: {
    width: '60%',
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
  },
  exercises_container_modal: {
    flex: 1,
    width: '95%',
    marginTop: 10,
  },
  orange_button_modal: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20,
    paddingTop: 20,
    gap: 30,
  },
});

export default Home1Screen;

*/

/*import React, {useState, useEffect, useRef} from 'react';
import { View, Button,Text, Modal, Image, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import StaticLine from '../../components/lines/StaticLine';
import {Colors} from '../../constants/Colors';
import OrangeButton from '../../components/buttons/OrangeButton';
import LittlePurpleButton from '@/components/buttons/LittlePurpleButton';
import BodyBackSvg from '../../components/svg/BodyBackSvg';
import BodySvg from '../../components/svg/BodySvg';
import { useNavigation } from '@react-navigation/native';
import DrawerLayout from "@/app/(drawer)/_layout"
import { DrawerActions } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import exercises from '../../assets/data__for_testing/exercises+video.json'
import ExerciseComponent from '@/components/ExerciseComponent';
import { TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useExerciseContext } from '../../components/ExerciseContext';
import MiniExerciseComponent from '@/components/MiniExerciseComponent';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { GLView } from 'expo-gl';
import { ExpoWebGLRenderingContext } from 'expo-gl';
import { manipulateAsync } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';


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

const Home1Screen = () => {

  const exercise= exercises[0];

  const router = useRouter(); 

  const navigation = useNavigation(); 

  const { selectedExercises } = useExerciseContext();

  const { selectedMuscles } = useLocalSearchParams(); 

  const { getExercisesCount} = useExerciseContext(); 

  let muscles: string[] = [];

  if (typeof selectedMuscles === 'string') {
    try {
      muscles = JSON.parse(selectedMuscles);
    } catch (e) {
      muscles = selectedMuscles.split(',');
    }
  } else if (Array.isArray(selectedMuscles)) {
    muscles = selectedMuscles;
  }
  
  const [activeMuscle, setActiveMuscle] = useState(muscles[0]);
  
  const filteredExercises = exercises.filter(exercise => exercise.Muscles.toLowerCase() === activeMuscle);

  const [searchQuery, setSearchQuery]= useState("");

  const [filteredExercisesSearch, setFilteredExercisesSearch] = useState(filteredExercises);

  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = React.useCallback(({ item }:{ item: any }) => {
    return <ExerciseComponent exercise={item} />;
  }, [filteredExercisesSearch]);

  
  const renderItemInModal = ( { item }:{ item: Exercise } ) => {
    return <MiniExerciseComponent 
              exercise={item}
              />
  };
  
  const handlePressOrangeButton=() => {
    router.push('/live-screen'); 
  };

  const handlePressArrow = () => {
    navigation.goBack();
  };

  const handleXModal = () => {
    setModalVisible(false);
  };

  const handlePurpleButton = React.useCallback((muscle: string) => {
    setActiveMuscle(muscle);   
    const filtered = exercises.filter(exercise => exercise.Muscles.toLowerCase() === muscle.toLowerCase());
    setFilteredExercisesSearch(filtered); 
  }, [exercises]);



  const clearSearch = () => {
    setSearchQuery('');
    setFilteredExercisesSearch(filteredExercises);
  }

  const onToggle = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  }

  const openModal = () => {
    setModalVisible(true);
  };


  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const socket = useRef(new WebSocket('ws://192.168.175.226:8765'));
  const [reps, setReps] = useState(0);
  const glViewRef = useRef<GLView>(null);
  const [isProcessing, setIsProcessing] = useState(false);


  useEffect(() => {
    console.log("Inițierea conexiunii WebSocket...");
    socket.current = new WebSocket('ws://192.168.175.226:8765');


    socket.current.onopen = () => {
      console.log("Conexiune WebSocket deschisă!");
    };

    socket.current.onerror = (error) => {
      console.error("Eroare WebSocket:", error);
    };
  
    socket.current.onclose = (event) => {
      console.log("Conexiune WebSocket închisă:", event);
      console.log("Conexiune WebSocket închisă. Încerc reconectarea...");
      setTimeout(() => {
        socket.current = new WebSocket('ws://192.168.175.226:8765');
      }, 3000);
    };

    socket.current.onmessage = (event) => {
      console.log("Mesaj primit de la server:", event.data);
      setReps(parseInt(event.data.toString()));
    };

    return () => {
      socket.current?.close();
      console.log("Conexiune WebSocket închisă");
    };
  }, []);



  useEffect(() => {
    const interval = setInterval(() => {
      
      if (!isProcessing) {
        takePictureAndSend(); 
      }
    }, 100); 
  
    return () => clearInterval(interval); 
  }, [isProcessing]); 


  const takePictureAndSend = async () => {
    if (isProcessing) return; 
    
    setIsProcessing(true)  
  
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({ base64: true, skipProcessing: true, quality: 0.3}); 
        
        if (!photo || !photo.base64) {
          console.error("Eroare: Nu s-a putut captura imaginea.");
          return;
        }
  
        console.log("Base64 Data:", photo.base64.substring(0, 100)); 
  
        // Resize image to reduce file size
        const resizedImage = await manipulateAsync(
          photo.uri,
          [{ resize: { width: 400, height: 600 } }],
          { compress: 0.7 }
        );
  
        const resizedBase64 = await FileSystem.readAsStringAsync(resizedImage.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
  
        if (socket.current?.readyState === WebSocket.OPEN) {
          const message = `Incline Hammer Curls|${resizedBase64}`;
          socket.current.send(message);
          console.log("Imagine trimisă prin WebSocket");
        } else {
          console.error("WebSocket nu este deschis!");
        }
      }
    } catch (error) {
      console.error("Eroare la procesarea imaginii:", error);
    } finally {
      setIsProcessing(false)  // Reset flag after processing
    }
  };
 

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
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
       <TouchableOpacity onPress={handlePressArrow}>
        <Image source={require('../../assets/images/back_arrow_icon.png')} style={styles.logo} />
        </TouchableOpacity>
      </View>
      <View style={styles.sidebar_container}>
        <TouchableOpacity onPress={onToggle}>
          <Image source={require('../../assets/images/sidebar_icon.png')} style={styles.sidebar_icon} />
        </TouchableOpacity>
      </View>
    </View>

    <View style={styles.container}>
        <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef} />

        </View>
        <Text style={styles.repsCounter}>Reps: {reps}</Text>
      </View>



    <View style={styles.bottom_screen}>
         <StaticLine />
      </View>

    
    <TouchableOpacity
        style={styles.floatingButton}
        onPress={openModal}
        >
        <Text style={styles.buttonText}>PLAN</Text>

        <View style={styles.exercisesCountBubble}>
          <Text style={styles.bubbleText}>{getExercisesCount()}</Text>
        </View>

    </TouchableOpacity>


    <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
    >
        <View style={styles.modalContainer}>
          <View style={{alignSelf:'flex-end',marginTop:5, marginRight:5}}>
            <TouchableOpacity onPress={handleXModal}>
              <Ionicons name="close-circle" size={35} color={Colors.blue} />
            </TouchableOpacity>
          </View>
          <View style={{paddingHorizontal:40, marginBottom:10}}>
            <Text style={{fontFamily:'Calistoga', fontSize:25, color:Colors.dark_purple,textAlign:'center'}}>This is your Today's Workout Plan</Text>
          </View>
          <StaticLine />
          <View style={styles.exercises_container_modal}>   
            <FlatList
              data={selectedExercises}
              renderItem={renderItemInModal}
              keyExtractor={(item) => item.WorkOut}
              />

          </View>

          <View style={styles.orange_button_modal}>
            <OrangeButton 
                  onPress={handlePressOrangeButton} 
                  title="Start Workout" 
          />
          </View>
        
        </View>
    </Modal>

    </LinearGradient>

    
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 10,
    justifyContent: 'center',
    paddingHorizontal:15,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 20, 
    overflow: 'hidden',
  },
  repsCounter: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: Colors.white,
  },
  camera: {
    flex: 1,
    borderRadius:50,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
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
    paddingTop:25,
    paddingLeft:20,
  },
  glView: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  sidebar_container:{
    flex:1,
    alignItems:'flex-end',
    paddingTop:30,
    paddingRight:20,
  },
  middle_container: {
    flex: 1,
    justifyContent:"flex-start",

  },
  exercises_container:{
    flex:10,
    
  },
  flatListContent: {
    paddingVertical: 10, 
  },
  bottom_screen:{
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom:30,
  },

  icon:{
    width:70,
    height:30,
    resizeMode: 'contain',
    opacity: 0.8,
    
  },
  logo: {
    width: 30, 
    height: 30,
    resizeMode: 'contain',
  },
  sidebar_icon:{
    width: 25, 
    height: 25,
    resizeMode: 'contain',
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
  floatingButton: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    backgroundColor: Colors.white,
    borderRadius: 50,
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderColor:Colors.blue,
    borderWidth:5,
  },
  buttonText: {
    color: Colors.blue,
    fontSize: 20,
    fontFamily:'Bitter',
  },
  exercisesCountBubble: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.red,
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bubbleText: {
    color: Colors.white,
    fontSize: 13,
    fontFamily:'Bitter',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    margin:'5%',
    borderRadius:25,
    borderColor:Colors.blue,
    borderWidth:5,
  },
  modalContent: {
    width: '60%',
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
  },
  exercises_container_modal:{
    flex:1,
    width:'95%',
    marginTop:10,

  },
  orange_button_modal:{
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom:20,
    paddingTop:20,
    gap:30,
  },
});

export default Home1Screen;
*/



/*import React, {useState, useEffect, useRef} from 'react';
import { View, Button,Text, Modal, Image, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import StaticLine from '../../components/lines/StaticLine';
import {Colors} from '../../constants/Colors';
import OrangeButton from '../../components/buttons/OrangeButton';
import LittlePurpleButton from '@/components/buttons/LittlePurpleButton';
import BodyBackSvg from '../../components/svg/BodyBackSvg';
import BodySvg from '../../components/svg/BodySvg';
import { useNavigation } from '@react-navigation/native';
import DrawerLayout from "@/app/(drawer)/_layout"
import { DrawerActions } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import exercises from '../../assets/data__for_testing/exercises+video.json'
import ExerciseComponent from '@/components/ExerciseComponent';
import { TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useExerciseContext } from '../../components/ExerciseContext';
import MiniExerciseComponent from '@/components/MiniExerciseComponent';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { GLView } from 'expo-gl';
import { ExpoWebGLRenderingContext } from 'expo-gl';
import * as FileSystem from 'expo-file-system';

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

const Home1Screen = () => {

  const exercise= exercises[0];

  const router = useRouter(); 

  const navigation = useNavigation(); 

  const { selectedExercises } = useExerciseContext();

  const { selectedMuscles } = useLocalSearchParams(); 

  const { getExercisesCount} = useExerciseContext(); 

  let muscles: string[] = [];

  if (typeof selectedMuscles === 'string') {
    try {
      muscles = JSON.parse(selectedMuscles);
    } catch (e) {
      muscles = selectedMuscles.split(',');
    }
  } else if (Array.isArray(selectedMuscles)) {
    muscles = selectedMuscles;
  }
  
  const [activeMuscle, setActiveMuscle] = useState(muscles[0]);
  
  const filteredExercises = exercises.filter(exercise => exercise.Muscles.toLowerCase() === activeMuscle);

  const [searchQuery, setSearchQuery]= useState("");

  const [filteredExercisesSearch, setFilteredExercisesSearch] = useState(filteredExercises);

  const [modalVisible, setModalVisible] = useState(false);

  const renderItem = React.useCallback(({ item }:{ item: any }) => {
    return <ExerciseComponent exercise={item} />;
  }, [filteredExercisesSearch]);

  
  const renderItemInModal = ( { item }:{ item: Exercise } ) => {
    return <MiniExerciseComponent 
              exercise={item}
              />
  };
  
  const handlePressOrangeButton=() => {
    router.push('/live-screen'); 
  };

  const handlePressArrow = () => {
    navigation.goBack();
  };

  const handleXModal = () => {
    setModalVisible(false);
  };

  const handlePurpleButton = React.useCallback((muscle: string) => {
    setActiveMuscle(muscle);   
    const filtered = exercises.filter(exercise => exercise.Muscles.toLowerCase() === muscle.toLowerCase());
    setFilteredExercisesSearch(filtered); 
  }, [exercises]);



  const clearSearch = () => {
    setSearchQuery('');
    setFilteredExercisesSearch(filteredExercises);
  }

  const onToggle = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  }

  const openModal = () => {
    setModalVisible(true);
  };


  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const socket = useRef(new WebSocket('ws://192.168.185.226:8765'));
  const [reps, setReps] = useState(0);
  const glViewRef = useRef<GLView>(null);


  useEffect(() => {
    console.log("Inițierea conexiunii WebSocket...");
    socket.current = new WebSocket('ws://192.168.185.226:8765');


    socket.current.onopen = () => {
      console.log("Conexiune WebSocket deschisă!");
    };

    socket.current.onerror = (error) => {
      console.error("Eroare WebSocket:", error);
    };
  
    socket.current.onclose = (event) => {
      console.log("Conexiune WebSocket închisă:", event);
      console.log("Conexiune WebSocket închisă. Încerc reconectarea...");
      setTimeout(() => {
        socket.current = new WebSocket('ws://192.168.185.226:8765');
      }, 3000);
    };

    socket.current.onmessage = (event) => {
      console.log("Mesaj primit de la server:", event.data);
      setReps(parseInt(event.data.toString()));
    };

    return () => {
      socket.current?.close();
      console.log("Conexiune WebSocket închisă");
    };
  }, []);

  let lastSent = Date.now();
  const interval = 5000;

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const loop = async () => {
      if (glViewRef.current && socket.current?.readyState === WebSocket.OPEN) {
        const snapshot = await glViewRef.current.takeSnapshotAsync({ format: 'jpeg',});

        if (snapshot.uri && typeof snapshot.uri === 'string') {
            console.log("Snapshot URI:", snapshot.uri);
            const response = await fetch(snapshot.uri);
            const blob = await response.blob();
            console.log("Blob creat:", blob);
            const reader = new FileReader();
            reader.onloadend = () => {
              if (typeof reader.result === 'string') {
                const base64data = reader.result.split(',')[1];
                console.log("Base64 Data:", base64data.substring(0, 100)); 
                if (base64data) {
                  const message = `Incline Hammer Curls|${base64data}`;
                  if (Date.now() - lastSent > interval) {
                    socket.current.send(message);
                    lastSent = Date.now();
                  }
                }
              } else {
                console.error("Unexpected result type:", typeof reader.result);
              }
            };
            reader.readAsDataURL(blob);
        } else {
          console.error("Snapshot URI is null");
        }
      }
      gl.endFrameEXP();
      requestAnimationFrame(loop);
    };
  
    loop();
  };
  

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
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
       <TouchableOpacity onPress={handlePressArrow}>
        <Image source={require('../../assets/images/back_arrow_icon.png')} style={styles.logo} />
        </TouchableOpacity>
      </View>
      <View style={styles.sidebar_container}>
        <TouchableOpacity onPress={onToggle}>
          <Image source={require('../../assets/images/sidebar_icon.png')} style={styles.sidebar_icon} />
        </TouchableOpacity>
      </View>
    </View>

    <View style={styles.container}>
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <GLView style={styles.glView} onContextCreate={onContextCreate} ref={glViewRef} />
          </CameraView>
        </View>
        <Text style={styles.repsCounter}>Reps: {reps}</Text>
      </View>



    <View style={styles.bottom_screen}>
         <StaticLine />
      </View>

    
    <TouchableOpacity
        style={styles.floatingButton}
        onPress={openModal}
        >
        <Text style={styles.buttonText}>PLAN</Text>

        <View style={styles.exercisesCountBubble}>
          <Text style={styles.bubbleText}>{getExercisesCount()}</Text>
        </View>

    </TouchableOpacity>


    <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
    >
        <View style={styles.modalContainer}>
          <View style={{alignSelf:'flex-end',marginTop:5, marginRight:5}}>
            <TouchableOpacity onPress={handleXModal}>
              <Ionicons name="close-circle" size={35} color={Colors.blue} />
            </TouchableOpacity>
          </View>
          <View style={{paddingHorizontal:40, marginBottom:10}}>
            <Text style={{fontFamily:'Calistoga', fontSize:25, color:Colors.dark_purple,textAlign:'center'}}>This is your Today's Workout Plan</Text>
          </View>
          <StaticLine />
          <View style={styles.exercises_container_modal}>   
            <FlatList
              data={selectedExercises}
              renderItem={renderItemInModal}
              keyExtractor={(item) => item.WorkOut}
              />

          </View>

          <View style={styles.orange_button_modal}>
            <OrangeButton 
                  onPress={handlePressOrangeButton} 
                  title="Start Workout" 
          />
          </View>
        
        </View>
    </Modal>

    </LinearGradient>

    
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 10,
    justifyContent: 'center',
    paddingHorizontal:15,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 20, 
    overflow: 'hidden',
  },
  repsCounter: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: Colors.white,
  },
  camera: {
    flex: 1,
    borderRadius:50,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
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
    paddingTop:25,
    paddingLeft:20,
  },
  glView: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  sidebar_container:{
    flex:1,
    alignItems:'flex-end',
    paddingTop:30,
    paddingRight:20,
  },
  middle_container: {
    flex: 1,
    justifyContent:"flex-start",

  },
  exercises_container:{
    flex:10,
    
  },
  flatListContent: {
    paddingVertical: 10, 
  },
  bottom_screen:{
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom:30,
  },

  icon:{
    width:70,
    height:30,
    resizeMode: 'contain',
    opacity: 0.8,
    
  },
  logo: {
    width: 30, 
    height: 30,
    resizeMode: 'contain',
  },
  sidebar_icon:{
    width: 25, 
    height: 25,
    resizeMode: 'contain',
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
  floatingButton: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    backgroundColor: Colors.white,
    borderRadius: 50,
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderColor:Colors.blue,
    borderWidth:5,
  },
  buttonText: {
    color: Colors.blue,
    fontSize: 20,
    fontFamily:'Bitter',
  },
  exercisesCountBubble: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.red,
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  bubbleText: {
    color: Colors.white,
    fontSize: 13,
    fontFamily:'Bitter',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    margin:'5%',
    borderRadius:25,
    borderColor:Colors.blue,
    borderWidth:5,
  },
  modalContent: {
    width: '60%',
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
  },
  exercises_container_modal:{
    flex:1,
    width:'95%',
    marginTop:10,

  },
  orange_button_modal:{
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom:20,
    paddingTop:20,
    gap:30,
  },
});

export default Home1Screen;*/