import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ImageBackground
} from 'react-native'

import PostItem from '../components/PostItem'

export default function Postados ({ route, navigation  }) {
  return (
    <SafeAreaView>
       <ImageBackground 
            source= {require('../images/background.jpeg')} 
            style={styles.image}
            blurRadius={1}>
      <ScrollView>
        <View style={styles.container}>
            <Text>
                <View>
                    <PostItem email={route.params.userInfo.user.email} navigation={navigation}/>
                </View>
            </Text>
        </View>
      </ScrollView>
      </ImageBackground>
    </SafeAreaView>
 );
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems: "center"
  },
  image: {
      width:'100%',
      height:'100%'
  },
});