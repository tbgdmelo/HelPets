import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native'

import {
  GoogleSigninButton,
  GoogleSignin,
  statusCodes
} from '@react-native-community/google-signin'

import { WEB_CLIENT_ID } from '../utils/keys'
import { firebase } from '@react-native-firebase/auth'

export default function Login( {navigation, route} ) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userInfo, setUserInfo] = useState(null)
    const [error, setError] = useState(null)

    useEffect ( ( ) => {
      getCurrentUserInfo()
      configureGoogleSign ()
    },[] )

    function configureGoogleSign() {
        GoogleSignin.configure({
          scopes: ['https://www.googleapis.com/auth/drive.photos.readonly','https://www.googleapis.com/auth/drive.readonly'],
          webClientId: WEB_CLIENT_ID,
          offlineAccess: false
        })
    }

    async function signIn() {
        try {
          await GoogleSignin.hasPlayServices()
          const userInfo = await GoogleSignin.signIn()
          setUserInfo(userInfo)
          setError(null)
          setIsLoggedIn(true)
          const { accessToken, idToken } = await GoogleSignin.signIn()
          const credential = firebase.auth.GoogleAuthProvider.credential(idToken,accessToken)
            // login with credential
          await firebase.auth().signInWithCredential(credential)
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // when user cancels sign in process,
            //Alert.alert('Process Cancelled')
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // when in progress already
            //Alert.alert('Process in progress')
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // when play services not available
            //Alert.alert('Play services are not available')
          } else {
            // some other error
            //Alert.alert('Something else went wrong... ', error.toString())
            setError(error)
          }
        }
        //Alert.alert('Login realizado com sucesso!')
      }
    
      async function getCurrentUserInfo() {
        try {
          const userInfo = await GoogleSignin.signInSilently()
          setUserInfo(userInfo)
          setIsLoggedIn(true)
          //navigation.navigate('Publicacao', { local: route.params.local, user: userInfo })
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
      
      async function signOut() {
        try {
          await GoogleSignin.revokeAccess()
          await GoogleSignin.signOut()
          setIsLoggedIn(false)
        } catch (error) {
          //Alert.alert('Something else went wrong... ', error.toString())
        }
      }

    return (
      <SafeAreaView style={styles.container}>
          <View style={styles.container}>
            <Image
                style={styles.logo}
                source={require('../images/logo_sem_fundo.png')}
            />
            <GoogleSigninButton
              style={styles.btnLogin}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={() => signIn()}
            />

            <View style={styles.avisoLogin}>
              {isLoggedIn === false ? (
                  <Text style={styles.aviso}>Realize o login para publicar e visualizar suas publicações!</Text>
              ) : ( navigation.navigate('Postados', {userInfo})
              )}
            </View>

          </View>
          
          </SafeAreaView>
      )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    btnLogin: {
      width: 300,
      height: 55
    },
    avisoLogin: {
      marginVertical: 20,
      marginTop:-5
    },
    aviso: {
      fontSize: 20,
      color: 'red',
      textAlign: 'center'
    },
    logo: {
        width: 250,
        height: 300,
    },
    btnEntrar:{
      borderWidth:1,
      borderColor: '#00b33c',
      width: 150,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:'#024213',
      borderRadius:10
    },
  })