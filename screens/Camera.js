import React, { useContext, useRef } from "react";
import { ScreenContainer } from '../ScreenContainer'
import { Card, Text, Avatar, Subheading, IconButton, Button} from 'react-native-paper'
import { TouchableOpacity, View } from "react-native";
import { AuthContext } from "../context";
import { useTheme } from "@react-navigation/native";
import lightTheme from "../theme";
import { Camera, CameraType } from 'expo-camera';
import styles from '../styles'

export const CameraScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = React.useState(null);
  const [type, setType] = React.useState(CameraType.back);
  const [photostate, setphotostate] = React.useState("DEFAULT");
  const [currentPhotos, setCurrentPhotos] = React.useState(false)
  const [captureDisabled, setCaptureDisabled] = React.useState(false)
  const [confirmDisabled, setConfirmDisabled] = React.useState(true)
  const [currentRatio, setCurrentRatio] = React.useState();
  const [currentSize, setCurrentSize] = React.useState();
  const [ratios, setRatios] = React.useState([]);
  const [sizes, setSizes] = React.useState([]);
  const [ratioButtons, setRatioButtons] = React.useState(null)
  const [sizeButtons, setSizeButtons] = React.useState(null)
  const [photoArray, setPhotoArray] = React.useState([])
  const cameraInstance = useRef();
  const { Profile } = React.useContext(AuthContext)
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const {colors} = useTheme();
  const getRatios = async () => {
    if (cameraInstance.current) {
      let ratios = await cameraInstance.current.getSupportedRatiosAsync();
      return ratios
    }  
  }
  const getSizes = async (ratio) => {
    if (cameraInstance.current) {
      let sizes = await cameraInstance.current.getAvailablePictureSizesAsync(ratio);
      return sizes
    }  
  }

  const handleSizeChange = (currentSize) => {
    setCurrentSize(currentSize)
  }

  const handleRatioChange = (currentRatio) =>{
    setCurrentRatio(currentRatio);
    getSizes(currentRatio).then((data)=>{
      if (data){
        setCurrentSize(data[0])
        setSizes(data)
          let SizeButtons = Object.keys(data).map(key => (
            <TouchableOpacity onPress={() => handleSizeChange(data[key])} style={{padding:0, margin:0, maxHeight:40, flex:1, justifyContent:"center",alignItems:"center"}} key={key}>
              <Text style={{fontSize:10,color: (currentSize == data[key] ? "orange" :"white" )}}>{data[key]}</Text>
            </TouchableOpacity>
          ))
          setSizeButtons(SizeButtons)
        }
        else{
          setSizeButtons(null)
        }
    })
  }
  React.useEffect(() => {
    getRatios().then((data)=>{
      if (data){
      setRatios(data)
        let RatioButtons = Object.keys(data).map(key => (
          <TouchableOpacity onPress={() => handleRatioChange(data[key])} style={{padding:0, margin:0, maxHeight:40, flex:1, justifyContent:"center",alignItems:"center"}} key={key}>
            <Text style={{fontSize:20,color: (currentRatio == data[key] ? "orange" :"white" )}}>{data[key]}</Text>
          </TouchableOpacity>
        ))
        setRatioButtons(RatioButtons)
      }
      else{
        setRatioButtons(null)
      }
    });
  }, [currentRatio, currentSize]);

  if (!permission) {
    return <View />;
  }
  if (!permission.granted) {
    return <Text>No access to camera</Text>;
  }

  return (
    <ScreenContainer stretch>
      <View style={{
        display: "flex",
        flexDirection: "row",
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"rgba(0,0,0,0.5)",
        margin: 0,
        padding: 20,
        top: 0,
        width: "100%",
        zIndex: 200,
        position: "absolute"
      }}>
             {ratioButtons}
      </View>
      <View style={{
        display: "flex",
        flexDirection: "row",
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"rgba(0,0,0,0.5)",
        margin: 0,
        padding: 20,
        top: 61,
        width: "100%",
        zIndex: 200,
        position: "absolute"
      }}>
             {sizeButtons}
      </View>
      <Camera style={styles.camera} type={type} ref={cameraInstance} ratio={currentRatio} size={currentSize}>
      </Camera>
      <IconButton
        icon="plus-box"
        disabled={captureDisabled}
        style={{ backgroundColor: colors.primary, position: "absolute", bottom: 0, margin: 20 }}
        color={colors.white}
        size={50}
        onPress={() => console.log("hi")}
      />
      <IconButton
        icon="check"
        disabled={confirmDisabled}
        style={{ backgroundColor: colors.primary, position: "absolute", bottom: 0, margin: 20, right: 20 }}
        color={colors.white}
        size={50}
        onPress={() => console.log("hi")}
      />
    </ScreenContainer>
  );
}


