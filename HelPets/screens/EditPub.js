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

export default function EditPub ({ route, navigation }) {
    
  const [apelido, setApelido] = useState(route.params.publicacao.apelido)
  const [raca, setRaca] = useState(route.params.publicacao.raca)
  const [contato, setContato] = useState(route.params.publicacao.contato)
  const [descricao, setDescricao] = useState(route.params.publicacao.descricao)
  const [tipo, setTipo] = useState(route.params.publicacao.tipo)
  const [statusPet, setStatusPet] = useState(route.params.publicacao.statusPet)

  const tipos=['Cachorro','Gato']

  const cats=['Não sei informar','Angorá', 'British Shorthair', 'Burmese', 'Himalaia', 'Maine Coon','Persa', 'Ragdoll'
  , 'Siamês', 'Siberiano', 'Sphynx', 'Vira Lata', 'Outro']

  const dogs=['Não sei informar', 'Basset',  'Beagle', 'Boder Collie', 'Buldogue', 'Dachshund', 
  'Golden Retriever', 'Husky Siberiano', 'Labrador', 'Lhasa Apso', 'Maltês', 'Pastor-Alemão', 
  'Pinscher', 'Pit Bull', 'Poodle','Pug', 'Rottweiller', 'Schnauzer', 'Shih Tzu', 'Spitz Alemão',
   'Vira Lata', 'Yorkshire','Outro']

  const status_pet =['Encontrado', 'Perdido']

  function updateFire(){
      try{
        if(raca != '' && contato!=''){
          firebase.database().ref('/publicacao/'+route.params.publicacao.key).update({
            apelido: apelido,
            raca: raca,
            contato: contato,
            descricao: descricao,
            tipo: tipo,
            statusPet: statusPet
          })
          alert('Edição salva com sucesso!')
          navigation.goBack()
        }
        else{
            alert('Os campos: Raça e telefone são obrigatórios')
        }
      }
      catch(error){
        alert('Ocorreu um erro ao salvar')
      }
  }

  return (        
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <View style={styles.container}>

              <Text style={{marginTop:10}}>O pet foi:</Text>
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

              <Text style={{marginTop:10}}>Nome do Pet:</Text>

              <TextInput style={styles.textInput} 
                placeholder="Nome do PET (Deixe em branco caso encontrado)"
                onChangeText={apelido => setApelido(apelido)} value={apelido}
              >                
              </TextInput>

              <Text style={{marginTop:10}}>Tipo:</Text>
              
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

              <Text style={{marginTop:10}}>Raça:</Text>
              
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
              
              <TextInputMask style={styles.textInput}
                mask={"([00]) [00000]-[0000]"}
                placeholder="Telefone para Contato"
                keyboardType='numeric'
                onChangeText={contato => setContato(contato)} value={contato}
              >
              </TextInputMask>
              
              <TextInput style={styles.descricaoInput}
                placeholder="Descrição (Escreva informações que achar importante sobre o pet)"
                multiline={true}
                onChangeText={descricao => setDescricao(descricao)} value={descricao}
              >
              </TextInput>
              
              <View style ={{flexDirection: 'row', justifyContent: 'space-between', alignItems: "center", marginTop:20}}>
                  <TouchableOpacity style={styles.btnSalvar} onPress={updateFire}>
                    <Text style= {{color: 'white'}}>Salvar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnCancelar} onPress={() => navigation.goBack()}>
                    <Text style= {{color: 'white'}}>Voltar</Text>
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