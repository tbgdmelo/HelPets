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
  TouchableOpacity,
  TextInput
} from 'react-native'
import { firebase } from '@react-native-firebase/database'
import ImagePicker from 'react-native-image-picker'
import  storage  from '@react-native-firebase/storage'


export default function Teste ({ route, navigation }) {
  
  const [apelido, setApelido] = useState('');
  const [raca, setRaca] = useState('');
  const [contato, setContato] = useState('');
  const [descricao, setDescricao] = useState('');

  function pushFire(){
    try{
      if(apelido != '' && raca != '' && contato!=''){
        firebase.database().ref('/publicacao').push({
          apelido: apelido,
          raca: raca,
          contato: contato,
          descricao: descricao,
          latitude: route.params.local.latitude,
          longitude: route.params.local.longitude,
          usuario: route.params.user.user.email
        })
        salvarImagemFirebase()
        alert('Publicação salva com sucesso!')
      }
      else{
        alert('Os campos: Nome, raça e telefone são obrigatórios')
      }
    }
    catch (error){
      alert(error)
    }
    finally{
      setApelido('');
      setRaca('');
      setContato('');
      setDescricao('');
      setFoto('')
    }
  }

  const [foto, setFoto] = useState()
  const imagePickerOptions ={
    title: 'Selecione uma foto',
    cancelButtonTitle: 'Cancelar',
    takePhotoButtonTitle: 'Tirar foto da câmera',
    chooseFromLibraryButtonTitle: 'Escolher da galeria',
  }
  function imagePickerCallback (data){
    if(data.didCancel){ //Cancelou a ação
      return;
    }
    if(data.error){ //Algum erro
      return;
    }
    if(!data.uri){
      return;
    }
    setFoto(data)
  }

  function salvarImagemFirebase(){
    const reference = storage().ref('fotos')
    reference.putFile(foto.path)
    console.log(foto.path)
  }

  return (
    
    <View style ={{flex:1, margin:10, justifyContent: 'center', alignItems:'center'}}>
            <Text>
                Descreva as informações sobre o seu pet:
            </Text>

            <TextInput style={styles.textInput} 
              placeholder="Nome do PET"
              onChangeText={apelido => setApelido(apelido)} value={apelido}
            >                
            </TextInput>

            <TextInput style={styles.textInput}
              placeholder="Raça"
              onChangeText={raca => setRaca(raca)} value={raca}
            >
            </TextInput>

            <TextInput style={styles.textInput}
              placeholder="Telefone para Contato"
              keyboardType='numeric'
              onChangeText={contato => setContato(contato)} value={contato}
            >
            </TextInput>

            <TextInput style={styles.descricaoInput}
              placeholder="Descrição (Escreva informações que achar importante sobre seu pet)"
              multiline={true}
              onChangeText={descricao => setDescricao(descricao)} value={descricao}
            >
            </TextInput>
            
            <View style ={{flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", marginTop:20}}>
              <TouchableOpacity style={styles.btnFoto}
                onPress={() => ImagePicker.showImagePicker(imagePickerOptions, imagePickerCallback)}
              >
                <Text style= {{color: 'white'}}>Foto</Text>
              </TouchableOpacity>
              <Image source= {{ uri: foto ? foto.uri :
              'https://image.shutterstock.com/image-vector/cat-dog-pet-love-logo-600w-1303349926.jpg'}}
              style={styles.fotoPet}/>
            </View>
            <TouchableOpacity style={styles.btnSalvar} onPress={salvarImagemFirebase}>
              <Text style= {{color: 'white'}}>Enviar</Text>
            </TouchableOpacity>


            <View style ={{flex:1, flexDirection: 'row', justifyContent: 'space-between', marginTop:20}}>
                <TouchableOpacity style={styles.btnSalvar} onPress={pushFire}>
                  <Text style= {{color: 'white'}}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnCancelar} onPress={() => navigation.navigate("Home")}>
                  <Text style= {{color: 'white'}}>Cancelar</Text>
                </TouchableOpacity>
            </View>
      <Image
        style={styles.nome}
        source={require('../images/nome.png')}  
      />
    </View>
 );
}

const styles = StyleSheet.create({
    button: {
      alignItems: "center",
      backgroundColor: "#00b33c",
      padding: 20,
      width:90,
      borderColor: 'black',
      borderWidth: 1
    },
    textInput:{
      width:300,
      height:50,
      borderRadius:10,
      textAlign: "center",
      marginTop:20,
      borderColor: 'black',
      borderWidth: 1,
      backgroundColor: 'white'
    },
    descricaoInput:{
      textAlign: "center",
      width:300,
      height:100,
      borderRadius:10,
      marginTop:20,
      borderColor: 'black',
      borderWidth: 1,
      backgroundColor: 'white'
    },
    btnSalvar:{
      margin:20,
      borderWidth:1,
      borderColor: '#00b33c',
      width: 150,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:'#00b33c',
      borderRadius:10
    },
    btnCancelar:{
      margin:20,
      borderWidth:1,
      borderColor: '#ff3333',
      width: 150,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:'#ff3333',
      borderRadius:10
    },
    btnFoto:{
      margin:20,
      borderWidth:1,
      borderColor: '#1a75ff',
      width: 150,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1a75ff',
      borderRadius:10
    },
    logoFundo:{
      flex: 1,
      justifyContent: "center",
      width: 250,
      height: 300
    },
    nome:{
      margin:30,
      height:60,
      width:310
    },
    fotoPet:{
      width:150,
      height:150,
      borderRadius:10
    }
  });