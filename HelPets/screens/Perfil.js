import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'

export default function Perfil ({route}) {

  return (
    <View style ={{flex:1, flexDirection:'column'}}>
            <Text>
                Perfil {console.log(route.params.user.user.email)}
            </Text>
            <Text>
              Email: {route.params.user.user.email}
            </Text>
    </View>
 );
}