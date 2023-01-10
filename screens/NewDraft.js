import React, { useContext } from "react";
import { ScreenContainer } from '../ScreenContainer'
import { Button, Card, IconButton, Searchbar, Subheading, Text, Title, Portal, Dialog } from 'react-native-paper'
import { AuthContext } from "../context";
import { apiKey } from "../context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { View } from "react-native";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NewDraft = ({ navigation, route }) => {


  const DeleteConfirm = ({ deleteConfirmVisible, closeDeleteConfirm, deleteFileAsync, fileName, refreshDrafts}) => {
    return (
      <Portal>
        <Dialog visible={deleteConfirmVisible} onDismiss={closeDeleteConfirm}>
          <Dialog.Title>Are you sure you want to delete?</Dialog.Title>
          <Dialog.Title>{fileName.replace("@form_", "").replace(/_/g, " ")}</Dialog.Title>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", marginVertical: 20 }}>
            <Button mode="contained" contentStyle={{ justifyContent: "center", alignItems: "center", display: "flex" }} labelStyle={{ textAlign: "center", padding: 0, margin: 0 }} onPress={() => deleteFileAsync(fileName).then((res)=>
               res ? alert("success") : alert("failed"),
               closeDeleteConfirm(),
               refreshDrafts(),

               )}>Yes, delete.</Button>
            <Button mode="contained" contentStyle={{ justifyContent: "center", alignItems: "center", display: "flex" }} labelStyle={{ textAlign: "center" }} buttonColor="red" onPress={() => closeDeleteConfirm()}>No, cancel</Button>
          </View>
        </Dialog>
      </Portal>
    )
  }
  const SubmitConfirm = ({ submitConfirmVisible, closeSubmitConfirm, submitFile, fileName, refreshDrafts, getLocalForm}) => {
    const [formSubmit, setFormSubmit] = React.useState(null);
    React.useEffect(()=>{
      getLocalForm(fileName).then((form) =>{
        if (form){
          setFormSubmit(form)
        }else{
          alert("no form found")
          setFormSubmit(null)
        }
      })
    },[getLocalForm])

    React.useEffect(()=>{
      console.log(formSubmit)
    },[formSubmit])

    return (
      <Portal>
        <Dialog visible={submitConfirmVisible} onDismiss={closeSubmitConfirm}>
          <Dialog.Title>Are you sure you want to submit?</Dialog.Title>
          <Dialog.Title>{fileName.replace("@form_", "").replace(/_/g, " ")}</Dialog.Title>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", marginVertical: 20 }}>
            {formSubmit != null && <Button mode="contained" contentStyle={{ justifyContent: "center", alignItems: "center", display: "flex" }} labelStyle={{ textAlign: "center", padding: 0, margin: 0 }} onPress={() => submitFile(formSubmit)}>Yes, submit.</Button>}
            <Button mode="contained" contentStyle={{ justifyContent: "center", alignItems: "center", display: "flex" }} labelStyle={{ textAlign: "center" }} buttonColor="red" onPress={() => closeSubmitConfirm()}>No, cancel</Button>
          </View>
        </Dialog>
      </Portal>
    )
  }


  const { colors } = useTheme();
  const { Profile } = React.useContext(AuthContext);
  const [forms, setForms] = React.useState(null);
  const [formButtons, setFormButtons] = React.useState(null);
  const [draftButtons, setDraftButtons] = React.useState(null);
  const [formToBeDeleted, setFormToBeDeleted] = React.useState("");
  const [formToBeSubmitted, setFormToBeSubmitted] = React.useState("");
  const getAllDraftNames = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys;
    } catch (error) {
      console.error(error)
    }
  }


  const deleteFileAsync = async (formName) => {
    if (formName != ""){
      try {
        await AsyncStorage.removeItem(formName);
        return true;
    }
    catch(exception) {
      console.error(exception)
      return false;
    }
    }
  }


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

  const getLocalForm = async (formname) =>{
    try {
      const forms = await AsyncStorage.getItem(formname)
      if (forms !== null) {
          return JSON.parse(forms)
      }
      else{
          return "no"
      }
  } catch (e) {
      alert(e)
  }
}
  
const startDelete = (formName) =>{
  setDeleteConfirmVisible(true)
  setFormToBeDeleted(formName)
}

const startSubmit = (formName) =>{
  setSubmitConfirmVisible(true)
  setFormToBeSubmitted(formName)
}
  

  const openDraft = (draftName) => {
    getLocalForm(draftName).then((data) => {
      const util = require('util')

console.log(util.inspect(data, {showHidden: false, depth: null, colors: true,  maxArrayLength: 10, maxStringLength:10 }))
      navigation.navigate("Create Form", { props: { draftForm: data, isDraft:true } })
    })
  }

  const refreshDrafts = () =>{
    getForms();
      getAllDraftNames().then((forms) => {
        if (forms) {
          var savedFormButton = Object.keys(forms).map(key => {
            return (
            forms[key].indexOf("@form_") > -1 ? 
            <View style={{ flex: 1,marginHorizontal: 20, flexDirection:"row",minWidth:"90%",flex:1}} key={key}>
            <Button key={key} mode="contained" style={{ borderRadius: 5, marginBottom: 5, flex: 1, minWidth: "100%", maxWidth: "100%", padding: 0,marginLeft:0, paddingLeft:0 }} labelStyle={{ color: "white", width: "90%", flexWrap: "wrap",textAlign:"left" }} onPress={()=> openDraft(forms[key])}>{forms[key].replace("@form_", "").replace(/_/g, " ")}</Button>
            <IconButton color="black"
                icon={"minus"}
                iconColor={"white"}
                size={20}
                style={{
                  right: 40, top: 8, margin: (0, 0, 0, 0), padding: (0, 0, 0, 0), borderRadius: 5, maxHeight: 20, position:"absolute", backgroundColor:"red", width:20
                }}
                onPress={()=>startDelete(forms[key])}
              />
                    <IconButton color="black"
                icon={"check"}
                iconColor={"white"}
                size={20}
                style={{
                  right: 10, top: 8, margin: (0, 0, 0, 0), padding: (0, 0, 0, 0), borderRadius: 5, maxHeight: 20, position:"absolute", backgroundColor:"blue", width:20
                }}
                onPress={()=>startSubmit(forms[key])}
              />
            </View>
            :
            null
          )}
          )
          setDraftButtons(savedFormButton)
        }
        });
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshDrafts();
      // getDrafts().then((data) => {
      //   console.log("loaded");
      //   console.log(data);
      // });
    });
    return unsubscribe;
  }, [navigation]);


  React.useEffect(() => {
    const newForms = forms;
    if (newForms) {
      var newFormButtons = Object.keys(newForms).map(key => (
        <Button key={key} mode="contained" style={{ borderRadius: 1, marginHorizontal: 10, marginBottom: 5, flex: 1, minWidth: "33%", maxWidth: "45%", padding: 0 }} labelStyle={{ color: "white", width: "98%", flexWrap: "wrap" }} onPress={() => navigation.navigate("Create Form", { props: { form: newForms[key]["formID"], isDraft:true } })}>{newForms[key]["formName"]}</Button>
      ))
      setFormButtons(newFormButtons)
    }
    else {
      setFormButtons(null)
    }
  }, [forms])


  const [deleteConfirmVisible, setDeleteConfirmVisible] = React.useState(false);
  const closeDeleteConfirm = () => {
    setDeleteConfirmVisible(false);
  }

  const [submitConfirmVisible, setSubmitConfirmVisible] = React.useState(false);
  const closeSubmitConfirm = () => {
    setSubmitConfirmVisible(false);
  }

  const submitFile = React.useCallback((file) => {
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
            "action": "saveForm",
            "jsonData": file,
            "formSchemaID": 1
          })
        };
        return fetch('https://api-veen-e.ewipro.com/v1/bdm/', data)
          .then((response) => {
            if (!response.ok) throw new Error(response.status);
            else return response.json();
          })
          .then((responseData) => {
            console.log(responseData);
            if (responseData.status == true){
            alert("Success")
            }
            setSubmitConfirmVisible(false);
          })
          .catch((error) => {
            console.log(error)
            alert(error.toString());
          });
      }
    }, [])

  return (
    <ScreenContainer stretch>
      <Card style={{ margin: 10, backgroundColor: "#333" }}>
        <Card.Content>
          <Text style={{ color: "white", fontSize: 30 }}>Create a New Draft</Text>
        </Card.Content>
      </Card>

      <View style={{ display: "flex", flexWrap: "wrap", flexDirection: "row", justifyContent: "center" }}>
        {formButtons}
      </View>
      <Card style={{ margin: 10, backgroundColor: "#333" }}>
        <Card.Content>
          <Text style={{ color: "white", fontSize: 30 }}>Saved Drafts</Text>
        </Card.Content>
      </Card>
      <View style={{ display: "flex", flexWrap: "wrap", flexDirection: "row", justifyContent: "center", maxWidth:"100%", width:"100%", marginHorizontal: "auto", }}>
        <>
        {draftButtons}
        </>
      </View>
      <SubmitConfirm closeSubmitConfirm={closeSubmitConfirm} submitConfirmVisible={submitConfirmVisible} submitFile={submitFile} fileName={formToBeSubmitted} refreshDrafts={refreshDrafts} getLocalForm={getLocalForm} />
      <DeleteConfirm closeDeleteConfirm={closeDeleteConfirm} deleteConfirmVisible={deleteConfirmVisible} deleteFileAsync={deleteFileAsync} fileName={formToBeDeleted} refreshDrafts={refreshDrafts} />
    </ScreenContainer>
  );
}


