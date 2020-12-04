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
import ImagePicker from 'react-native-image-picker'
import  storage  from '@react-native-firebase/storage'
import {Picker} from '@react-native-picker/picker'
import TextInputMask from 'react-native-text-input-mask'

export default function Teste ({ route, navigation }) {
  
  const [apelido, setApelido] = useState('');
  const [raca, setRaca] = useState('');
  const [contato, setContato] = useState('');
  const [descricao, setDescricao] = useState('');

  function pushFire(){
    try{
      if(apelido != '' && raca != '' && contato!=''){
        const pub = firebase.database().ref('/publicacao').push({
          apelido: apelido,
          raca: raca,
          contato: contato,
          descricao: descricao,
          latitude: route.params.local.latitude,
          longitude: route.params.local.longitude,
          usuario: route.params.user.user.email
        })
        //verifica se há foto pra enviar
        if(!foto.uri){
          alert('Publicação salva com sucesso!')
          return;
        }
        else{
          uploadImage(pub)
          alert('Publicação salva com sucesso!')
        }        
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
    title: 'Envie uma foto',
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
    const source = { uri: data.uri };
    //console.log(source);
    setFoto(source)
  }

  const uploadImage = async (pub) => {
    const { uri } = foto
    //const filename = uri.substring(uri.lastIndexOf('/') + 1)
    const filenameI = pub.toString()
    console.log(filename)
    const filename = filenameI.substring(filenameI.lastIndexOf('/')+1,)
    console.log(filename)
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
    /*
    alert(
      'Photo uploaded!',
      'Your photo has been uploaded to Firebase Cloud Storage!'
    );
    console.log('enviou');*/
    setFoto(null)
  };

  const [selectedValue, setSelectedValue] = useState("");

  const racas=['Abissínio','Akita','Angorá','Ashera','Balinês','Basset Hound','Beagle','Bengal',
  'Bichon Frisé','Bobtail Americano','Bobtail Japonês','Boiadeiro Australiano','Bombay',
  'Border Collie','Boston Terrier','Boxer','Buldogue Francês','Buldogue Inglês','Bull Terrier ',
  'Burmês Vermelho','Burmês','Cane Corso','Cavalier King Charles Spaniel','Chartreux','Chihuahua',
  'Chow Chow','Cocker Spaniel Inglês','Colorpoint de Pêlo Curto','Cornish Rex','Curl Americano',
  'Cymric','Dachshund','Dálmata','Devon Rex','Doberman','Dogo Argentino','Dogue Alemão',
  'Fila Brasileiro','Golden Retriever','Himalaio','Husky Siberiano','Jack Russell Terrier',
  'Jaguatirica','Javanês','Korat','Labrador Retriever','LaPerm','Lhasa Apso','Lulu da Pomerânia',
  'Maine Coon','Maltês','Manx','Mastiff Inglês','Mastim Tibetano','Mau Egípcio','Mist Australiano',
  'Munchkin','Norueguês da Floresta','Ocicat','Pastor Alemão','Pastor Australiano',
  'Pastor de Shetland','Pequinês','Persa','Pinscher','Pit Bull ','Pixie-bob','Poodle','Pug',
  'Ragdoll','Rottweiler','Russo Azul','Sagrado da Birmânia','Savannah','Schnauzer','Scottish Fold',
  'Selkirk Rex','Shar-pei','Shiba','Shih Tzu','Siamês','Siberiano','Singapura','Somali','Sphynx',
  'Staffordshire Bull Terrier','Thai','Tonquinês','Toyger','Usuri','Vira-Lata','Weimaraner',
  'Yorkshire','Outro (não sei informar)']



  return (        
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <View style={styles.container}>
              <Text>
                  Descreva as informações sobre o seu pet:
              </Text>

              <TextInput style={styles.textInput} 
                placeholder="Nome do PET"
                onChangeText={apelido => setApelido(apelido)} value={apelido}
              >                
              </TextInput>

              <Text style={{marginTop:10}}>Raça:</Text>
              
              <View style={styles.viewPicker}>
                <Picker
                  prompt='Raça do Pet'
                  selectedValue={raca}
                  style={styles.dropdown}
                  onValueChange={(itemValue, itemIndex) => setRaca(itemValue)}
                >
                  <Picker.Item label='Selecione ...' value='0' disabled/>
                  {racas.map((nome, i) =>
                    <Picker.Item label={nome} value={nome} key={i} color='black'/>
                  )}
                </Picker>
              </View>
              
              <TextInputMask style={styles.textInput}
                mask={"([00]) [00000]-[0000]"}
                placeholder="Telefone para Contato"
                keyboardType='numeric'
                onChangeText={contato => setContato(contato)} value={contato}
              >
              </TextInputMask>
              
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
              
              <View style ={{flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", marginTop:20}}>
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