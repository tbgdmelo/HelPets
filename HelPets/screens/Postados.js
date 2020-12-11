import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'

export default function Teste ({  }) {
  return (
    <View style ={{flex:1, flexDirection:'column'}}>
            <Text>
                postados
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