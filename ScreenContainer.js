/* eslint-disable react/prop-types */
import React from "react";
import { View } from "react-native";
import { useTheme } from 'react-native-paper';


export const ScreenContainer = ({ children, nomargin }) => {
    const {container, containerNoTopMargin,containerHalfTopMargin, containerFlexStart, containerStretch} = useTheme();
    return (
    <View style={nomargin ? containerNoTopMargin : container}>{children}</View>
    )
    
};