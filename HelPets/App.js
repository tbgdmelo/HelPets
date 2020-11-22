import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Homepage from './screens/Home'
import TelaLogin from './screens/Login'
import Publicacao from './screens/Publicacao'

const Stack = createStackNavigator();

export default function App(){
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HelPets" >
        <Stack.Screen name="HelPets"
        component={ TelaLogin }
        options={{
          title: null,
        }}
        />
        <Stack.Screen name="Home"
         component={ Homepage }
         options={{
          title: 'Mapa',
          headerLeft: null
        }}
        />
        <Stack.Screen name="Publicacao"
         component={ Publicacao }
         options={{
          title: 'Publicação'
        }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
