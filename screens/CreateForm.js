import React, { useContext } from "react";
import { ScreenContainer } from '../ScreenContainer'
import { Button, Card, Searchbar, Subheading, Text, TextInput, Title, List } from 'react-native-paper'
import { AuthContext } from "../context";
import { apiKey } from "../context";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAvoidingView, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as dummyJSON from "../dummyForm.json"
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';

const ListItem = ({item}) => {
  const [listItemElements, setListItemElements] = React.useState(null)

React.useEffect(()=>{
  const listItems = item.submits;
  console.log("listItem", listItems)
  if (listItems) {
    let listItemObjs = Object.keys(listItems).map(key => (
      <Element key={key} element={listItems[key]} />
    ))
    setListItemElements(listItemObjs)
  }
  else {
    setListItemElements(null)
  }

},[item])

  return (
    <Card style={{marginBottom:5}}>
          <Title style={{paddingHorizontal:10}}>{item.title}</Title>
    <Card.Content>
    {listItemElements}
  </Card.Content>
  </Card>
  )
}


const CustomList = ({ header, values }) => {
  const [listItems, setListItems] = React.useState(null)
  const [listHeader, setListHeader] = React.useState("")
  React.useEffect(() => {
    const title = header;
    if (title){
      setListHeader(title)
    }
    else{
      setListHeader("");
    }

    const items = values.listItems;
    if (items){
    let itemObjs = Object.keys(items).map(key => (
      <ListItem key={key} item={items[key]} />
    ))
    setListItems(itemObjs)
    }
    else{
      setListItems(null)
    }
  }, [values, header])

  return (
    <List.Accordion
    title={listHeader != "" ? listHeader : ""}
    >{listItems}</List.Accordion>
    
  )
}


const Element = ({ element }) => {

  React.useEffect(() => {
    console.log("elementtyyy", element)
  }, [element])

  if (element.type == "label") {
    return (
      <Text>{element.value}</Text>
    )
  }
  if (element.type == "linebreak") {
    return (
      <View style={{ height: 10 }}></View>
    )
  }
  if (element.type == "textareaInput") {
    const [text, setText] = React.useState(element.value)
    return (
      <TextInput
        label="TextArea"
        multiline={true}
        mode="outlined"
        dense={true}
        value={text}
        onChangeText={text => setText(text)}
        style={{ marginBottom: 10, fontSize: 10 }}
      />
    )
  }
  if (element.type == "dateInput") {
    const [date, setDate] = React.useState(new Date());
    const [time, setTime] = React.useState(new Date());
    const showDatepicker = () => {
      showDateMode();
    };
    const showTimepicker = () => {
      showTimeMode();
    };
    const onChangeDate = (event, selectedDate) => {
      const currentDate = selectedDate;
      setDate(currentDate);
    };
    const onChangeTime = (event, selectedTime) => {
      const currentTime = selectedTime;
      setTime(currentTime);
    };
    const showDateMode = () => {
      DateTimePickerAndroid.open({
        value: date,
        onChange: onChangeDate,
        mode: "date",
        is24Hour: true,
        display: "default",
      });
    };
    const showTimeMode = () => {
      DateTimePickerAndroid.open({
        value: time,
        onChange: onChangeTime,
        mode: "time",
        is24Hour: true,
        display: "default",
      });
    };

    return (
      <View style={{ display: "flex", flexDirection: "row" }}>
        <TextInput
          label="Time"
          mode="outlined"
          dense={true}
          style={{ flex: 1, maxWidth: 70, maxHeight: 60, marginRight: 2 }}
          value={time.getHours() + ":" + (time.getMinutes() < 10 ? '0' : '') + time.getMinutes()}
          onPressIn={showTimepicker}
        />
        <TextInput
          label="Date"
          mode="outlined"
          dense={true}
          style={{ flex: 1, maxWidth: 100, maxHeight: 60 }}
          value={date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()}
          onFocus={showDatepicker}
        />
      </View>
    )
  }
  if (element.type == "list") {
    return <CustomList header={element.headerTitle} values={element.value} />
  }
  if (element.type == "textInput"){
    const [text, setText] = React.useState(element.value)
    return (
      <TextInput
        label="TextInput"
        mode="outlined"
        dense={true}
        value={text}
        onChangeText={text => setText(text)}
        style={{ marginBottom: 10, fontSize: 10 }}
      />
    )
  }
  if (element.type == "photoInput"){
    const [name, setName] = React.useState(element.name)
    return (
      <Button
      mode={"contained"}
      onPress={() =>console.log("hello")}
      >
        {name != "" ? name : "photo"}
      </Button>
    )
  }
  if (element.type == "selectInput"){
    const [selectedLanguage, setSelectedLanguage] = React.useState(element.value);
    return (
      <Picker
      itemStyle={{borderColor:"#000000", borderWidth:2}}
      style={{borderColor:"#000000", borderWidth:2}}
      mode={"dropdown"}
      selectedValue={selectedLanguage}
      onValueChange={(itemValue, itemIndex) =>
        setSelectedLanguage(itemValue)
      }>
        <Picker.Item label="test" value="" />
      <Picker.Item label="Java" style={{borderBottomColor:"red", borderBottomWidth:2}} value="java" />
      <Picker.Item label="JavaScript" value="js" />
    </Picker>
    )
  }

  return (
    <Text>No Controller for {element.type}</Text>
  )
}

const Col = ({ col, styles }) => {
  const [elements, setElements] = React.useState(null);
  React.useEffect(() => {
    const element = col.elements;
    if (element) {
      let ElementObjs = Object.keys(element).map(key => (
        <Element key={key} element={element[key]} />
      ))
      setElements(ElementObjs)
    }
    else {
      setElements(null)
    }
  }, [col, styles])

  return (
    <View style={{ display: "flex", flex: 1, flexDirection: "column", flexWrap: "nowrap", paddingHorizontal: 5 }}>{elements}</View>
  )
}


const Row = ({ row }) => {
  const [cols, setCols] = React.useState(null);
  React.useEffect(() => {
    const cols = row.cols
    //console.log(cols)
    if (cols) {
      let ColObjs = Object.keys(cols.items).map(key => (
        <Col key={key} col={cols.items[key]} styles={cols.styles}/>
      ))
      setCols(ColObjs)
    }
    else {
      setCols(null)
    }

  }, [row])

  return (
    <View style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-between", alignItems: "flex-start", minWidth: "100%", marginBottom: 5, borderBottomWidth: 1, borderColor: "#ddd", paddingHorizontal: 5 }}>{cols}</View>
  )
}

export const CreateForm = ({ navigation, route }) => {

  const [form, setForm] = React.useState(dummyJSON.default)
  const [header, setHeader] = React.useState(null)
  const [content, setContent] = React.useState(null)
  const [footer, setFooter] = React.useState(null);

  React.useEffect(() => {
    const header = form.formSections.formHeader;
    const content = form.formSections.formContent;
    const footer = form.formSections.formFooter;
    const HeaderRows = header.rows;
    if (HeaderRows) {
      let HeaderRowObjs = Object.keys(HeaderRows).map(key => (
        <Row key={key} row={HeaderRows[key]} />
      ))
      setHeader(HeaderRowObjs)
    }
    else {
      setHeader(null)
    }

    const ContentRows = content.rows
    if (ContentRows) {
      let ContentRowObjs = Object.keys(ContentRows).map(key => (
        <Row key={key} row={ContentRows[key]} />
      ))
      setContent(ContentRowObjs)
    }
    else {
      setContent(null)
    }

    const FooterRows = footer.rows
    if (FooterRows) {
      let FooterRowObjs = Object.keys(FooterRows).map(key => (
        <Row key={key} row={FooterRows[key]} />
      ))
      setFooter(FooterRowObjs)
    }
    else {
      setFooter(null)
    }

  }, [form])

  return (
    <ScreenContainer stretch>
    <KeyboardAvoidingView behavior="position" enabled   keyboardVerticalOffset={-60}>
    <ScrollView contentContainerStyle={{paddingBottom:0}} style={{paddingBottom:0}}>
      {form.formName && <View style={{ margin: 10,paddingBottom:0 }}>
        <Title style={{ fontSize: 30, fontWeight: "bold" }}>{form.formName}</Title>
      </View>}
      {header}
      {content}
      {footer}
      </ScrollView>
    </KeyboardAvoidingView>
    </ScreenContainer>
  );
}


