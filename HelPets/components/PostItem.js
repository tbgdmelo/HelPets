import React , { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Alert
  } from 'react-native'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { firebase } from '@react-native-firebase/database'

export default function PostItem({ email, navigation }){
    const [listFire, setListFire] = useState([])

    async function buscarFirebase(){
        const referencia = firebase.database().ref('/publicacao')
        referencia.on('value', (snapshot)=>{
        const list = []
        snapshot.forEach(childItem => {
            if(childItem.val().usuario === email && childItem.val().ativo===true){
            list.push({
                key: childItem.key,
                latitude: childItem.val().latitude,
                longitude: childItem.val().longitude,
                raca: childItem.val().raca,
                foto: childItem.val().urlFoto,
                apelido: childItem.val().apelido,
                contato: childItem.val().contato,
                descricao: childItem.val().descricao,
                tipo: childItem.val().tipo,
                ativo: childItem.val().ativo
            })
            }
        });
        setListFire(list)
        });
    }
    useEffect(()=> {
        buscarFirebase()
      },[])

    function delFire(key){
        firebase.database().ref('/publicacao/'+key).remove()
    }

    function setAtivo(key){
      try{
        firebase.database().ref('/publicacao/'+key).update({
            ativo: false
          })
          alert('Publicação finalizada!')
      }
      catch(error){
        alert('Ocorreu um erro ao finalizar')
      }
    }

    const [modalVisible, setModalVisible] = useState(false)
    const [modalCheckVisible, setModalCheckVisible] = useState(false)
    const [idForDel, setIdForDel] = useState('')
    const [selecionado, setSelecionado] = useState('')
    const [selectAtivo, setSelectAtivo] = useState('')
    return (
        <View >
          <Text style={{fontSize: 35,flex:1,alignItems: "center"}}>Minhas Publicações</Text>
            {listFire.length == 0 ? (
                <Text>Você não possui publicações ativas no momento</Text>
            ) : (
                <View>
                    {
                        listFire.map((publicacao, i)=>(
                            <View key={i} style= {{ flexDirection:'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity style={styles.botaoItem} onPress={() => navigation.navigate('InfoPublicacao',{ publicacao: publicacao })}>
                                    <Text key={i} style= {{color: 'white', fontSize:12}}>{publicacao.tipo} 
                                    {publicacao.raca === 'Não sei informar'?(
                                      <Text> </Text>):
                                    ( <Text> {publicacao.raca} </Text>)
                                    }
                                    {publicacao.tipo === 'Gato' ? (
                                                    <Icon name="cat" size={20} color="#fff" />
                                                ) : ( <Icon name="dog" size={20} color="#fff" />
                                                )}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.botaoEncontrado}
                                  onPress={() => {
                                  setModalCheckVisible(!modalCheckVisible),
                                  setSelectAtivo(publicacao.key),
                                  setSelecionado(publicacao.tipo+' '+publicacao.raca)
                                  }}
                                >
                                    <Icon name="check-all" size={20} color="#fff" />
                                </TouchableOpacity>
            
                                <TouchableOpacity style={styles.botaoEdit} onPress={() => {
                                      navigation.navigate('EditPub',{ publicacao: publicacao })
                                    }}
                                    >
                                    <Icon name="pencil" size={20} color="#fff" />
                                </TouchableOpacity>
            
                                <TouchableOpacity style={styles.botaoDel} onPress={() => {
                                    setIdForDel(publicacao.key), 
                                    setModalVisible(!modalVisible),
                                    setSelecionado(publicacao.tipo+' '+publicacao.raca)}}>
                                    <Icon name="delete" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        )
                        )
                    }
                </View>
                
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Deseja deletar a publicação de {selecionado}?</Text>

                      <View>
                        <TouchableOpacity
                          style={{ ...styles.itemButton, backgroundColor: "#008037" }}
                          onPress={() => {
                            delFire(idForDel)
                            setModalVisible(!modalVisible)
                          }}
                        >
                          <Text style={styles.textStyle}>Sim</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{ ...styles.itemButton, backgroundColor: "#cc0000" }}
                          onPress={() => {
                            setModalVisible(!modalVisible)
                          }}
                        >
                          <Text style={styles.textStyle}>Não</Text>
                        </TouchableOpacity>
                      </View>

                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalCheckVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Deseja marcar a publicação de {selecionado} como finalizado?</Text>

                      <View>
                        <TouchableOpacity
                          style={{ ...styles.itemButton, backgroundColor: "#008037" }}
                          onPress={() => {
                            setModalCheckVisible(!modalCheckVisible),
                            setAtivo(selectAtivo)
                          }}
                        >
                          <Text style={styles.textStyle}>Sim</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={{ ...styles.itemButton, backgroundColor: "#cc0000" }}
                          onPress={() => {
                            setModalCheckVisible(!modalCheckVisible)
                          }}
                        >
                          <Text style={styles.textStyle}>Não</Text>
                        </TouchableOpacity>
                      </View>

                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    botaoItem:{
        borderWidth:1,
        backgroundColor:'#004AAD',
        width: '55%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#006bb3',
        borderRadius:10,
    },
    botaoDel:{
        borderWidth:1,
        width: '13%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#e60000',
        borderRadius:10,
        marginBottom: 20,
        borderColor: '#ff1a1a'
    },
    botaoEdit:{
        borderWidth:1,
        width: '13%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#e67300',
        borderRadius:10,
        marginBottom: 20,
        borderColor: '#e67300'
    },
    botaoEncontrado:{
      borderWidth:1,
      width: '13%',
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: '#00b33c',
      backgroundColor:'#008037',
      borderRadius:10,
      marginBottom: 20,
  },
    titulo:{
        fontSize: 30,
        fontWeight: "bold",
        fontFamily: "Cochin",
        marginTop: 10,
        marginBottom: 10
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width:350,
        height:200
      },
      itemButton:{
        borderRadius: 100,
        padding: 10,
        elevation: 2,
        marginBottom: 15,
        borderColor: 'black'
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      itemButton:{
        borderRadius: 100,
        padding: 10,
        elevation: 2,
        marginBottom: 15,
        borderColor: 'black'
      },
      container:{
        flex:1,
        alignItems: "center"
      },
  });