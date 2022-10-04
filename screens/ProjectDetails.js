import React, { useContext } from "react";
import { ScreenContainer } from '../ScreenContainer'
import { Button, Card, Searchbar, Subheading, Text, Title } from 'react-native-paper'
import { AuthContext } from "../context";
import { apiKey } from "../context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { View } from "react-native";
import { useTheme } from "@react-navigation/native";


export const ProjectDetails = ({ navigation, route }) => {

  const {colors} = useTheme();

  return (
    <ScreenContainer stretch>
      <Card style={{margin:10, backgroundColor:"#333"}}>
        <Card.Content>
      {route.params.props.address1 && <Subheading style={{color:"white"}}>Address 1: {route.params.props.address1}</Subheading>}
      {route.params.props.address2 && <Subheading style={{color:"white"}}>Address 2: {route.params.props.address2}</Subheading>}
      {route.params.props.address3 && <Subheading style={{color:"white"}}>Address 3: {route.params.props.address3}</Subheading>}
      {route.params.props.postcode && <Subheading style={{color:"white"}}>Postcode: {route.params.props.postcode}</Subheading>}
      {route.params.props.projectID && <Subheading style={{color:"white"}}>Project ID: {route.params.props.projectID}</Subheading>}
      </Card.Content>
      </Card>

      <View style={{display:"flex", flexWrap:"wrap", flexDirection:"row", justifyContent:"center"}}>
        <Button mode="contained" style={{borderRadius:1, marginHorizontal:10, marginBottom:5, flex:1, minWidth:"33%", maxWidth:"45%"}} labelStyle={{color:"white"}} onPress={() => navigation.navigate("Create Form", {props:{title:"Site Inspection"}})}>Site Inspection</Button>
        <Button mode="contained" style={{borderRadius:1, marginHorizontal:10, marginBottom:5, flex:1, minWidth:"33%", maxWidth:"45%"}} labelStyle={{color:"white"}} onPress={() => console.log("pressed")}>Pull Out Test</Button>
        <Button mode="contained" style={{borderRadius:1, marginHorizontal:10, marginBottom:5, flex:1, minWidth:"33%", maxWidth:"45%"}} labelStyle={{color:"white"}} onPress={() => console.log("pressed")}>Site Visit</Button>
        <Button mode="contained" style={{borderRadius:1, marginHorizontal:10, marginBottom:5, flex:1, minWidth:"33%", maxWidth:"45%"}} labelStyle={{color:"white"}} onPress={() => console.log("pressed")}>Create Form</Button>
        <Button mode="contained" style={{borderRadius:1, marginHorizontal:10, marginBottom:5, flex:1, minWidth:"33%", maxWidth:"45%"}} labelStyle={{color:"white"}} onPress={() => console.log("pressed")}>Create Form</Button>
        <Button mode="contained" style={{borderRadius:1, marginHorizontal:10, marginBottom:5, flex:1, minWidth:"33%", maxWidth:"45%"}} labelStyle={{color:"white"}} onPress={() => console.log("pressed")}>Create Form</Button>
      </View>
    </ScreenContainer>
  );
}


