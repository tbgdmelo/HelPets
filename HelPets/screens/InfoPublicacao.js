import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { firebase } from '@react-native-firebase/database'

import  storage  from '@react-native-firebase/storage'

import Skeleton from '../skeleton'


export default function InfoPublicacao( {route, navigation} ) {

    const [loading, setLoading] = useState(true)

    useEffect(() =>{
        let timer = setInterval(() =>{
            setLoading(false)
        }, 3000)
    },[])

    const [item, setItem] = useState([])
    async function buscarItem(){
        const referencia = await firebase.database().ref('/publicacao')
        await referencia.orderByKey().on("child_added", function(snapshot){
            if(snapshot.key === route.params.publicacao){
                console.log(snapshot.val())
                setItem(snapshot.val())
                console.log('item')
                console.log(item)
                return
            }
        }), function (errorObject){
            console.log("The read failed: " + errorObject.code)
        }
    };

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
    
    return (
    <SafeAreaView style={styles.container}>
        <ScrollView>
            <View style={styles.container}>

            <Skeleton visible={loading}>
                <Image source={require('../images/pata.png')} style={styles.avatar}/>

                <Text style={styles.info}>Atende por: </Text>
                <Text style={styles.info}>Tipo: </Text>
                <Text style={styles.info}>Raça: </Text>
                <Text style={styles.info}>Contato: </Text>
                <Text style={styles.info}>Descrição: </Text>            

                <Image
                    style={styles.nome}
                    source={require('../images/nome.png')}  
                />
            </Skeleton>

            
            </View>
        </ScrollView>
    </SafeAreaView>
      )
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: "center"
    },
    nome:{
        margin:30,
        height:60,
        width:310
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
    info:{
        marginTop:15,
        fontSize: 20,
    },
    avatar:{
        width:200,
        height:200
    }
  })