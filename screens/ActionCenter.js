import React, { useContext } from "react";
import { ScreenContainer } from '../ScreenContainer'
import { Button, Card, Searchbar, Subheading, Text, Title, useTheme } from 'react-native-paper'
import { AuthContext } from "../context";
import { apiKey } from "../context";
import { TouchableOpacity, View } from "react-native";
export const ActionCenter = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { Profile } = useContext(AuthContext)
  const [searchCards, setSearchCards] = React.useState(null)
  const {colors} = useTheme();

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    lookupPostcode(query)
  }

  const lookupPostcode = React.useCallback((query) => {
    console.log(query)
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
          "action": "projectLookup",
          "postCode": query
        })
      };
      return fetch('https://api-veen-e.ewipro.com/v1/bdm/', data)
        .then((response) => {
          if (!response.ok) throw new Error(response.status);
          else return response.json();
        })
        .then((responseData) => {
          handleResults(responseData)
        })
        .catch((error) => {
          alert("Unable to log in - " + error.toString());
        });
    }
  }, [])

  const handleResults = (data) => {
    console.log(data)
    var searchResults = data.results;
    if (searchResults) {
      var searchResultsCards = Object.keys(searchResults).map(key => (
        <Card key={key} onPress={() => { navigation.navigate("Project Details", { props: searchResults[key] }) }}>
          <Card.Content>
            <Title>{searchResults[key].address1}</Title>
            <Subheading>{searchResults[key].postcode}</Subheading>

            <Subheading>Project ID: {searchResults[key].projectID}</Subheading>

          </Card.Content>

        </Card>
      ))
      setSearchCards(searchResultsCards)
    }
    else {
      setSearchCards(null)
    }
  }


  return (
    <ScreenContainer nomargin>
      <View style={{backgroundColor:"white", padding:20, minWidth:"80%", justifyContent:"center", alignItems:"center", minHeight:"80%", flexDirection:"column"}}>
      <Button mode="contained" onPress={() => navigation.navigate("Find Projects")} style={{borderRadius:0, minWidth:"80%", minHeight:90}} labelStyle={{fontSize:50, lineHeight:100}}>
        Find a Project
      </Button>
      <Text style={{margin:20, fontSize:40, color:"#ddd"}}>or</Text>
      <Button mode="contained" onPress={() => navigation.navigate("New Draft")} style={{borderRadius:0, minWidth:"80%", minHeight:90}} labelStyle={{fontSize:50, lineHeight:100}}>
        Create a Draft
      </Button>
      </View>
    </ScreenContainer>
  );
}


