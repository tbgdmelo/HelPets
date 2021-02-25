import React, { useState, useEffect } from 'react'
import {
  View,
  PermissionsAndroid,
  StyleSheet,
  SafeAreaView,
  Image,
  Text,
  ListViewBase,
  TouchableOpacity,
  Modal,
  Alert,
  TouchableHighlight
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
import { ScrollView, TextInput } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


PermissionsAndroid.request(
  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
);

export default function Achados({ navigation }) {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)

  const request_location_runtime_permission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permissão de Localização',
          message: 'A aplicação precisa da permissão de localização.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          pos => {
            setMinhaLocalizacao({
              ...minhaLocalizacao,
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
          },
          error => {
            console.log(error);
            Alert.alert('Houve um erro ao pegar a latitude e longitude.');
          },
        );
      } else {
        Alert.alert('Permissão de localização não concedida');
      }
    } catch (err) {
      console.log(err);
    }
  };

  function configureGoogleSign() {
      GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive.photos.readonly','https://www.googleapis.com/auth/drive.readonly'],
        webClientId: WEB_CLIENT_ID,
        offlineAccess: false
      })
  }

  const tipos = [
    {tipo:'Gato', icon: <Icon name="cat" size={20} color="#008037" />},
    {tipo:'Cachorro', icon: <Icon name="dog" size={20} color="#008037" />},
    {tipo:'Todos', icon: <Icon name="collapse-all" size={20} color="#008037"/>}
  ]

  const [filtroRaca, setFiltroRaca] = useState('')

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

  const [filtro, setFiltro] = useState('Todos');

  const [listFire, setListFire] = useState([])

  async function buscarFirebase(){
    const referencia = await firebase.database().ref('/publicacao')
    referencia.on('value', (snapshot)=>{
      const list = []
      snapshot.forEach(childItem => {
        if(filtro==='Todos' && childItem.val().ativo === true){
          list.push({
            key: childItem.key,
            latitude: childItem.val().latitude,
            longitude: childItem.val().longitude,
            raca: childItem.val().raca,
            foto: childItem.val().urlFoto,
            apelido: childItem.val().apelido,
            contato: childItem.val().contato,
            descricao: childItem.val().descricao,
            tipo: childItem.val().tipo,
            statusPet: childItem.val().statusPet,
          })
        }
        else{
          if(filtro === childItem.val().tipo && childItem.val().ativo === true){
            list.push({
              key: childItem.key,
              latitude: childItem.val().latitude,
              longitude: childItem.val().longitude,
              raca: childItem.val().raca,
              foto: childItem.val().urlFoto,
              apelido: childItem.val().apelido,
              contato: childItem.val().contato,
              descricao: childItem.val().descricao,
              tipo: childItem.val().tipo,
              statusPet: childItem.val().statusPet,
            })
          }
        }
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


  },[filtro])

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
              <Image source={require('../images/pata_azul1.png')} style={{height: 35, width:35 }} />
            </Marker>

            {listFire.map((publicacao,i) =>
              
              <Marker
                key={i}
                coordinate={{latitude: publicacao.latitude,
                   longitude: publicacao.longitude}}
              >
                {publicacao.statusPet==='Perdido' ? (
                  <Image source={require('../images/pata_vermelha1.png')} style={{height: 35, width:35 }} />
                ):
                (
                  <Image source={require('../images/pata.png')} style={{height: 35, width:35 }} />
                )
                }
                
                <Callout tooltip
                onPress={() => navigation.navigate('InfoPublicacao',{ publicacao: publicacao })}>
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

            <View style={styles.caixaBusca}>
              <TextInput placeholder="Utilize os filtros abaixo" placeholderTextColor="#000" autoCapitalize='none'
              style={{flex:1, padding:0}}
              editable={false}
              onChangeText={filtroRaca => setFiltroRaca(filtroRaca)} value={filtroRaca}
              />

              <View>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                  }}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    {userInfo == null ? (
                        <Text style={styles.modalText}>Bem-Vindo!</Text>
                    ) : ( <Text style={styles.modalText}>Bem-Vindo {userInfo.user.givenName}!</Text>)
                    }
                      <View style={styles.alinharClosebutton}>
                        {userInfo == null ? (
                              <Image source={require('../images/perfil.png')} style={styles.perfilG}/>
                          ) : ( <Image source= {{ uri: userInfo.user.photo}} style={styles.perfilG}/>)
                        }
                      </View>
                      {/* 
                      <View>
                        <TouchableOpacity
                          style={{ ...styles.itemButton, backgroundColor: "#008037" }}
                          onPress={() => {
                            navigation.navigate('Perfil', {user: userInfo}), setModalVisible(!modalVisible)
                          }}
                        >
                          <Text style={styles.textStyle}><Icon name="account" size={20} color="#fff" />  Meu Perfil</Text>
                        </TouchableOpacity>
                      </View>
                      */}
                      
                      <View>
                        <TouchableOpacity
                          style={{ ...styles.itemButton, backgroundColor: "#008037" }}
                          onPress={() => {isLoggedIn === false ? (
                            navigation.navigate('Login2', setModalVisible(!modalVisible))
                        ) : ( navigation.navigate('Postados', {userInfo}), setModalVisible(!modalVisible)
                        )}}
                        >
                          <Text style={styles.textStyle}><Icon name="post" size={20} color="#fff" />  Minhas Publicações</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.alinharClosebutton}>
                        <TouchableHighlight
                          style={{ ...styles.closeButton, backgroundColor: "#cc0000" }}
                          onPress={() => {
                            setModalVisible(!modalVisible);
                          }}
                        >
                          <Text style={styles.textStyle}>  Fechar  </Text>
                        </TouchableHighlight>
                      </View>
                      
                    </View>
                  </View>
                </Modal>

                <TouchableOpacity
                  style={styles.openButton}
                  onPress={() => {
                    setModalVisible(true);
                  }}
                >
                  {userInfo == null ? (
                        <Image source={require('../images/perfil.png')} style={styles.perfil}/>
                    ) : ( <Image source= {{ uri: userInfo.user.photo}} style={styles.perfil}/>)
                  }
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
            height={50}
            style={styles.tiposBusca}
            >
              {tipos.map((tipo, index)=>(
                <TouchableOpacity key={index} style={styles.botaoTipo}
                  onPress={() => setFiltro(tipo.tipo)}
                >
                  {tipo.icon}
                  <Text> {tipo.tipo}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView> 

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

            <View style={styles.legendas}>
              <Text> Local Marcado: <Image source={require('../images/pata_azul1.png')} style={{height: 15, width:15 }} /></Text>
              <Text> Encontrados: <Image source={require('../images/pata.png')} style={{height: 15, width:15 }} /></Text> 
              <Text> Perdidos: <Image source={require('../images/pata_vermelha1.png')} style={{height: 15, width:15 }} /></Text>
            </View>

            <TouchableOpacity
              style={styles.locationButton}
              onPress={() => {request_location_runtime_permission()
              }}>
              <Icon name="crosshairs-gps" color={'#fff'} size={30} />
            </TouchableOpacity>   

        </View>
    </SafeAreaView>
 );
}
const styles = StyleSheet.create({
  legendas:{
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: -25,
    width: '35%',
    height: '10%',
    alignSelf: 'center',
    shadowColor: '#000',
    elevation: 10,
    marginLeft: '-55%',
    alignItems: "center",
    justifyContent: 'center',
  },
  button: {
    alignItems: "center",
    backgroundColor: "#008037",
    padding: 10,
    width:60,
    height: 60,
    textAlign: "center",
    fontSize: 30,
    borderRadius: 100,
    color: "#fff"
  },
  locationButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 150,
    marginTop: -25,
    width: 60,
    height: 60,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    elevation: 8,
    marginBottom: 15
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
    borderTopColor: '#008037',
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
  },
  caixaBusca:{
    position: 'absolute',
    marginTop: 15,
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset:{width:0, height:3},
    shadowOpacity: 0.5,
    shadowRadius:5,
    elevation:10
  },
  tiposBusca:{
    position:'absolute',
    top: 70,
    paddingHorizontal: 10
  },
  botaoTipo:{
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius:20,
    padding:8,
    paddingHorizontal: 25,
    marginHorizontal: 3,
    height:35,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width:350,
    height:500
  },
  perfil:{
    width: 30,
    height: 30,
    borderRadius: 100
  },
  openButton: {
    borderRadius: 100,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  closeButton:{
    borderRadius: 100,
    padding: 10,
    elevation: 2,
    marginTop: 150,
  },
  itemButton:{
    borderRadius: 100,
    padding: 10,
    elevation: 2,
    marginBottom: 15,
    borderColor: 'black'
  },
  alinharClosebutton:{  
    alignItems: "center",
  },
  perfilG:{
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 15
  },
})