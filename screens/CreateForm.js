import React, { useContext } from "react";
import { ScreenContainer } from '../ScreenContainer'
import { Button, Card, Searchbar, Subheading, Text, TextInput, Title, List, IconButton, Switch, FAB, Portal, Provider, Dialog, Modal, ActivityIndicator } from 'react-native-paper'
import { AuthContext } from "../context";
import { apiKey } from "../context";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Image, ImageBackground, KeyboardAvoidingView, View } from "react-native";
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
import ImageCropPicker from "react-native-image-crop-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;




const DeleteConfirm = ({ deleteConfirmVisible, closeDeleteConfirm, deletePhoto, photoToBeDeleted }) => {
  return (
    <Portal>
      <Dialog visible={deleteConfirmVisible} onDismiss={closeDeleteConfirm}>
        <Dialog.Title>Are you sure you want to delete this photo?</Dialog.Title>
        <Image style={{ width: 200, height: 200, marginHorizontal: 50 }}
          resizeMode="cover"
          source={{ uri: `data:image/jpeg;base64,${photoToBeDeleted.photo}` }} />
        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", marginVertical: 20 }}>
          <Button mode="contained" contentStyle={{ justifyContent: "center", alignItems: "center", display: "flex" }} labelStyle={{ textAlign: "center", padding: 0, margin: 0 }} onPress={() => deletePhoto(photoToBeDeleted)}>Yes, delete.</Button>
          <Button mode="contained" contentStyle={{ justifyContent: "center", alignItems: "center", display: "flex" }} labelStyle={{ textAlign: "center" }} buttonColor="red" onPress={() => closeDeleteConfirm()}>No, cancel</Button>
        </View>
      </Dialog>
    </Portal>
  )
}

const PhotoDisplayer = ({ visible, hidePhotoViewer, photo, startDeletePhoto, photoViewerInputID }) => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = React.useState(true);
  const hide = () => {
    setIsLoading(true)
    hidePhotoViewer();
  }

  React.useEffect(() => {
    (photo != '' ? setIsLoading(false) : null)
    //console.log(photo)
  }, [photo])

  return (
    <Portal>

      <Modal visible={visible} onDismiss={hidePhotoViewer} style={{ width: windowWidth - 20, height: windowHeight - 150, backgroundColor: "#efefef", margin: 10, marginBottom: 0, borderWidth: 5, borderColor: colors.primary, position: "absolute", top: 0 }}>
        {isLoading &&
          <ActivityIndicator animating={true} size="large" />
        }
        {!isLoading && <View style={{ width: windowWidth - 30, height: windowHeight, marginTop: 30, position: 'relative' }}>
          <ReactNativeZoomableView
            maxZoom={90}
            bindToBorders={true}
          >
            <Image
              style={{ width: windowWidth, maxHeight: windowHeight - 160, minHeight: windowHeight - 155, resizeMode: 'cover' }}
              source={(photo != '') ? {
                uri: `data:image/jpeg;base64,${photo}`
              } : require('../assets/imageload.png')} />

          </ReactNativeZoomableView>

        </View>}
        <View>
          <Button mode="contained" style={{ backgroundColor: "red" }} onPress={() => startDeletePhoto(photoViewerInputID, photo)}>Delete Photo</Button>
        </View>
        <IconButton icon={"close"} iconColor={"white"} style={{ backgroundColor: "red", position: "absolute", top: 50, right: 0 }} onPress={() => hide()} />
      </Modal>

    </Portal>
  )
}
const ImagePreview = ({ image, sendPhotoToModal, elementID }) => {
  return (
    <TouchableOpacity onPress={() => sendPhotoToModal(image, elementID)}>
      <Image style={{ width: 50, height: 50, margin: 2 }}
        resizeMode="cover"
        resizeMethod="resize"
        source={{ uri: `data:image/jpeg;base64,${image}` }} />
    </TouchableOpacity>
  )
}


const FileNamePrompt = ({ fileNamePromptVisible, closeFileNamePrompt, saveFileAsync }) => {
  const [filename, setFilename] = React.useState("");
  const [nameExists, setNameExists] = React.useState(false);
  const getAllDraftNames = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys;
    } catch (error) {
      console.error(error)
    }
  }
  React.useEffect(() => {
    getAllDraftNames().then((keys) => {
      let name = filename;
      if (keys.indexOf("@form_" + name) > -1) {
        setNameExists(true);
      }
      else {
        setNameExists(false);
      }
    })
  }, [filename])
  return (
    <Portal>
      <Dialog visible={fileNamePromptVisible} onDismiss={closeFileNamePrompt}>
        <Dialog.Title>Enter File Name</Dialog.Title>
        <Dialog.Content>
          <TextInput
            mode={"contained"}
            value={filename}
            onChangeText={(text) => setFilename(text)}
          />
          {nameExists && <Text style={{ color: "red" }}>Filename already exists, you will be overwriting the old version.</Text>}
        </Dialog.Content>

        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", marginBottom: 20 }}>
          <Button mode="contained" contentStyle={{ justifyContent: "center", alignItems: "center", display: "flex" }} labelStyle={{ textAlign: "center", padding: 0, margin: 0 }} onPress={() => saveFileAsync(filename)}>Save</Button>
          <Button mode="contained" contentStyle={{ justifyContent: "center", alignItems: "center", display: "flex" }} labelStyle={{ textAlign: "center" }} buttonColor="red" onPress={() => closeFileNamePrompt()}>Cancel</Button>
        </View>

      </Dialog>
    </Portal>
  )
}

const FabMenu = ({ startSaveFile }) => {
  const [state, setState] = React.useState({ open: false });
  const { colors } = useTheme();
  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  return (
    <Provider>
      <Portal>
        <FAB.Group
          open={open}
          visible
          icon={open ? 'arrow-down' : 'menu'}
          actions={[
            {
              icon: 'content-save',
              label: 'Save',
              onPress: () => startSaveFile(),
            },
            // {
            //   icon: 'check',
            //   label: 'Submit',
            //   onPress: () => startSubmit(),
            // },
          ]}
          fabStyle={{ backgroundColor: "#4c7931", borderWidth: 3, width: 50, height: 50, justifyContent: "center", alignItems: "center" }}
          onStateChange={onStateChange}
          onPress={() => {
            if (open) {
              // do something if the speed dial is open
            }
          }}
        />
      </Portal>
    </Provider>
  );
};



const ListItem = ({ item, navigation, handleFormChange, sendPhotoToModal, startDeletePhoto }) => {
  const [listItemElements, setListItemElements] = React.useState(null)

  React.useEffect(() => {
    const listItems = item.submits;
    //console.log("listItem", listItems)
    if (listItems) {
      let listItemObjs = Object.keys(listItems).map((key) => {
        let style = {};
        // listItems[key].type == "textareaInput" || listItems[key].type == "textInput" || listItems[key].type == "selectInput" ?
        //   style = { flex: 1, borderWidth: 0, padding: 0, marginHorizontal: 2, marginVertical: 5, flexDirection: "column", minHeight: "100%" }
        //   :
        style = { borderWidth: 0, padding: 0, marginHorizontal: 2, marginVertical: 5, flexDirection: "column", flex: 1 }
        return (
          <View key={key} style={style}>
            <Element key={key} element={listItems[key]} navigation={navigation} handleFormChange={handleFormChange} sendPhotoToModal={sendPhotoToModal} startDeletePhoto={startDeletePhoto} />
          </View>
        )
      })
      setListItemElements(listItemObjs)
    }
  }, [item])

  return (
    <Card style={{ backgroundColor: "#fdfdfd", borderRadius: 5, marginBottom: 10, margin: 2, paddingVertical: 10, flex: 1 }}>
      <>
        <Text style={{ marginLeft: 15, marginBottom: 10, fontWeight: "bold" }}>{item.title}</Text>
        <Card.Content style={{ display: "flex", flexDirection: "column" }}>
          <View style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "stretch", minWidth: "100%" }}>
            <>
              {listItemElements}
            </>
          </View>
        </Card.Content>
      </>
    </Card>
  )
}


const CustomList = ({ header, values, navigation, handleFormChange, sendPhotoToModal, startDeletePhoto }) => {
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
    const items = values.listItems;
    const title = header;
    if (title) {
      setListHeader(title)
    }
    else {
      setListHeader(null);
    }
    if (items) {
      //console.log(items.length)
      let itemObjs = Object.keys(items).map(key => (
        <ListItem key={key} item={items[key]} navigation={navigation} handleFormChange={handleFormChange} sendPhotoToModal={sendPhotoToModal} startDeletePhoto={startDeletePhoto} />
      ))
      //console.log(itemObjs.length)
      setListItems(itemObjs)
    }
    else {
      setListItems(null)
    }
  }, [values, header])

  const onTextLayout = React.useCallback(e => {

    if (e.nativeEvent.layout.height < 22) {
      setNumOfLines(1)
    }
    else if (e.nativeEvent.layout.height < 32) {
      setNumOfLines(2)
    }
    else {
      setNumOfLines(3)
    }
  }, []);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  }
  return (
    <View style={{ padding: 0, margin: 0, backgroundColor: "#cccccc", borderRadius: (isExpanded ? 10 : 0), borderTopLeftRadius: 10, borderTopRightRadius: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10, overflow: "hidden" }}>
      <List.Accordion
        title={listHeader != "" ? listHeader : ""}
        titleNumberOfLines={3}
        left={() => { <></> }}
        right={
          ({ isExpanded }) => {
            return (
              <IconButton color="black"
                icon={isExpanded ? "minus" : "plus"}
                onLayout={onTextLayout}
                animated={true}
                iconColor={"black"}
                size={numOfLines == 1 ? 14 : numOfLines == 2 ? 20 : 28}
                style={{
                  right: -7, top: 0, margin: (0, 0, 0, 0), padding: (0, 0, 0, 0), borderRadius: 0, minHeight: "100%", flex: 1, flexShrink: 1, height: 10,
                }}
              />)
          }
        }
        onPress={handleExpand}
        expanded={isExpanded}
        style={{ padding: 0, margin: 0, backgroundColor: "#cccccc", borderRadius: (isExpanded ? 0 : 10), borderTopLeftRadiwus: 10, borderTopRightRadius: 10, overflow: "hidden" }}
        titleStyle={{ fontSize: 14, width: "100%", padding: (0, 0, 0, 0), margin: (0, 0, 0, 0), flex: 1, lineHeight: 15, color: "#000000", fontWeight: "bold" }}
      >
        <>
          <View style={{ marginHorizontal: 10 }}>
            <>
              {listItems}
            </>
          </View>
        </>
      </List.Accordion>
    </View>
  )
}


const Element = ({ element, navigation, handleFormChange, sendPhotoToModal, startDeletePhoto }) => {
  // console.log(navigation)
  const handleChange = (payload) => {
    //console.log(payload)
    handleFormChange({ "payload": payload, "elementID": element.id })
  }

  if (element.type == "label") {
    return (
      <Text>{element.value}</Text>
    )
  }
  if (element.type == "title") {
    return (
      <Text style={{ fontWeight: "bold", fontSize: 25 }}>{element.value}</Text>
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
        onChange={e => handleChange(e.nativeEvent.text)}
        onChangeText={text => setText(text)}
        style={{ marginBottom: 0, fontSize: 10, height: 48 }}
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
    return <CustomList header={element.headerTitle} values={element.value} navigation={navigation} handleFormChange={handleFormChange} sendPhotoToModal={sendPhotoToModal} startDeletePhoto={startDeletePhoto} />
  }
  if (element.type == "textInput") {
    const [text, setText] = React.useState(element.value)
    return (
      <TextInput
        label={element.label ? element.label : "No Label"}
        mode="outlined"
        dense={true}
        value={text}
        onChange={e => handleChange(e.nativeEvent.text)}
        onChangeText={text => setText(text)}
        style={{ marginBottom: 0, fontSize: 10, height: 48 }}
      />
    )
  }
  if (element.type == "photoInput") {
    const [name, setName] = React.useState(element.name)
    const [allPhotos, setAllPhotos] = React.useState(element.value.length > 0 ? element.value : []);
    const [imagePreviews, setImagePreviews] = React.useState(null);
    const [imageDialogVisible, setImageDialogVisible] = React.useState(false);
    const showImageDialog = () => setImageDialogVisible(true); 
    const hideImageDialog = () => setImageDialogVisible(false);
    const handleImageReturn = (returnedImage) => {
      if (allPhotos.length < 1) {
        setAllPhotos([returnedImage])
      }
      else {
        setAllPhotos([...allPhotos, returnedImage])
      }
    }
    React.useEffect(() => {
      const photos = allPhotos
      setImagePreviews(null);
      if (photos) {
        let photoObjs = Object.keys(photos).map(key => (
          <ImagePreview key={key} image={photos[key]} sendPhotoToModal={sendPhotoToModal} elementID={element.id} />
        ))
        setImagePreviews(photoObjs)
      }
      handleChange(photos);
    }, [allPhotos])



    return (
      <View style={{ flexDirection: "column", maxWidth: "100%" }}>
        <IconButton color="black"
          icon={"camera-plus"}
          animated={true}
          containerColor={"#333"}
          iconColor={"white"}
          size={15}
          onPress={() => showImageDialog()}
          style={{
            right: 0, top: 0, margin: (0, 0, 0, 0), padding: (0, 0, 0, 0), borderRadius: 0, maxHeight: 30, flexShrink: 1, height: 10, borderWidth: 0, flex: 1, minHeight: 20
          }}
        />
        <ScrollView style={{ flexDirection: "row" }} horizontal={true} persistentScrollbar={true} indicatorStyle="white">
          {imagePreviews}
        </ScrollView>
        <Portal>
          <Dialog visible={imageDialogVisible} onDismiss={hideImageDialog} style={{paddingBottom:20}}>
            <Dialog.Title>{element.label}</Dialog.Title>
            <View style={{flexDirection:"row",flexWrap:"wrap"}}>
<View style={{width:"100%", minWidth:"100%",flexWrap:"nowrap",flexDirection:"row", flex:1, justifyContent:"space-evenly",paddingBottom:20}}>
<IconButton color="black"
          icon={"camera"}
          animated={true}
          containerColor={"#333"}
          iconColor={"white"}
          size={15} onPress={() => ImageCropPicker.openCamera({
            cropping: false,
            includeBase64: true,
            mediaType: 'photo',
            compressImageQuality: 0.2
          }).then(image => {
            handleImageReturn(image.data)
          }).catch(e => { alert(e) })}
          >
            Camera
            </IconButton>

            <IconButton color="#666666"
          icon={"folder-image"}
          animated={true}
          containerColor={"#666666"}
          iconColor={"#666666"} onPress={() => ImageCropPicker.openPicker({
            cropping: false,
            includeBase64: true,
            mediaType: 'photo',
            compressImageQuality: 0.2,
            multiple:true
          }).then(image => {
            handleImageReturn(image.data)
          }).catch(e => { alert(e) })}
          />
            </View>
            <View style={{width:"100%", minWidth:"100%",flexWrap:"nowrap",flexDirection:"row", flex:1, justifyContent:"space-evenly"}}>
              <Button onPress={hideImageDialog}>Cancel</Button>
              </View>
            </View>
          </Dialog>
        </Portal>
      </View>
    )
  }
  if (element.type == "selectInput") {
    const [selectedLanguage, setSelectedLanguage] = React.useState(element.value);
    console.log(element.options)
    const [options, setOptions] = React.useState();

    React.useEffect(() => {
      if (element.options) {
        if (element.label){
          let OptionsElements = [<Picker.Item label={"--- "+element.label+" ---"} style={{fontWeight:"bold",color:"#777777"}} value="" key={-1}/>];
          OptionsElements.push(Object.keys(element.options).map(key =>
            <Picker.Item key={key} label={element.options[key]} value={element.options[key]} />
          )
          )
          setOptions(OptionsElements)
          }
          else{
            let OptionsElements = Object.keys(element.options).map(key =>
              <Picker.Item key={key} label={element.options[key]} value={element.options[key]} />
            )
            setOptions(OptionsElements)
          }
      }
      else {
        setOptions(null);
      }
    }, [element.options,element.label])

    return (<View
      style={{
        paddingVertical: 0,
        paddingHorizontal: 0,
        backgroundColor: '#fefbff',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 0,
        height: 48,
        minWidth:"100%"
      }}>
      <Picker
        itemStyle={{ margin: 0, padding: 0, fontSize: 10, backgroundColor: "white", marginBottom: 0, lineHeight: 0 }}
        // style={{ margin: 0, marginTop: 0, paddingTop: 0, fontSize: 10, borderRadius: 50, borderWidth: 1, height: 20,backgroundColor:"red", marginBottom:20 }}
        style={{ height: 42, lineHeight: 0, minWidth:"100%"}}
        mode={"dialog"}
        selectedValue={selectedLanguage}
        onValueChange={(itemValue, itemIndex) =>
          handleChange(itemValue)
        }>
        {options}
      </Picker>
    </View>
    )
  }
  // if (element.type == "submitButton") {
  //   return (
  //     <View style={{ justifyContent: "flex-end", display: "flex", alignItems: "stretch" }}>
  //       <Button mode="contained" style={{ borderRadius: 5 }} onPress={() => { console.log("SUBMIT") }}>{element.label}</Button>
  //     </View>
  //   )
  // }

  return (
    <Text>No Controller for {element.type}</Text>
  )
}

const Col = ({ col, styles, navigation, handleFormChange, sendPhotoToModal, startDeletePhoto }) => {
  const [elements, setElements] = React.useState(null);

  React.useEffect(() => {
    const element = col.elements;
    if (element) {
      let ElementObjs = Object.keys(element).map(key => (
        <Element key={key} element={element[key]} navigation={navigation} handleFormChange={handleFormChange} sendPhotoToModal={sendPhotoToModal} />
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


const Row = ({ row, navigation, handleFormChange, sendPhotoToModal, startDeletePhoto }) => {
  const [cols, setCols] = React.useState(null);
  //console.log(navigation)
  React.useEffect(() => {
    const cols = row.cols
    //console.log(cols)
    if (cols) {
      let ColObjs = Object.keys(cols.items).map(key => (
        <Col key={key} col={cols.items[key]} styles={cols.styles} navigation={navigation} handleFormChange={handleFormChange} sendPhotoToModal={sendPhotoToModal} startDeletePhoto={startDeletePhoto} />
      ))
      setCols(ColObjs)
    }
    else {
      setCols(null)
    }

  }, [row])

  return (
    <View style={{ display: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-between", alignItems: "flex-start", minWidth: "100%", marginBottom: 5, borderBottomWidth: 0, paddingBottom: 10, borderColor: "#ddd", paddingHorizontal: 5 }}>{cols}</View>
  )
}

export const CreateForm = ({ navigation, route }) => {
  //const [form, setForm] = React.useState(route.params.props.title == "Site Inspection" ? SiteInspectionForm.default : dummyJSON.default);
  const [formId, setFormId] = React.useState(route.params.props.form);
  const [form, setForm] = React.useState(route.params.props.draftForm ? route.params.props.draftForm : null);
  const [results, setResults] = React.useState(route.params.props.draftForm ? route.params.props.draftForm : null);
  const [header, setHeader] = React.useState(null)
  const [content, setContent] = React.useState(null)
  const [footer, setFooter] = React.useState(null);
  const { Profile } = React.useContext(AuthContext);
  const [photoDisplayVisible, setPhotoDisplayVisible] = React.useState(false)
  const [photoForViewer, setPhotoForViewer] = React.useState('');
  const [photoViewerInputID, setPhotoViewerInputID] = React.useState("");
  const hidePhotoViewer = () => {
    setPhotoDisplayVisible(false);
  }
  const sendPhotoToModal = (photo, elementID) => {
    setPhotoForViewer(photo)
    setPhotoViewerInputID(elementID);
    setPhotoDisplayVisible(true);
  }

  const [fileNamePromptVisible, setFileNamePromptVisible] = React.useState(false);
  const closeFileNamePrompt = () => {
    setFileNamePromptVisible(false);
  }

  function findNestedObj(entireObj, keyToFind, valToFind) {
    let foundObj;
    JSON.stringify(entireObj, (_, nestedValue) => {
      if (nestedValue && nestedValue[keyToFind] === valToFind) {
        foundObj = nestedValue;
      }
      return nestedValue;
    });
    return foundObj;
  };
  function findAndReplace(object, value, replacevalue) {
    for (var x in object) {
      if (typeof object[x] == typeof {}) {
        findAndReplace(object[x], value, replacevalue);
      }
      if (object[x] == value) {
        object["value"] = replacevalue;
        // break; // uncomment to stop after first replacement
      }
    }
  }

  const handleFormChange = (newData) => {
    //console.log(newData);
    let currentResults = results;
    const servedID = newData.elementID;
    const payload = newData.payload;
    findAndReplace(currentResults, servedID, payload);
    setResults(currentResults);
  }


  const startSaveFile = (filename) => {
    console.log("Saving!");
    setFileNamePromptVisible(true);
  }
  const [photoToBeDeleted, setPhotoToBeDeleted] = React.useState("");
  const startDeletePhoto = (elementId, photo) => {
    setPhotoDisplayVisible(false)
    setDeleteConfirmVisible(true)
    setPhotoToBeDeleted({ "element": elementId, "photo": photo })
  }

  const deletePhoto = (photoToBeDeleted) => {
    let currentResults = results;
    let oldResults = results
    let currentPhotos = (findNestedObj(currentResults, 'id', photoToBeDeleted.element)).value;
    const index = currentPhotos.indexOf(photoToBeDeleted.photo);
    if (index > -1) { // only splice array when item is found
      currentPhotos.splice(index, 1); // 2nd parameter means remove one item only
    }
    findAndReplace(currentResults, photoToBeDeleted.element, currentPhotos);
    setDeleteConfirmVisible(false);
    setTimeout(function () {
      check(currentResults, oldResults)
    }, 500)
  }

  const check = (new2, old) => {


    console.log(new2 == old)

  }

  const [deleteConfirmVisible, setDeleteConfirmVisible] = React.useState(false);
  const closeDeleteConfirm = () => {
    setDeleteConfirmVisible(false);
  }

  const saveFileAsync = async (filename) => {
    const currentData = results
    try {
      const dataToSave = JSON.stringify(currentData);
      await AsyncStorage.setItem("@form_" + filename.replace(/ /g, "_"), dataToSave)
      console.log("saved")
      setFileNamePromptVisible(false);
    } catch (e) {
      alert('Failed to save form' + e)
    }
  }


  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!route.params.props.draftForm) {
        getForm();
      }
    });
    return unsubscribe;
  }, [navigation]);


  const getForm = React.useCallback(() => {
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
          "action": "getFormSchemaByID",
          "formID": formId
        })
      };
      return fetch('https://api-veen-e.ewipro.com/v1/bdm/', data)
        .then((response) => {
          if (!response.ok) throw new Error(response.status);
          else return response.json();
        })
        .then((responseData) => {
          setResults(responseData.result.json)
          setForm(responseData.result.json)
        })
        .catch((error) => {
          alert("Unable to log in - " + error.toString());
        });
    }
  }, [formId])


  const refreshForm = (form) => {
    if (form != null) {
      const header = form.formSections.formHeader;
      const content = form.formSections.formContent;
      const footer = form.formSections.formFooter;
      const HeaderRows = header.rows;
      if (HeaderRows) {
        let HeaderRowObjs = Object.keys(HeaderRows).map(key => (
          <Row key={key} row={HeaderRows[key]} navigation={navigation} handleFormChange={handleFormChange} sendPhotoToModal={sendPhotoToModal} startDeletePhoto={startDeletePhoto} />
        ))
        setHeader(HeaderRowObjs)
      }
      else {
        setHeader(null)
      }

      const ContentRows = content.rows
      if (ContentRows) {
        let ContentRowObjs = Object.keys(ContentRows).map(key => (
          <Row key={key} row={ContentRows[key]} navigation={navigation} handleFormChange={handleFormChange} sendPhotoToModal={sendPhotoToModal} startDeletePhoto={startDeletePhoto} />
        ))
        setContent(ContentRowObjs)
      }
      else {
        setContent(null)
      }

      const FooterRows = footer.rows
      if (FooterRows) {
        let FooterRowObjs = Object.keys(FooterRows).map(key => (
          <Row key={key} row={FooterRows[key]} navigation={navigation} handleFormChange={handleFormChange} sendPhotoToModal={sendPhotoToModal} startDeletePhoto={startDeletePhoto} />
        ))
        setFooter(FooterRowObjs)
      }
      else {
        setFooter(null)
      }
    }
  }

  React.useEffect(() => {
    refreshForm(form);
  }, [form])



  return (
    <ScreenContainer stretch>
      <KeyboardAvoidingView behavior="position" enabled keyboardVerticalOffset={-60}>
        <ScrollView contentContainerStyle={{ paddingBottom: 0 }} style={{ paddingBottom: 0 }}>
          {form != null && <View style={{ margin: 10, paddingBottom: 0 }}>
            <Title style={{ fontSize: 30, fontWeight: "bold" }}>{form.formName}</Title>
          </View>}
          {header}
          {content}
          {footer}
        </ScrollView>
        <FabMenu startSaveFile={startSaveFile} />
        <FileNamePrompt closeFileNamePrompt={closeFileNamePrompt} fileNamePromptVisible={fileNamePromptVisible} saveFileAsync={saveFileAsync} />
        <DeleteConfirm closeDeleteConfirm={closeDeleteConfirm} deleteConfirmVisible={deleteConfirmVisible} deletePhoto={deletePhoto} photoToBeDeleted={photoToBeDeleted} />
        {photoDisplayVisible && <PhotoDisplayer visible={photoDisplayVisible} hidePhotoViewer={hidePhotoViewer} photo={photoForViewer} startDeletePhoto={startDeletePhoto} photoViewerInputID={photoViewerInputID} />}

      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}


