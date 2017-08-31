import React, { Component } from 'react';
import {
    Image,
    View,
    StyleSheet,
    Text,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

export default class SplashScreen extends Component {

    componentWillMount() {
        setTimeout(() => {
            Actions.main();
        }, 2000);
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Poner imagen o lo que sea en splash.js</Text>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#AAAAAA',
    },

    text: {
        height: null,
        width: null,
    },

});