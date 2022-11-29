import React, { useContext } from "react";
import { ScreenContainer } from '../ScreenContainer'
import { Button, Card, Searchbar, Subheading, Text, TextInput, Title, List, IconButton, Switch } from 'react-native-paper'
import { AuthContext } from "../context";
import { apiKey } from "../context";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAvoidingView, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as dummyJSON from "../dummyForm.json"
import * as SiteInspectionForm from "../siteInspectionForm.json";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ListItem = ({ item, navigation }) => {
  const [listItemElements, setListItemElements] = React.useState(null)

  React.useEffect(() => {
    const listItems = item.submits;
    //console.log("listItem", listItems)
    if (listItems) {
      let listItemObjs = Object.keys(listItems).map(key => (
        // <View key={key} style={{flex:(listItems[key].type == "textInput" || listItems[key].type == "selectInput" ? 4 : 1), borderWidth:1, padding:0, marginHorizontal:2}}>
        <Element key={key} element={listItems[key]} navigation={navigation}/>
        // </View>
      ))
      setListItemElements(listItemObjs)
    }
    else {
      setListItemElements(null)
    }

  }, [item])

  return (
        listItemElements
  )
}


const CustomList = ({ header, values, navigation }) => {
  const [listItems, setListItems] = React.useState(null)
  const [listHeader, setListHeader] = React.useState("")
  const [numOfLines, setNumOfLines] = React.useState(1)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const { colors } = useTheme();
  const borderRadius = useSharedValue(10);
  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  };
  const style = useAnimatedStyle(() => {
    return {
      borderRadius: withTiming(borderRadius.value, config),
    };
  });
  React.useEffect(() => {
    const title = header;
    if (title) {
      setListHeader(title)
    }
    else {
      setListHeader("");
    }

    const items = values.listItems;
    if (items) {
      let itemObjs = Object.keys(items).map(key => (
        <ListItem key={key} item={items[key]} navigation={navigation} />
      ))
      setListItems(itemObjs)
    }
    else {
      setListItems(null)
    }
  }, [values, header])

  const onTextLayout = React.useCallback(e => {
    
    if (e.nativeEvent.layout.height < 22){
      setNumOfLines(1)
    }
    else if (e.nativeEvent.layout.height < 32){
      setNumOfLines(2)
    }
    else{
      setNumOfLines(3)
    }
  }, []);

  const handleExpand = () =>{
    setIsExpanded(!isExpanded);
  }
  return (
    <View style={{ padding: 0, margin:0, backgroundColor:"#cccccc", borderRadius:(isExpanded ? 10 : 0),borderTopLeftRadius:10,borderTopRightRadius:10,borderBottomLeftRadius:10,borderBottomRightRadius:10,overflow:"hidden"}}>
    <List.Accordion
      title={listHeader != "" ? listHeader : ""}
      titleNumberOfLines={3}
      left={() => {<></>}}
      right={
        ({isExpanded}) =>
        {
          return(
          <IconButton color="black"
            icon={isExpanded ? "minus" : "plus"}
            onLayout={onTextLayout}
            animated={true}
            iconColor={"black"}
            size={numOfLines == 1 ? 14 : numOfLines == 2 ? 20 : 28}
            style={{
              right:-7, top:0, margin:(0,0,0,0), padding:(0,0,0,0), borderRadius:0, minHeight:"100%", flex:1, flexShrink:1, height:10,
            }}
          />)
        }
      }
      onPress={handleExpand}
      expanded={isExpanded}
      style={{ padding: 0, margin:0, backgroundColor:"#cccccc", borderRadius:(isExpanded ? 0 : 10),borderTopLeftRadius:10,borderTopRightRadius:10,overflow:"hidden"}}
      titleStyle={{ fontSize: 14, width: "100%", padding: (0,0,0,0), margin: (0,0,0,0), flex: 1, lineHeight: 15, color:"#000000", fontWeight:"bold" }}
    >
      {listItems}
    </List.Accordion>
    </View>
  )
}


const Element = ({ element, navigation }) => {
  console.log(navigation)
  if (element.type == "label") {
    return (
      <Text>{element.value}</Text>
    )
  }
  if (element.type == "title") {
    return (
      <Text style={{fontWeight:"bold", fontSize:25}}>{element.value}</Text>
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
        label={element.label ? element.label : "No Label"}
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
    return <CustomList header={element.headerTitle} values={element.value} navigation={navigation}/>
  }
  if (element.type == "textInput") {
    const [text, setText] = React.useState(element.value)
    return (
      <TextInput
        //label={<Text style={{padding:0,margin:0,position:"absolute",top:0,left:0}}>Text Input</Text>}
        mode="flat"
        left={() => <></>}
        dense={false}
        value={text}
        onChangeText={text => setText(text)}
        style={{ margin:0,left:0, marginTop:0, paddingTop:0, fontSize: 10, borderRadius:0, borderTopStartRadius:0,borderTopEndRadius:0, borderWidth:0, height:20,lineHeight:10,justifyContent:"flex-start", width:"100%"}}
      />
    )
  }
  if (element.type == "photoInput") {
    console.log("geere", navigation)
    const [name, setName] = React.useState(element.name)
    const [photoReturn, setPhotoReturn] = React.useState();
    //console.log(element)
    React.useEffect(()=>{console.log(photoReturn)},[photoReturn])

    if (element.conditional == true){
      const [reqsComment, setReqsComment] = React.useState(false);
      const [comment, setComment] = React.useState(element.comment)
      const onToggleComment = () => setReqsComment(!reqsComment);
      return (
        <Card style={{backgroundColor:"#fdfdfd", borderRadius:10, marginTop:10, margin:2, padding:2}}>
          <>
        <Card.Content style={{display:"flex", flexDirection:"column"}}>
        <View style={{display:"flex", flexDirection:"row"}}>
        <View style={{flex:2,justifyContent:"center", alignItems:"flex-start"}}>
        <Text style={{fontWeight:"bold", fontSize:18}}>{element.label}</Text>
        </View>
        <View style={{flex:2,justifyContent:"center", alignItems:"flex-end"}}>
          <IconButton color="black"
            icon={"camera-plus"}
            animated={true}
            containerColor={"#333"}
            iconColor={"white"}
            size={15}
            onPress={() => navigation.navigate("Camera", {props:{title:element.label}, setPhotoReturn:setPhotoReturn})}
            style={{
              right:0, top:0, margin:(0,0,0,0), padding:(0,0,0,0), borderRadius:0,maxHeight:30, flex:1, flexShrink:1, height:10, borderWidth:1
            }}
          />
        </View>
        <View style={{flex:1,justifyContent:"flex-end", alignItems:"center", flexDirection:"row"}}>
        <MaterialCommunityIcons name={"comment"} size={10} color={"black"} />
        <Switch color="red" value={reqsComment} onValueChange={onToggleComment} />
        </View>
        </View>
        <View style={{display:"flex", flexDirection:"row"}}>
        {reqsComment &&  <TextInput
        label={"Comment"}
        multiline={true}
        mode="outlined"
        dense={true}
        value={comment}
        onChangeText={text => setComment(text)}
        style={{marginTop:2,marginBottom:2, fontSize: 10, flex:1}}
      />}
      </View>
        </Card.Content>
        </>
      </Card>

      )
    }
    else{
    return (
      <IconButton color="black"
            icon={"camera-plus"}
            animated={true}
            containerColor={"#333"}
            iconColor={"white"}
            size={10}
            onPress={() => navigation.navigate("Camera")}
            style={{
              right:0, top:0, margin:(0,0,0,0), padding:(0,0,0,0), borderRadius:0, minHeight:"100%", flex:1, flexShrink:1, height:10, borderWidth:1
            }}
          />
    )
          }
  }
  if (element.type == "selectInput") {
    const [selectedLanguage, setSelectedLanguage] = React.useState(element.value);
    return (
      <Picker
      itemStyle={{margin:0,padding:0, height:20, fontSize:10}}
      style={{ margin:0, marginTop:0, paddingTop:0, fontSize: 10, borderRadius:0, borderWidth:0, height:20,lineHeight:100,}}
        mode={"dropdown"}
        selectedValue={selectedLanguage}
        onValueChange={(itemValue, itemIndex) =>
          setSelectedLanguage(itemValue)
        }>
        <Picker.Item label="test" value="" />
        <Picker.Item label="Java" style={{ borderBottomColor: "red", borderBottomWidth: 2 }} value="java" />
        <Picker.Item label="JavaScript" value="js" />
      </Picker>
    )
  }
  if (element.type == "submitButton") {
    return (
      <View style={{justifyContent:"flex-end", display:"flex",alignItems:"stretch"}}>
      <Button mode="contained" style={{borderRadius:5}} onPress={()=>{console.log("SUBMIT")}}>{element.label}</Button>
      </View>
    )
  }

  return (
    <Text>No Controller for {element.type}</Text>
  )
}

const Col = ({ col, styles, navigation }) => {
  const [elements, setElements] = React.useState(null);
  React.useEffect(() => {
    const element = col.elements;
    if (element) {
      let ElementObjs = Object.keys(element).map(key => (
        <Element key={key} element={element[key]} navigation={navigation} />
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


const Row = ({ row, navigation }) => {
  const [cols, setCols] = React.useState(null);
  //console.log(navigation)
  React.useEffect(() => {
    const cols = row.cols
    //console.log(cols)
    if (cols) {
      let ColObjs = Object.keys(cols.items).map(key => (
        <Col key={key} col={cols.items[key]} styles={cols.styles} navigation={navigation} />
      ))
      setCols(ColObjs)
    }
    else {
      setCols(null)
    }

  }, [row])

  return (
    <View style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-between", alignItems: "flex-start", minWidth: "100%", marginBottom: 5, borderBottomWidth: 0,paddingBottom:10, borderColor: "#ddd", paddingHorizontal: 5 }}>{cols}</View>
  )
}

export const CreateForm = ({ navigation, route }) => {
  const [form, setForm] = React.useState(route.params.props.title == "Site Inspection" ? SiteInspectionForm.default : dummyJSON.default);
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
        <Row key={key} row={HeaderRows[key]} navigation={navigation} />
      ))
      setHeader(HeaderRowObjs)
    }
    else {
      setHeader(null)
    }

    const ContentRows = content.rows
    if (ContentRows) {
      let ContentRowObjs = Object.keys(ContentRows).map(key => (
        <Row key={key} row={ContentRows[key]} navigation={navigation} />
      ))
      setContent(ContentRowObjs)
    }
    else {
      setContent(null)
    }

    const FooterRows = footer.rows
    if (FooterRows) {
      let FooterRowObjs = Object.keys(FooterRows).map(key => (
        <Row key={key} row={FooterRows[key]} navigation={navigation} />
      ))
      setFooter(FooterRowObjs)
    }
    else {
      setFooter(null)
    }

  }, [form])

  return (
    <ScreenContainer stretch>
      <KeyboardAvoidingView behavior="position" enabled keyboardVerticalOffset={-60}>
        <ScrollView contentContainerStyle={{ paddingBottom: 0 }} style={{ paddingBottom: 0 }}>
          {form.formName && <View style={{ margin: 10, paddingBottom: 0 }}>
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


