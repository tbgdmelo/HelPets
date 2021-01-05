import React, { useState, useEffect } from 'react'
import {
  View,
  PermissionsAndroid,
  StyleSheet,
  SafeAreaView,
  Image,
  Text,
  ListViewBase,
  TouchableOpacity
} from 'react-native'

import MapView, {Callout, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';

import { firebase } from '@react-native-firebase/database'

import  storage  from '@react-native-firebase/storage'

import {
  GoogleSignin,
  statusCodes
} from '@react-native-community/google-signin'

import { WEB_CLIENT_ID } from '../utils/keys'


PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
);


export default function Achados({ navigation }) {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState(null)

  function configureGoogleSign() {
      GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID,
        offlineAccess: false
      })
  }

  async function getCurrentUserInfo() {
    try {
      const userInfo = await GoogleSignin.signInSilently()
      setUserInfo(userInfo)
      setIsLoggedIn(true)
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // when user hasn't signed in yet
        //Alert.alert('Please Sign in')
        setIsLoggedIn(false)
      } else {
        //Alert.alert('Something else went wrong... ', error.toString())
        setIsLoggedIn(false)
      }
    }
  }

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
          longitude: childItem.val().longitude,
          raca: childItem.val().raca,
          foto: childItem.val().urlFoto
        })
      });
      setListFire(list)
    });

  }

  const [foto, setFoto] = useState('')

  async function buscarFoto(filename){
    const storageRef = await storage().ref('fotos/')
    const fileRef = await storageRef.child(filename)
    console.log('filename passado:' +filename)
    try{
      const fileUrl = await fileRef.getDownloadURL()
      await setFoto(fileUrl)
      console.log('url que achei:'+fileUrl)
    }
    catch(error){
      console.log('imagem não existe para: '+filename)
      await setFoto('')
    }
  }
  useEffect(()=> {
    getCurrentUserInfo()
    configureGoogleSign ()
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
            <Marker
                coordinate={minhaLocalizacao}
                title='Você está aqui'
                description='Marque um local'

            >
              <Image source={require('../images/pata.png')} style={{height: 35, width:35 }} />
            </Marker>


            {listFire.map((publicacao,i) =>
              //console.log(publicacao.latitude)
              <Marker
                key={i}
                coordinate={{latitude: publicacao.latitude,
                   longitude: publicacao.longitude}}
              >
                <Image source={require('../images/pata.png')} style={{height: 35, width:35 }} />
                
                <Callout tooltip>
                  <View>
                    
                    <View style={styles.bubble}>
                      <Text style={styles.name}>{publicacao.raca}</Text>
                      <Text style={styles.image}>
                        <Image style={styles.fotoPet}
                          source= {{ uri: publicacao.foto ? publicacao.foto :
                            'https://image.shutterstock.com/image-vector/cat-dog-pet-love-logo-600w-1303349926.jpg'}}            
                          resizeMode="contain"
                        />
                      </Text>
                    </View>
                    
                    <View style={styles.arrowBorder}/>
                    <View style={styles.arrow}/>
                    
                    <View/>
                  </View>
                </Callout>

              </Marker>
            )}
            </MapView>
            
            <TouchableOpacity
            style={styles.botaoAdd}
            onPress={() => {isLoggedIn === false ? (
              navigation.navigate('Login',{local: minhaLocalizacao})
          ) : ( navigation.navigate('Publicacao', { local: minhaLocalizacao, user: userInfo })
          )}}
            >
              <Text style={styles.button}>
                +
              </Text>
            </TouchableOpacity>
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
    paddingBottom: 20,
  },
  container: {
    flex: 1,
  },
  bubble:{
    flexDirection: 'column',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 0.5,
    padding:10,
    width:150,
    height:120,
    paddingBottom: -100
  },
  name:{
    fontSize:12,
    textAlign: 'center'
  },
  arrowBorder:{
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#00b33c',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -0.5
  },
  arrow:{
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#fff',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -32
  },
  fotoPet:{
    width: 125,
    height: 60,
    flex:1
  },
  image:{
    flex:1,
  }
})