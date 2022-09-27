import React from "react";
import { ScreenContainer } from '../ScreenContainer'
import { Card, Text } from 'react-native-paper'
import { View } from "react-native";

export const HomeScreen = ({ navigation }) => {
  return (
    <ScreenContainer>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch' }}>
      <Text>HOME WELCOME2!</Text>
      <Card mode={"contained"} onPress={() => navigation.navigate('Forms')}>
    <Card.Title title="Go To Forms" />
  </Card>
  </View>
    </ScreenContainer>
  );
}


