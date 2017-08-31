
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Entypo';


export default class SearchRow extends Component {

    render() {
        const { item, actionDelete, rowSelectedAction, parent } = this.props;

        return (

            <TouchableOpacity onPress={() => rowSelectedAction(parent, item)} style={styles.row}>
                <View style={styles.container}>
                    <Text style={styles.text}> {item.articulo.descripcion}</Text>
                    {(item.lote.lote !== '') &&
                        <Text style={styles.lote}> {item.lote.lote} - {item.lote.existencias} uds</Text>
                    }

                </View>

                <Text style={styles.cantidad} numberOfLines={1}> {/*Hay un bug si es un numero en 43.4*/String(item.cantidad)}</Text>
                <Icon.Button
                    style={styles.button}
                    name="circle-with-cross"
                    size={20}
                    color={'#AAA'}
                    backgroundColor='rgba(255,255,255,0)'
                    onPress={() => actionDelete(item, parent)}
                />
            </TouchableOpacity>


        );
    }
}

const styles = StyleSheet.create({

    row: {
        flexDirection: 'row',
        flex: 1,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E4E4E4',

    },
    container: {
        flexDirection: 'column',
        flex: 1,
    },
    text: {
        flex: 9,
        alignSelf: 'flex-start',
        fontSize: 22,

    },
    lote: {
        fontSize: 17,

    },
    cantidad: {
        flex: 1,
        fontSize: 22,
        alignSelf: 'center',
        textAlign: 'right'

    },
    button: {
        flex: 1,
        paddingLeft: 30,
        alignSelf: 'flex-end',

    },

});

