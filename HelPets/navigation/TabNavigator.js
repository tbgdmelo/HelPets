import React from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import Home from '../screens/Home'
import Postados from '../screens/Postados'
import { useLinkProps } from "@react-navigation/native"
import { roundToNearestPixel } from "react-native/Libraries/Utilities/PixelRatio"

const Tab = createBottomTabNavigator()

const BottomTabNavigator = (props) => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} initialParams={props.route.params}/>
      <Tab.Screen name="Meus Posts" component={Postados} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator