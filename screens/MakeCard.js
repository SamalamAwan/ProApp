import React, { useContext } from "react";
import { ScreenContainer } from '../ScreenContainer'
import { Card, Text, Avatar, Subheading, Button, IconButton, Headline, FAB } from 'react-native-paper'
import { KeyboardAvoidingView, ScrollView, TextInput } from "react-native";
import { View } from "react-native";
import { AuthContext } from "../context";
import { useTheme } from "@react-navigation/native";
import lightTheme from "../theme";
import ImagePicker from 'react-native-image-crop-picker';


const Installer = ({ id, setInstallerCount, installerCount }) => {
  return (
    <Card style={{ backgroundColor: "#555", marginHorizontal: 15, marginVertical: 5, borderRadius: 10, paddingHorizontal: 0, paddingTop:0}}>
      <View style={{ alignItems: "stretch", flexWrap: "nowrap", marginBottom: 10, justifyContent: "space-between", flexDirection: "row", padding: 10, backgroundColor: "black", borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
      <Text style={{ color: "white", fontWeight: "bold" }}>Installer {id + 1}</Text>
        {id != 0 && <IconButton icon="close" containerColor="red" onPress={() => setInstallerCount(installerCount - 1)} iconColor="white" size={10} style={{ fontWeight: "bold", borderRadius: 4, height: 20, width: 20, margin: 0 }} mode="contained" />}
      </View>
      <Card.Content style={{ display: "flex", flexDirection: "row", padding: 0, margin: 0 }}>
      
        <TextInput mode="outlined" dense={true} placeholder="Name" style={{ borderRadius: 4, flex: 3, height: 30, justifyContent: "center", maxHeight: 30, marginRight: 2, fontSize: 16, backgroundColor: "white", paddingHorizontal: 5, paddingVertical: 0 }} />
        <IconButton icon="camera-plus" containerColor="black" onPress={() => ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: true
        }).then(image => {
          console.log(image);
        }).catch(e => { })} iconColor="white" size={16} style={{ borderRadius: 4, flex: 1, height: 30, margin: 0 }} mode="contained" />
      </Card.Content>
    </Card>
  )
}

const Company = ({ id, setCompanyCount, companyCount }) => {
  const [installerCount, setInstallerCount] = React.useState(1)
  const [installerCards, setInstallerCards] = React.useState(null)
  const incrementInstallerCount = () => {
    // Update state with incremented value
    setInstallerCount(installerCount + 1);
  };

  React.useEffect(() => {
    let count = installerCount
    let InstallerCards = [];
    if (installerCount > 0) {
      for (let i = 0; i < installerCount; i++) {
        InstallerCards.push(<Installer key={i} id={i} setInstallerCount={setInstallerCount} installerCount={installerCount} />)
      }
      setInstallerCards(InstallerCards)
    }
  }, [installerCount])
  return (
    <Card style={{ backgroundColor: "#4c7931", margin: 10, borderRadius: 10, padding: 0, paddingTop: 0 }}>

      <View style={{ alignItems: "stretch", flexWrap: "nowrap", marginBottom: 10, justifyContent: "space-between", flexDirection: "row", padding: 10, backgroundColor: "black", borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Company {id + 1}</Text>
        {id != 0 &&
          <IconButton icon="close" containerColor="red" onPress={() => setCompanyCount(companyCount - 1)} iconColor="white" size={10} style={{ fontWeight: "bold", borderRadius: 4, height: 20, width: 20, margin: 0 }} mode="contained" />
        }
      </View>

      <Card.Content style={{ display: "flex", flexDirection: "row", padding:0 }}>
        <TextInput mode="outlined" dense={true} placeholder="Company Name" style={{ borderRadius: 4, flex: 3, height: 30, justifyContent: "center", maxHeight: 30, marginRight: 2, fontSize: 16, backgroundColor: "white", paddingHorizontal: 5, paddingVertical: 0 }} />
        <TextInput mode="outlined" dense={true} placeholder="Installer Number" style={{ borderRadius: 4, flex: 3, height: 30, justifyContent: "center", maxHeight: 30, marginRight: 2, fontSize: 16, backgroundColor: "white", paddingHorizontal: 5, paddingVertical: 0 }} />
        <IconButton icon="account-plus" containerColor="black" onPress={incrementInstallerCount} iconColor="white" size={16} style={{ borderRadius: 4, flex: 1, height: 30, margin: 0 }} mode="contained" />
      </Card.Content>

      {installerCards}
    </Card>

  )

}


export const MakeCardScreen = ({ navigation }) => {
  const [userPicture, setUserPicture] = React.useState("https://veen-e.ewipro.com:7443/images/Anonymous_Icon.png");

  const { Profile } = useContext(AuthContext)

  const { colors } = useTheme();
  const [companyCount, setCompanyCount] = React.useState(1)
  const [companyCards, setCompanyCards] = React.useState(null)
  const incrementCompanyCount = () => {
    // Update state with incremented value
    setCompanyCount(companyCount + 1);
  };
  React.useEffect(() => {
    let count = companyCount;
    let CompanyCards = [];
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        CompanyCards.push(<Company key={i} id={i} setCompanyCount={setCompanyCount} companyCount={companyCount} />)
      }
      setCompanyCards(CompanyCards)
    }
  }, [companyCount])

  return (
    <ScreenContainer stretch>
      <KeyboardAvoidingView behavior="position" enabled keyboardVerticalOffset={-60}>
        <ScrollView contentContainerStyle={{ paddingBottom: 0 }} style={{ paddingBottom: 0 }}>
          {companyCards}
          <View style={{ width: "100%", justifyContent: "center", alignItems: "center", paddingHorizontal: 10 }}>
            <IconButton icon="layers-plus" containerColor="black" onPress={incrementCompanyCount} iconColor="white" size={16} style={{ borderRadius: 4, height: 30, width: "100%" }} mode="contained" />
            
          </View>         
        </ScrollView>
       
      </KeyboardAvoidingView>
      <FAB
      label="Submit"
    icon="check"
    style={{position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0}}
    onPress={() => console.log('Pressed')}
  />
    </ScreenContainer>
  );
}


