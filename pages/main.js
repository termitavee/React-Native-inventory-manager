import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Button,
} from 'react-native';

import {sendData, reciveData, hojeaAlmacen, launchConfiguration} from '../share/utils'

export default class MainScreen extends Component {
/**
 * recuperar el foco al leer código
 * ocultar teclado en el campo de barras
 * procesar correctamente el código de barras
 * 
 * error al volver a la lista de almacenes despues de hacer ?
 * 
 */

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.buttonContainer}>
                    <Button
                        title="Enviar datos"
                        onPress={sendData}
                    />
                    <Button
                        title="Recibir datos"
                        onPress={reciveData}
                    />
                </View>
                <View style={[styles.buttonContainer, styles.center]}>
                    <Button
                        title="Buscar"
                        onPress={() => hojeaAlmacen(this)}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        title="Opciones"
                        onPress={launchConfiguration}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#F5FCFF',
        padding: 20,
        paddingTop: 75,
    },
    buttonContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    center: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    text: {
        height: null,
        width: null,
    },

});