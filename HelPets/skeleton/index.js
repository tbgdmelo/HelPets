import React, {useEffect} from 'react'

import {
View,
Text,
StyleSheet,
Dimensions,
Animated,
Image
} from 'react-native'

const {width} = Dimensions.get('window')

export default function Skeleton({visible, children}){

    useEffect(() =>{
        imageAnimated()
        return () => imageAnimated()
    },[]);

    const AnimatedValue = new Animated.Value(0)
    const translateX = AnimatedValue.interpolate({
        inputRange: [0,1],
        outputRange: [-10, 350]
    })
    

    const imageAnimated = () => {
        AnimatedValue.setValue(0)
        Animated.timing(
            AnimatedValue,
            {
                toValue: 1,
                duration: 1500,
                useNativeDriver: false
            }
        ).start( () =>{
            setTimeout(()=>{
                imageAnimated()
            }, 100)
        })
    }

    if(visible){
        return (
            <View style={styles.container}>
                <View style={styles.avatar}>
                    <Animated.View style={{
                        width:'30%',
                        height:'100%',
                        opacity: 0.5,
                        backgroundColor: '#fff',
                        transform: [ {translateX: translateX}]
                    }}>
                    </Animated.View>
                </View>
                
                <View style={styles.info}>
                    <Animated.View style={{
                        width:'30%',
                        height:'100%',
                        opacity: 0.5,
                        backgroundColor: '#fff',
                        transform: [ {translateX: translateX}]
                    }}>
                    </Animated.View>
                </View>
                <View style={styles.info}>
                    <Animated.View style={{
                        width:'30%',
                        height:'100%',
                        opacity: 0.5,
                        backgroundColor: '#fff',
                        transform: [ {translateX: translateX}]
                    }}>
                    </Animated.View>
                </View>
                <View style={styles.info}>
                    <Animated.View style={{
                        width:'30%',
                        height:'100%',
                        opacity: 0.5,
                        backgroundColor: '#fff',
                        transform: [ {translateX: translateX}]
                    }}>
                    </Animated.View>
                </View>
                <View style={styles.info}>
                    <Animated.View style={{
                        width:'30%',
                        height:'100%',
                        opacity: 0.5,
                        backgroundColor: '#fff',
                        transform: [ {translateX: translateX}]
                    }}>
                    </Animated.View>
                </View>
                <View style={styles.info}>
                    <Animated.View style={{
                        width:'30%',
                        height:'100%',
                        opacity: 0.5,
                        backgroundColor: '#fff',
                        transform: [ {translateX: translateX}]
                    }}>
                    </Animated.View>
                </View>
                <Image
                        style={styles.nome}
                        source={require('../images/nome.png')}  
                />
            </View>
        )
    }
    return (
        <>
        {children}
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: "center"
    },
    info:{
        marginTop:15,
        width:width - 20,
        height:22,
        backgroundColor: '#b3b3b3',
        overflow: 'hidden'
    },
    avatar:{
        width:200,
        height:200,
        backgroundColor: '#b3b3b3',
        overflow: 'hidden'
    },
    nome:{
        margin:30,
        height:60,
        width:310
    },
})