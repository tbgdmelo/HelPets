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

import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

export default function Home({route,navigation}) {
  const [minhaLocalizacao, setMinhaLocalizacao] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })

  useEffect(() => {
    Geolocation.getCurrentPosition(
        (position) => {
          setMinhaLocalizacao({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0022,
            longitudeDelta: 0.0021,
          })
          //console.log('minha localização => ', minhaLocalizacao);
        },
        (error) => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, [])
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <MapView
        region={minhaLocalizacao}
        style={StyleSheet.absoluteFillObject} 
        showsUserLocation={true}
        showsMyLocationButton={true}
        moveOnMarkerPress={true}
        onPress={e =>
          setMinhaLocalizacao({
            ...minhaLocalizacao,
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
          })
        }
      >
        <Marker
            coordinate={minhaLocalizacao}
          />
        </MapView>
        <TouchableOpacity
        style={styles.caixa}
        onPress={() => navigation.navigate("Publicacao", {local: minhaLocalizacao, user: route.params.userInfo} )}
        >
          <Text style={styles.button}>
            +
          </Text>
        </TouchableOpacity>
    </View>
 );
}
const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#00b33c",
    padding: 10,
    width:70,
    textAlign: "center",
    fontSize: 30,
    borderRadius: 100
  },
  caixa:{
      left:300,
      top: 650,
  }
})