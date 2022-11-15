import React, { useContext } from "react";
import { ScreenContainer } from '../ScreenContainer'
import { Card, Text, Avatar, Subheading } from 'react-native-paper'
import { View } from "react-native";
import { AuthContext } from "../context";
import { useTheme } from "@react-navigation/native";
import lightTheme from "../theme";

export const HomeScreen = ({ navigation }) => {
  const [userPicture, setUserPicture] = React.useState("https://veen-e.ewipro.com:7443/images/Anonymous_Icon.png");
  
  const { Profile } = useContext(AuthContext)

  const {colors} = useTheme();

  React.useEffect(()=>{
    if (Profile.userName){
    var userName = Profile.userName
    var imageUrl = "https://veen-e.ewipro.com:7443/images/employees/"+userName.toLocaleLowerCase()+".jpg"
    setUserPicture(imageUrl)
  }
  //console.log(Profile)
  },[Profile])




  return (
    <ScreenContainer stretch>
      <Card style={{backgroundColor:"#4c7931", margin:10,borderRadius:10}}>
    <Card.Content style={{display:"flex", flexDirection:"row"}}>

    <View style={{flex:1,justifyContent:"flex-end", alignItems:"flex-end", marginHorizontal:10}}>
      <Subheading style={{fontWeight:"bold", fontSize:30, lineHeight:30, color:"white"}}>{Profile.name}</Subheading>
      <Subheading style={{fontWeight:"bold", fontSize:15, lineHeight:30, color:"white"}}>{Profile.userClassName}</Subheading>
    </View>
    <View style={{justifyContent:"center", alignItems:"flex-end"}}>
    <Avatar.Image source={{uri : userPicture}} />
    </View>
    </Card.Content>
  </Card>

    </ScreenContainer>
  );
}


