import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native'

import React, { useState } from 'react'


import * as Progress from 'react-native-progress';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    paddingTop: Dimensions.get('window').height/3,
  },
  circles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progress: {
    margin: 10,
  },
});

export default function Skeleton({visible, children}){
    if(visible){
        return (
            <View style={styles.container}>
              <Text style={styles.welcome}>Sua publicação está sendo salva, aguarde...</Text>
              <View style ={{flexDirection: 'row', justifyContent: 'space-between', alignItems: "center"}}>
              
              <Image source={require('../images/pata.png')} style={{height: 35, width:35 }} />
              <Image source={require('../images/pata_vermelha1.png')} style={{height: 35, width:35 }} />
              <Image source={require('../images/pata_azul1.png')} style={{height: 35, width:35 }} />
              </View>
              <View style={styles.circles}>
                <Progress.CircleSnail
                  style={styles.progress}
                  color={['#FF1616', '#004AAD', '#008037']}
                />
              </View>
              <Text>Não feche o aplicativo</Text>
            </View>
          )
    }
    else{
        return(
        <>
        {children}
        </>
        )
    }
}