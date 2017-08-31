import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Switch,
    StyleSheet
} from 'react-native';
import { Actions } from 'react-native-router-flux'
import { getSettings, saveSettings } from '../share/utils'


export default class OptionsScreen extends Component {

    constructor() {
        super();

        const { terminal, host, port, lotes } = getSettings()

        this.state = {
            terminal: terminal.toString(),
            host: host,
            port: port.toString(),
            lotes: lotes
        }

    }
    componentDidMount() {
        Actions.refresh({ renderRightButton: this.renderRightButton })

    }

    renderRightButton = () => {
        return (
            <TouchableOpacity onPress={() => saveSettings(this.state)}>
                <Text style={styles.navButton}>Guardar</Text>
            </TouchableOpacity>
        )
    }

    render() {

        return (
            <View style={styles.container}>
                <View style={styles.row}>
                    <Text style={styles.rowText}>Terminal</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='terminal'
                        keyboardType='numeric'
                        underlineColorAndroid={'#E4E4E4'}
                        onChangeText={(value) => this.setState({ terminal: value })}
                        value={this.state.terminal}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowText}>Host</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='host'
                        underlineColorAndroid={'#E4E4E4'}
                        onChangeText={(value) => this.setState({ host: value })}
                        value={this.state.host}
                    />
                </View>
                <View style={styles.row}>
                    <Text style={styles.rowText}>Puerto</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='puerto'
                        keyboardType='numeric'
                        underlineColorAndroid={'#E4E4E4'}
                        onChangeText={(value) => this.setState({ port: value })}
                        value={this.state.port}
                    />
                </View>
                <View style={[styles.row, styles.switchRow]}>
                    <Text style={styles.rowText}>Lotes</Text>
                    <Switch
                        style={styles.input}
                        onValueChange={(value) => this.setState({ lotes: value })}
                        value={this.state.lotes}
                        onTintColor='#66a3ff'
                        thumbTintColor='#0066ff'
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 65,
    },
    navButton: {
        color: '#0066ff',
        fontSize: 18,
    },
    row: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        margin: 2,
        marginLeft: 20,
    },
    rowText: {
        alignSelf: 'center',
        //textAlign: 'center',
        flex: 1,
    },
    input: {
        flex: 4,
        width: 300,

    },
    switchRow: {
        marginTop: 10,
    }
});