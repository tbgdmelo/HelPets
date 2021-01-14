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

    return (
    <SafeAreaView style={styles.container}>
        <ScrollView>
            <View style={styles.container}>

            <Skeleton visible={loading} style={styles.container}>
                <Image source= {{ uri: route.params.publicacao.foto ? route.params.publicacao.foto :
                            'https://image.shutterstock.com/image-vector/cat-dog-pet-love-logo-600w-1303349926.jpg'}}            
                 style={styles.avatar}/>

                <Text style={styles.infoTipo}>{route.params.publicacao.tipo}</Text>
                <Text style={styles.info}>Da raça: {route.params.publicacao.raca}</Text>
                <Text style={styles.info}>Atende por: {route.params.publicacao.apelido ? route.params.publicacao.apelido:
                'Não informado'}
                </Text>
                <Text style={styles.info}>Contato: {route.params.publicacao.contato}</Text>
                <Text style={styles.info}>Descrição: {route.params.publicacao.descricao ? route.params.publicacao.descricao:
                'Não informado'}</Text>            

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
    info:{
        marginTop:15,
        fontSize: 20,
        marginLeft:10
    },
    avatar:{
        width:200,
        height:200,
        marginTop: 15
    },
    infoTipo:{
        marginTop:15,
        fontSize: 25,
        marginLeft:10,
        fontWeight: "bold"
    },
  })