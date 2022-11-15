/* eslint-disable react/prop-types */
import React from "react";
import { View } from "react-native";
import { useTheme } from 'react-native-paper';


export const ScreenContainer = ({ children, nomargin, flexstart, stretch, spacebetween, fullHeight }) => {
    const {container, containerNoTopMargin,containerHalfTopMargin, containerFlexStart, containerStretch, containerSpaceBetween,containerFullHeight} = useTheme();
    return (
    <View style={nomargin ? containerNoTopMargin : flexstart ? containerFlexStart : stretch ? containerStretch : fullHeight ? containerFullHeight : spacebetween ? containerSpaceBetween : container}>{children}</View>
    )
    
};