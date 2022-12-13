import React, { useContext } from "react";
import { ScreenContainer } from '../ScreenContainer'
import { Button, Card, Searchbar, Subheading, Text, Title, useTheme } from 'react-native-paper'
import { AuthContext } from "../context";
import { apiKey } from "../context";
import { TouchableOpacity, View } from "react-native";
export const ActionCenter = ({ navigation }) => {
  const { Profile } = useContext(AuthContext)
  const {colors} = useTheme();



  return (
    <ScreenContainer nomargin>
      {/* <View style={{backgroundColor:"white", padding:20, minWidth:"80%", justifyContent:"center", alignItems:"center", minHeight:"80%", flexDirection:"column"}}> */}
      <Button mode="contained" onPress={() => navigation.navigate("Find Projects")} style={{borderRadius:0, minWidth:"80%", minHeight:90}} labelStyle={{fontSize:50, lineHeight:100}}>
        Find a Project
      </Button>
      <Text style={{margin:20, fontSize:40, color:"#bbb"}}>or</Text>
      <Button mode="contained" onPress={() => navigation.navigate("New Draft")} style={{borderRadius:0, minWidth:"80%", minHeight:90}} labelStyle={{fontSize:50, lineHeight:100}}>
        Create a Draft
      </Button>
      {/* </View> */}
    </ScreenContainer>
  );
}


