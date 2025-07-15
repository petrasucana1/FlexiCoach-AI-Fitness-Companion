import React, { useEffect, useRef } from 'react';
import { CameraView, CameraType } from 'expo-camera';
import axios from 'axios';
import { View, Button,Text, Modal, Image, StyleSheet, FlatList, TouchableOpacity} from 'react-native';

interface CameraStreamSenderProps {
  facing: CameraType;
}

const CameraStreamSender: React.FC<CameraStreamSenderProps> = ({ facing }) => {
  /*const cameraRef = useRef<CameraView>(null);

  const sendFrame = async (image: string) => {
    try {
      await axios.post('http://192.168.119.226:5000/video_feed', image, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });
      console.log("Frame sent successfully.");
    } catch (error) {
      console.error("Error sending frame:", error);
    }
  };

  const handleCameraStream = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      const photo = await cameraRef.current.takePictureAsync(options);

      if (photo && photo.base64) {
        console.log("Sending frame with base64:", photo.base64.substring(0, 50) + "...");
        await sendFrame(photo.base64);
      } else {
        console.error('Failed to capture photo');
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Sending frame every second...");
      handleCameraStream();
    }, 1000);

    return () => {
      clearInterval(interval);
      console.log("Clearing interval");
    };
  }, []);
*/
  return (
    <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            
          
          >
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      
      </CameraView>
  );
};

const styles = StyleSheet.create({
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
    });

export default CameraStreamSender;

