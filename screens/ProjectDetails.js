import React, { useContext } from "react";
import { ScreenContainer } from '../ScreenContainer'
import { Button, Card, Searchbar, Subheading, Text, Title } from 'react-native-paper'
import { AuthContext } from "../context";
import { apiKey } from "../context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { View } from "react-native";
import { useTheme } from "@react-navigation/native";


export const ProjectDetails = ({ navigation, route }) => {
  const [forms, setForms] = React.useState(null);
  const [formButtons, setFormButtons] = React.useState(null);
  const {Profile} = React.useContext(AuthContext);
  const getForms = React.useCallback(() => {
    let jwt = Profile.jwt
    let apikey = apiKey
    if (jwt != null) {
      let authGet = apikey + " " + jwt
      let data = {
        method: 'POST',
        mode: "cors", // no-cors, cors, *same-origin *=default
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authGet
        },
        body: JSON.stringify({
          "action": "projectFormsList",
        })
      };
      return fetch('https://api-veen-e.ewipro.com/v1/bdm/', data)
        .then((response) => {
          if (!response.ok) throw new Error(response.status);
          else return response.json();
        })
        .then((responseData) => {
          if (responseData.status == true) {
            setForms(responseData.results)
          }
        })
        .catch((error) => {
          alert("Unable to log in - " + error.toString());
        });
    }
  }, [])

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getForms();
    });
    return unsubscribe;
  }, [navigation]);

  const {colors} = useTheme();

  React.useEffect(() => {
    const newForms = forms;
    if (newForms) {
      var newFormButtons = Object.keys(newForms).map(key => (
        <Button key={key} mode="contained" style={{ borderRadius: 1, marginHorizontal: 10, marginBottom: 5, flex: 1, minWidth: "33%", maxWidth: "45%", padding: 0 }} labelStyle={{ color: "white", width: "98%", flexWrap: "wrap" }} onPress={() => navigation.navigate("Create Form", { props: { form: newForms[key]["formID"], isDraft:false } })}>{newForms[key]["formID"]}</Button>
      ))
      setFormButtons(newFormButtons)
    }
    else {
      setFormButtons(null)
    }
  }, [forms])




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
        <Button mode="contained" style={{borderRadius:1, marginHorizontal:10, marginBottom:5, flex:1, minWidth:"33%", maxWidth:"45%", padding:0}} labelStyle={{color:"white", width:"98%", flexWrap:"wrap"}} onPress={() => navigation.navigate("Create Form", {props:{title:"Site Inspection"}})}>Site Inspection</Button>
        <Button mode="contained" style={{borderRadius:1, marginHorizontal:10, marginBottom:5, flex:1, minWidth:"33%", maxWidth:"45%"}} labelStyle={{color:"white"}} onPress={() => navigation.navigate("Create Form", {props:{title:"Pull Out Test"}})} >Pull Out Test</Button>
        <Button mode="contained" style={{borderRadius:1, marginHorizontal:10, marginBottom:5, flex:1, minWidth:"33%", maxWidth:"45%"}} labelStyle={{color:"white"}} onPress={() => navigation.navigate("Create Form", {props:{title:"Site Visit"}})}>Site Visit</Button>
        <Button mode="contained" style={{borderRadius:1, marginHorizontal:10, marginBottom:5, flex:1, minWidth:"33%", maxWidth:"45%"}} labelStyle={{color:"white"}} onPress={() => console.log("pressed")}>Create Form</Button>
        <Button mode="contained" style={{borderRadius:1, marginHorizontal:10, marginBottom:5, flex:1, minWidth:"33%", maxWidth:"45%"}} labelStyle={{color:"white"}} onPress={() => console.log("pressed")}>Create Form</Button>
        <Button mode="contained" style={{borderRadius:1, marginHorizontal:10, marginBottom:5, flex:1, minWidth:"33%", maxWidth:"45%"}} labelStyle={{color:"white"}} onPress={() => console.log("pressed")}>Create Form</Button>
        {formButtons}
      </View>
    </ScreenContainer>
  );
}


