import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  Button,
  Alert,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native'

export default function Teste ({ route }) {
  return (
    <View style ={{flex:1, flexDirection:'column'}}>
            <Text>
                Latitude: {route.params.local.latitude}
            </Text>
            <Text>
                Longitude: {route.params.local.longitude}
            </Text>
            <Text>
                Usuario: {route.params.user.user.email}
            </Text>
    </View>
 );
}

const styles = StyleSheet.create({
    button: {
      alignItems: "center",
      backgroundColor: "#00b33c",
      padding: 20,
      width:90,
      borderColor: 'black',
      borderWidth: 1,
    },
    caixa:{
        left:300,
        top: 650,
    }
  });