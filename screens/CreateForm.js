import React, { useContext } from "react";
import { ScreenContainer } from '../ScreenContainer'
import { Button, Card, Searchbar, Subheading, Text, Title } from 'react-native-paper'
import { AuthContext } from "../context";
import { apiKey } from "../context";
import { TouchableOpacity } from "react-native-gesture-handler";
import { View } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as dummyJSON from "../dummyForm.json"

export const CreateForm = ({ navigation, route }) => {

  const [form, setForm] = React.useState(dummyJSON.default)

  React.useEffect(()=>{
    console.log(form.formSections)
    const header = form.formSections.formHeader;
    const content = form.formSections.formContent;
    const footer = form.formSections.formFooter;
    console.log(header.rows.length)
    console.log(content)
    console.log(footer)
  },[form])

  return (
    <ScreenContainer stretch>
      {form.formName && <View style={{margin:10}}>
      <Title style={{fontSize:30, fontWeight:"bold"}}>{form.formName}</Title>
      </View>}
    </ScreenContainer>
  );
}


