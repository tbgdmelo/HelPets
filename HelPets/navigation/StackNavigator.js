import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./TabNavigator"

import Homepage from '../screens/Home'
import TelaLogin from '../screens/Login'
import Publicacao from '../screens/Publicacao'
import Achados from '../screens/Achados'
import InfoPublicacao from '../screens/InfoPublicacao'

const Stack = createStackNavigator()

const MainStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Achados" >

      <Stack.Screen name="Login" component={TelaLogin} options={{
          title: null,
          headerLeft: null
        }}/>

      <Stack.Screen name="Home" component={BottomTabNavigator} 
      options={{
        title: 'Mapa',
        headerLeft: null
      }}
      />

      <Stack.Screen name="Achados" component={Achados} 
        options={{
          title: 'Mapa HelPets',
        }}
      />
        
      <Stack.Screen name="Publicacao" component={Publicacao} 
      options={{
        headerLeft: null
      }}/>

      <Stack.Screen name="InfoPublicacao" component={InfoPublicacao}
        options={{
          title: 'Informações'
        }}
      />

    </Stack.Navigator>
  );
}


export { MainStackNavigator, };