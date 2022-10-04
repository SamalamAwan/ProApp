/* eslint-disable react/prop-types */
import React from "react";
import { View } from "react-native";
import { useTheme } from 'react-native-paper';


export const ScreenContainer = ({ children, nomargin, flexstart, stretch, spacebetween }) => {
    const {container, containerNoTopMargin,containerHalfTopMargin, containerFlexStart, containerStretch, containerSpaceBetween} = useTheme();
    return (
    <View style={nomargin ? containerNoTopMargin : flexstart ? containerFlexStart : stretch ? containerStretch : spacebetween ? containerSpaceBetween : container}>{children}</View>
    )
    
};