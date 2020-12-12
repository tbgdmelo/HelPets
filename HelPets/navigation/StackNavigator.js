import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./TabNavigator"

import Homepage from '../screens/Home'
import TelaLogin from '../screens/Login'
import Publicacao from '../screens/Publicacao'
import Achados from '../screens/Achados'

const Stack = createStackNavigator()

const MainStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login" >

      <Stack.Screen name="Login" component={TelaLogin} options={{
          title: null,
        }}/>

      <Stack.Screen name="Home" component={BottomTabNavigator} 
      options={{
        title: 'Mapa',
        headerLeft: null
      }}
      />

      <Stack.Screen name="Achados" component={Achados} 
        options={{
          title: 'Pets Encontrados',
        }}
      />
        
      <Stack.Screen name="Publicacao" component={Publicacao} />

    </Stack.Navigator>
  );
}


export { MainStackNavigator, };