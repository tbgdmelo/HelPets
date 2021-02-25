import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native'
import { firebase } from '@react-native-firebase/database'
import  storage  from '@react-native-firebase/storage'
import {Picker} from '@react-native-picker/picker'
import TextInputMask from 'react-native-text-input-mask'

import * as ImagePicker from 'react-native-image-picker'

import Skeleton from '../skeleton'

export default function Publicacao ({ route, navigation }) {
  const [response, setResponse] = React.useState(null)


  const [apelido, setApelido] = useState('')
  const [raca, setRaca] = useState('Não sei informar')
  const [contato, setContato] = useState('')
  const [descricao, setDescricao] = useState('')
  const [urlFoto, setUrlFoto] = useState('')
  const [tipo, setTipo] = useState('Cachorro')
  const [statusPet, setStatusPet] = useState('Encontrado')

  async function pushFire(){
    try{
      if(raca != '' && contato!=''){
        const link = await uploadImage()
        console.log('url pra salvar: '+link) 
        const pub = firebase.database().ref('/publicacao').push({
          apelido: apelido,
          raca: raca,
          contato: contato,
          descricao: descricao,
          latitude: route.params.local.latitude,
          longitude: route.params.local.longitude,
          usuario: route.params.user.user.email,
          urlFoto: link,
          tipo: tipo,
          statusPet: statusPet,
          ativo: true
        })
        setLoading(false)
        alert('Publicação salva com sucesso!')
      }
      else{
        alert('Os campos: Raça e telefone são obrigatórios')
      }
    }
    catch (error){
      alert('Ocorreu um erro ao salvar')
    }
    finally{
      setApelido('');
      setRaca('Não sei informar');
      setContato('');
      setDescricao('');
      setFoto('')
      setUrlFoto('')
      setStatusPet('Encontrado')
    }
  }

  const [foto, setFoto] = useState()

  const testando = async()=>{
    console.log(foto.uri)
    const filename = await foto.uri.substring(foto.uri.lastIndexOf('/')+1,)
    console.log('filename: '+filename)
  }

  const uploadImage = async () => {
    if(typeof foto === 'undefined'){
      console.log('retornando...')
      return;
    }
    else{
      console.log('tem foto...')
      
      setLoading(true)

      const { uri } = foto
      //const filename = uri.substring(uri.lastIndexOf('/') + 1)
      //const filenameI = pub.toString()
      //console.log(filename)
      const filename = foto.uri.substring(foto.uri.lastIndexOf('/')+1,)
      //console.log(filename)
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
      
      const task = storage()
        .ref('fotos/'+filename)
        .putFile(uploadUri);
        
      task.on('state_changed', snapshot => {
      });
      try {
        await task;
      } catch (e) {
        console.error(e);
      }
      console.log('recuperando url da foto...')
      //RECUPERAR URL DE DOWNLOAD DA IMG
      const filesRef = await storage().ref('fotos/')
      const imgURL = await filesRef.child(filename)
      const fileUrl = await imgURL.getDownloadURL()
      setUrlFoto(fileUrl)
      console.log('url feita: '+fileUrl)
      return fileUrl
      console.log('url foto: '+ urlFoto)
      //console.log('url eh: '+fileUrl)
      /*
      alert(
        'Photo uploaded!',
        'Your photo has been uploaded to Firebase Cloud Storage!'
      );
      console.log('enviou');*/
    } 
    setFoto(null)
  };

  const [selectedValue, setSelectedValue] = useState("");

  const tipos=['Cachorro','Gato']

  const cats=['Não sei informar','Angorá', 'British Shorthair', 'Burmese', 'Himalaia', 'Maine Coon','Persa', 'Ragdoll'
  , 'Siamês', 'Siberiano', 'Sphynx', 'Vira Lata', 'Outro']

  const dogs=['Não sei informar', 'Basset',  'Beagle', 'Boder Collie', 'Buldogue', 'Dachshund', 
  'Golden Retriever', 'Husky Siberiano', 'Labrador', 'Lhasa Apso', 'Maltês', 'Pastor-Alemão', 
  'Pinscher', 'Pit Bull', 'Poodle','Pug', 'Rottweiller', 'Schnauzer', 'Shih Tzu', 'Spitz Alemão',
   'Vira Lata', 'Yorkshire','Outro']

  const status_pet =['Encontrado', 'Perdido']

  const [loading, setLoading] = useState(false);

  return (        
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <View style={styles.container}>
        <Skeleton visible={loading}>
              <Text>
                  Descreva as informações sobre o pet:
              </Text>

              <Text style={{marginTop:10}}>O pet foi :<Text style={{color:'red'}}>*</Text></Text>
              
              <View style={styles.viewPicker}>
                    <Picker
                    prompt='Status do Pet'
                    selectedValue={statusPet}
                    style={styles.dropdown}
                    onValueChange={(itemValue, itemIndex) => setStatusPet(itemValue)}
                  >
                    
                    {status_pet.map((status, i) =>
                      <Picker.Item label={status} value={status} key={i} color='black'/>
                    )}
                  </Picker>
              </View>

              <Text style={{marginTop:10}}>Nome do Pet (Opcional)</Text>

              <TextInput style={styles.textInput} 
                placeholder="Nome do PET (Deixe em branco caso encontrado)"
                onChangeText={apelido => setApelido(apelido)} value={apelido}
              >                
              </TextInput>

              <Text style={{marginTop:10}}>Tipo <Text style={{color:'red'}}>*</Text></Text>
              
              <View style={styles.viewPicker}>
                <Picker
                  prompt='Tipo'
                  selectedValue={tipo}
                  style={styles.dropdown}
                  onValueChange={(itemValue, itemIndex) => setTipo(itemValue)}
                >
                  {tipos.map((nome, i) =>
                    <Picker.Item label={nome} value={nome} key={i} color='black'/>
                  )}
                </Picker>
              </View>

              <Text style={{marginTop:10}}>Raça <Text style={{color:'red'}}>*</Text></Text>
              
              <View style={styles.viewPicker}>
                {tipo === 'Cachorro' ? (
                    <Picker
                    prompt='Raça do Cachorro'
                    selectedValue={raca}
                    style={styles.dropdown}
                    onValueChange={(itemValue, itemIndex) => setRaca(itemValue)}
                  >
                    
                    {dogs.map((nome, i) =>
                      <Picker.Item label={nome} value={nome} key={i} color='black'/>
                    )}
                  </Picker>

                ) : (
                  <Picker
                    prompt='Raça do Gato'
                    selectedValue={raca}
                    style={styles.dropdown}
                    onValueChange={(itemValue, itemIndex) => setRaca(itemValue)}
                  >
                    
                    {cats.map((nome, i) =>
                      <Picker.Item label={nome} value={nome} key={i} color='black'/>
                    )}
                  </Picker>
                )
                }
              </View>

              <Text style={{marginTop:10}}>Contato <Text style={{color:'red'}}>*</Text></Text>
              <TextInputMask style={styles.textInput}
                mask={"([00]) [00000]-[0000]"}
                placeholder="Telefone para Contato"
                keyboardType='numeric'
                onChangeText={contato => setContato(contato)} value={contato}
              >
              </TextInputMask>
              
              <Text style={{marginTop:10}}>Descrição (Opcional)</Text>
              <TextInput style={styles.descricaoInput}
                placeholder="Descrição (Escreva informações que achar importante sobre o pet)"
                multiline={true}
                onChangeText={descricao => setDescricao(descricao)} value={descricao}
              >
              </TextInput>
              
              <View style ={{flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", marginTop:20}}>
                <View>
                  <TouchableOpacity style={styles.btnFoto}
                    onPress={() =>
                      ImagePicker.launchCamera(
                        {
                          mediaType: 'photo',
                          includeBase64: false,
                          maxHeight: 1000,
                          maxWidth: 1000,
                        },
                        (foto) => {
                          setFoto(foto);
                        },
                      )
                    }
                  >
                    <Text style= {{color: 'white'}}>Foto da Câmera</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.btnFoto}
                   onPress={() =>
                    ImagePicker.launchImageLibrary(
                      {
                        mediaType: 'photo',
                        includeBase64: false,
                        maxHeight: 1000,
                        maxWidth: 1000,
                      },
                      (foto) => {
                        setFoto(foto);
                      },
                    )
                  }
                  >
                    <Text style= {{color: 'white'}}>Foto da Galeria</Text>
                  </TouchableOpacity>
                </View>
                <Image source= {{ uri: foto ? foto.uri :
                'https://image.shutterstock.com/image-vector/cat-dog-pet-love-logo-600w-1303349926.jpg'}}
                style={styles.fotoPet}/>
              </View>
              
              <View style ={{flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", marginTop:20}}>
                  <TouchableOpacity style={styles.btnSalvar} onPress={pushFire}>
                    <Text style= {{color: 'white'}}>Salvar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnCancelar} onPress={() => navigation.navigate("Achados")}>
                    <Text style= {{color: 'white'}}>Voltar</Text>
                  </TouchableOpacity>
              </View>
        <Image
          style={styles.nome}
          source={require('../images/nome.png')}  
        />

        </Skeleton>
      </View>
      </ScrollView>
    </SafeAreaView>
 );
}

const styles = StyleSheet.create({
    textInput:{
      width:300,
      height:50,
      borderRadius:10,
      textAlign: "center",
      marginTop:10,
      borderColor: 'black',
      borderWidth: 1,
      backgroundColor: 'white'
    },
    descricaoInput:{
      textAlign: "center",
      width:300,
      height:100,
      borderRadius:10,
      marginTop:10,
      borderColor: 'black',
      borderWidth: 1,
      backgroundColor: 'white'
    },
    btnSalvar:{
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
      margin:10,
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
      margin:10,
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
    },
    container:{
      flex:1,
      alignItems: "center"
    },
    dropdown:{
      borderColor: 'black',
      borderWidth: 1,
      height: 50,
      width: 300,
      borderRadius:10,
      textAlign: "center",
      color:'black',
    },
    viewPicker:{
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 1,
      marginTop: 5,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:'white',
      borderRadius:10
    }
  });