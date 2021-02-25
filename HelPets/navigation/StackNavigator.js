import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./TabNavigator"

import Perfil from '../screens/Perfil'
import TelaLogin from '../screens/Login'
import Publicacao from '../screens/Publicacao'
import Achados from '../screens/Achados'
import InfoPublicacao from '../screens/InfoPublicacao'
import Modal from '../screens/Modal'
import Postados from '../screens/Postados'
import Imagem from '../screens/Image'
import EditPub from '../screens/EditPub'
import TelaLogin2 from '../screens/Login2'



const Stack = createStackNavigator()

const MainStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Achados" >

      <Stack.Screen name="Imagem" component={Imagem} options={{
          title: null
        }}/>

      <Stack.Screen name="Postados" component={Postados} options={{
          title: null
        }}/>

      <Stack.Screen name="EditPub" component={EditPub} options={{
          title: 'Editar Publicação'
        }}/>

      <Stack.Screen name="Login" component={TelaLogin} options={{
          title: null
        }}/>

      <Stack.Screen name="Login2" component={TelaLogin2} options={{
          title: null
        }}/>

      <Stack.Screen name="Achados" component={Achados} 
        options={{
          title: 'HelPets',
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

      <Stack.Screen name="Perfil" component={Perfil}
        options={{
          title: 'Meu Perfil'
        }}
      />

    </Stack.Navigator>
  );
}


export { MainStackNavigator, };