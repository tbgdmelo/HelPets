import React, { useState, useEffect } from 'react'
import {
  View,
  PermissionsAndroid,
  StyleSheet,
  SafeAreaView,
  Image
} from 'react-native'

import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

import { firebase } from '@react-native-firebase/database'


PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
);
export default function Achados({ }) {
  const [minhaLocalizacao, setMinhaLocalizacao] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })


  const [listFire, setListFire] = useState([])

  async function buscarFirebase(){
    const referencia = await firebase.database().ref('/publicacao')
    referencia.on('value', (snapshot)=>{
      const list = []
      snapshot.forEach(childItem => {
        list.push({
          key: childItem.key,
          latitude: childItem.val().latitude,
          longitude: childItem.val().longitude
        })
      });
      setListFire(list)
    });
  }

  useEffect(()=> {
    buscarFirebase()
    
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


  },[])

  return (
    <SafeAreaView style={styles.container}>
        <View style={StyleSheet.absoluteFillObject, styles.container}>
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
            
            {listFire.map((publicacao,i) =>
              //console.log(publicacao.latitude)
              <Marker
                key={i}
                coordinate={{latitude: publicacao.latitude,
                   longitude: publicacao.longitude}}
              >
                <Image source={require('../images/pata.png')} style={{height: 35, width:35 }} />
              </Marker>
            )}

            </MapView>
        </View>
    </SafeAreaView>
 );
}
const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#00b33c",
    padding: 10,
    width:60,
    textAlign: "center",
    fontSize: 30,
    borderRadius: 100,
  },
  botaoAdd:{
    marginLeft: "auto",
    marginTop: "auto",
    paddingEnd: 20,
    paddingBottom: 20
  },
  container: {
    flex: 1,
  }
})