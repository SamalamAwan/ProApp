import React from "react";
import { ActivityIndicator } from 'react-native-paper';
import { AuthContext } from "../context";
import {ScreenContainer} from '../ScreenContainer'


export const Splash = () => {
  return (
    <ScreenContainer>
      <ActivityIndicator  animating={true} size="large"/>
    </ScreenContainer>
)};

    