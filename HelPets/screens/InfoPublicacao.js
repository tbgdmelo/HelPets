import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Linking,
  Platform
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { firebase } from '@react-native-firebase/database'

import  storage  from '@react-native-firebase/storage'

import Skeleton from '../skeleton'


import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default function InfoPublicacao( {route} ) {

    return (
    <SafeAreaView style={styles.container}>
        <ScrollView>
            <View style={styles.container}>
                <Image source= {{ uri: route.params.publicacao.foto ? route.params.publicacao.foto :
                            'https://image.shutterstock.com/image-vector/cat-dog-pet-love-logo-600w-1303349926.jpg'}}            
                 style={styles.avatar}/>

                <Text style={styles.infoTipo}>{route.params.publicacao.tipo}</Text>
                <Text style={styles.info}>Da raça: {route.params.publicacao.raca}</Text>
                <Text style={styles.info}>Atende por: {route.params.publicacao.apelido ? route.params.publicacao.apelido:
                'Não informado'}
                </Text>
                <View style= {{ flexDirection:'row', justifyContent: 'space-between' }}>
                    <Text style={styles.info}>Contato: {route.params.publicacao.contato}   </Text>
                        <TouchableOpacity
                            style={styles.callButton}
                            onPress={() => {Linking.openURL('tel:${'+route.params.publicacao.contato+'}')}}
                        >
                            <Icon name="phone-outline" color={'#fff'} size={30} />
                        </TouchableOpacity>
                </View>
                <Text style={styles.infoDesc}>Descrição: {route.params.publicacao.descricao ? route.params.publicacao.descricao:
                'Não informado'}</Text>            

                <Image
                    style={styles.nome}
                    source={require('../images/nome.png')}  
                />
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
    infoDesc:{
        marginTop:15,
        fontSize: 20,
        marginLeft:10,
        textAlign: 'center'
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
    callButton:{
        backgroundColor: '#006600',
        borderRadius: 150,
        width: 40,
        height: 40,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    }
  })