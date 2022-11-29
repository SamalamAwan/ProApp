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
    <Card style={{ backgroundColor: "#555", marginHorizontal: 15, marginVertical: 5, borderRadius: 10, paddingHorizontal: 0, paddingTop: 0 }}>
      <View style={{ alignItems: "stretch", flexWrap: "nowrap", marginBottom: 10, justifyContent: "space-between", flexDirection: "row", padding: 10, backgroundColor: "black", borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Installer {id + 1}</Text>
        {id != 0 ? <IconButton icon="close" containerColor="red" onPress={() => setInstallerCount(installerCount - 1)} iconColor="white" size={10} style={{ fontWeight: "bold", borderRadius: 4, height: 20, width: 20, margin: 0 }} mode="contained" /> : null}
      </View>
      <Card.Content style={{ display: "flex", flexDirection: "row", padding: 0, margin: 0 }}>
        <TextInput mode="outlined" dense={true} placeholder="Name" style={{ borderRadius: 4, flex: 3, height: 30, justifyContent: "center", maxHeight: 30, marginRight: 2, fontSize: 16, backgroundColor: "white", paddingHorizontal: 5, paddingVertical: 0 }} />
        <IconButton icon="camera-plus"
          containerColor="black"
          onPress={() => ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
          }).then(image => {
            console.log(image)
          }).catch(e => { console.log(e) })}
          iconColor="white"
          size={16}
          style={{ borderRadius: 4, flex: 1, height: 30, margin: 0 }}
          mode="contained" />
      </Card.Content>
    </Card>
  )
}

const Company = ({ id, setCompanyCount, companyCount, currentResults, setResults, company }) => {
  const [installerCount, setInstallerCount] = React.useState(1);
  const [installerCards, setInstallerCards] = React.useState(null);
  const [companyName, setCompanyName] = React.useState(company.Company);
  const [installerNumber, setInstallerNumber] = React.useState(company.installerNumber);
  const incrementInstallerCount = () => {
    setInstallerCount(installerCount + 1);
    console.log("current",currentResults)
  };
  const updateCompany = (companyname) => {
    setCompanyName(companyname);
  };
  const updateNumber = (installernumber) => {
    setInstallerNumber(installernumber);
  };
  const updateResults = () => {

  }

  React.useEffect(() => {
    const current = currentResults;
    const newName = companyName;
    const newNumber = installerNumber;
    let newCount = installerCount;
    const newRes = {
      "Company": newName,
      "InstallerNumber": newNumber,
      "Installers": [newCount]
    }
    // console.log("current", current)
    // console.log("new", newRes)
  }, [installerCount, companyName, installerNumber])

  React.useEffect(() => {
    let count = installerCount;
    const InstallerCards = [];
    //console.log(count)
    if (count > 0) {
      // let InstallerCardObjs = count.map(key => (
      //   <Installer id={key+1} key={key} setInstallerCount={setInstallerCount} installerCount={count} />
      // ))
      for (let i = 0; i < installerCount; i++) {
        InstallerCards.push(<Installer key={i} id={i} setInstallerCount={setInstallerCount} installerCount={count} />)
      }
      setInstallerCards(InstallerCards)
    }
  }, [installerCount])

  return (
    <Card style={{ backgroundColor: "#4c7931", margin: 10, borderRadius: 10, padding: 0, paddingTop: 0 }}>
      <View style={{ alignItems: "stretch", flexWrap: "nowrap", marginBottom: 10, justifyContent: "space-between", flexDirection: "row", padding: 10, backgroundColor: "black", borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
        <Text style={{ color: "white", fontWeight: "bold" }}>Company {parseInt(company.ID) + 1}</Text>
        {id !== 0 ? <IconButton icon="close" containerColor="red" onPress={() => setCompanyCount(companyCount - 1)} iconColor="white" size={10} style={{ fontWeight: "bold", borderRadius: 4, height: 20, width: 20, margin: 0 }} mode="contained" /> : null}
      </View>
      <Card.Content style={{ display: "flex", flexDirection: "row", padding: 0 }}>
        <TextInput
          mode="outlined"
          dense={true}
          value={companyName}
          placeholder="Company Name"
          onChangeText={companyName => setCompanyName(companyName)}
          style={{ borderRadius: 4, flex: 3, height: 30, justifyContent: "center", maxHeight: 30, marginRight: 2, fontSize: 16, backgroundColor: "white", paddingHorizontal: 5, paddingVertical: 0 }}
        />
        <TextInput
          mode="outlined"
          dense={true}
          placeholder="Installer Number"
          value={installerNumber}
          onChangeText={installerNumber => setInstallerNumber(installerNumber)}
          style={{ borderRadius: 4, flex: 3, height: 30, justifyContent: "center", maxHeight: 30, marginRight: 2, fontSize: 16, backgroundColor: "white", paddingHorizontal: 5, paddingVertical: 0 }}
        />
        <IconButton
          icon="account-plus"
          containerColor="black"
          onPress={incrementInstallerCount}
          iconColor="white" size={16}
          style={{ borderRadius: 4, flex: 1, height: 30, margin: 0 }}
          mode="contained"
        />
      </Card.Content>
      {installerCards}
    </Card>
  );
}

export const MakeCardScreen = ({ navigation }) => {
  const [userPicture, setUserPicture] = React.useState("https://veen-e.ewipro.com:7443/images/Anonymous_Icon.png");

  const { Profile } = useContext(AuthContext)

  const { colors } = useTheme();
  const [results, setResults] = React.useState(null);
  const [companyCount, setCompanyCount] = React.useState(1)
  const [companyCards, setCompanyCards] = React.useState(null)

  const incrementCompanyCount = () => {
    setCompanyCount(companyCount + 1);
    const res = results;
    res.push({
      "ID":companyCount,
      "Company": "",
      "InstallerNumber": "",
      "Installers": [
        {
          "InstallerName": "",
          "InstallerPicture": ""
        }
      ]
    })
  };
  React.useEffect(() => {
    const res = results
    let count = companyCount;
    let CompanyCards = [];
    console.log(res)

    if (count > 0 && res != null) {
      for (let i = 0; i < count; i++) {
        CompanyCards.push(<Company currentResults={results} setResults={setResults} key={i} id={i} setCompanyCount={setCompanyCount} companyCount={count} />)
      }
      let CompanyCardObjs = Object.keys(res).map(key => (
        <Company key={key} company={res[key]} setResults={setResults} id={key} setCompanyCount={setCompanyCount} companyCount={count} />
      ))
      setCompanyCards(CompanyCardObjs)
    }
  }, [companyCount,results])

  React.useEffect(() => {
    if (results == null) {
      const defSettings = [{
        "ID":0,
        "Company": "",
        "InstallerNumber": "",
        "Installers": [
          {
            "InstallerName": "",
            "InstallerPicture": ""
          }
        ]
      }];
      setResults(defSettings)
    }
  }, [])

  const resultsMemo = React.useMemo(() => {
    return ({
      Companies: results
    })
  }, [results]);



  return (
    <ScreenContainer stretch>
      <KeyboardAvoidingView behavior="position" enabled keyboardVerticalOffset={-60}>
        <ScrollView contentContainerStyle={{ paddingBottom: 0 }} style={{ paddingBottom: 0 }}>
          {companyCards}
          <View style={{ width: "100%", justifyContent: "center", alignItems: "center", paddingHorizontal: 10 }}>
            <IconButton icon="layers-plus" containerColor="black" onPress={incrementCompanyCount} iconColor="white" size={16} style={{ borderRadius: 4, height: 30, width: "100%" }} mode="contained" />
          </View>
          <View style={{ width: "100%", justifyContent: "center", alignItems: "center", paddingHorizontal: 10 }}>
            <IconButton icon="check" containerColor="black" onPress={() => console.log("submitted")} iconColor="white" size={16} style={{ borderRadius: 4, height: 30, width: "100%" }} mode="contained" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}


