
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Switch,
    ScrollView,
    TouchableOpacity,
    Keyboard,
    NativeModules
} from 'react-native';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';

import { increaseButton, decreaseButton, quantityChanged, openSearch, setData, barrasSubmit, previousSaved, resetDataTakerState, hideKeyboard, dataTakerSwitchChange, updateLast } from '../share/utils'
export default class DataTaker extends Component {

    constructor(props) {
        super(props);

        resetDataTakerState(this);
    }

    componentDidMount() {
        
        Actions.refresh({ renderTitle: this.renderTitle, renderRightButton: this.renderRightButton })

    }

    componentWillReceiveProps() {

        updateLast(this)

    }

    renderTitle = () => {
        return (
            <Text style={styles.ComponentTitle}>Toma de datos</Text>
        )
    }

    renderRightButton = () => {
        const { articulo, lote, cantidad } = this.state
        return (
            <TouchableOpacity onPress={() => setData(this)}>
                <Text style={((articulo.codigo != '') && ((!articulo.loteable) || (lote.pk != '')) && cantidad != 0) ? styles.navButton : styles.navButtonInactive}>
                    Guardar
            </Text>
            </TouchableOpacity>
        )
    }

    render() {
        const { State: TextInputState } = TextInput;
        //display, flex, opacity
        //height 
        return (
            <ScrollView style={styles.container}>

                <Text style={styles.title}>{this.state.almacen.codigo} {this.state.almacen.descripcion}</Text>
                <View style={styles.row} >
                    <Text style={styles.rowText}>Barras</Text>
                    <TextInput
                        ref="barra"
                        editable={true}
                        style={styles.input}
                        autoFocus={true}
                        onFocus={hideKeyboard}
                        underlineColorAndroid={'#E4E4E4'}
                        multiline={false}
                        returnKeyType={'done'}
                        onChangeText={(value) => {
                            this.setState({ barras: value })

                            /** EVITAR *//*
                            if (this.checker)
                                clearTimeout(this.checker)
                            if (this.state.barras != '')
                                this.checker = setTimeout(() => {

                                    console.warn('Metodo burro para submit executed')
                                    clearTimeout(this.checker)
                                    console.warn('this.state.barras=' + this.state.barras)



                                    this.submitAction()
                                    this.refs.barra.focus()
                                }, 400)
                            /** EVITAR FIN*/

                        }}
                        onSubmitEditing={(event) => barrasSubmit(this, event)}
                        onEndEditing={() => { if (this.state.auto) this.refs.barra.focus() }}
                        value={this.state.barras}
                    />

                </View>
                <View style={styles.row}>
                    <Text style={styles.rowText}>Artículo</Text>
                    <TextInput
                        style={[styles.input, styles.searchInput]}
                        editable={false}
                        keyboardType='numeric'
                        underlineColorAndroid={'#E4E4E4'}
                        value={this.state.articulo.codigo.toString()}
                    />
                    <TouchableOpacity
                        onPress={() => openSearch(this, 'art', this.state.auto, this.state.articulo.loteable)}
                        style={styles.searchButton}>
                        <Icon
                            name="search"
                            size={20}
                            color={this.state.auto ? '#AAA' : '#555'}
                            backgroundColor='rgba(255,255,255,0)'

                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.row}>
                    <Text style={[styles.rowText, styles.descripcion]}>{this.state.articulo.descripcion}</Text>

                </View>
                {this.props.loteable &&
                    <View style={styles.row}>
                        <Text style={styles.rowText}>Lote</Text>
                        <TextInput
                            style={[styles.input, styles.searchInput]}
                            editable={false}
                            underlineColorAndroid={'#E4E4E4'}
                            value={this.state.lote.lote}
                        />
                        <TouchableOpacity
                            onPress={() => openSearch(this, 'lote', this.state.auto, this.state.articulo.loteable)}
                            style={styles.searchButton}>
                            <Icon
                                name="search"
                                size={20}
                                color={(!this.state.articulo.loteable || this.state.auto) ? '#AAA' : '#555'}
                                backgroundColor='rgba(255,255,255,0)'
                            />
                        </TouchableOpacity>
                    </View>

                }

                <View style={styles.row}>
                    <Text style={styles.rowText}>Cantidad</Text>
                    <TextInput
                        style={styles.input}
                        editable={!this.state.auto}
                        keyboardType='numeric'
                        underlineColorAndroid={'#E4E4E4'}
                        onChangeText={(value) => quantityChanged(this, value)}
                        value={this.state.cantidad.toString()}
                        onEndEditing={() => console.log('===onEndEditing===')}
                        onBlur={() => console.log('===onBlur=== ' + this.state.cantidad)}
                        onSubmitEditing={() => console.log('===onSubmitEditing===' + this.state.cantidad)}
                        onSelectionChange={() => console.log('===onSelectionChange===' + this.state.cantidad)}
                    />
                </View>

                <View style={[styles.row, styles.rowSwitch]}>
                    <Text style={styles.rowText}>auto</Text>
                    <Switch
                        style={styles.input}
                        onValueChange={(value) => dataTakerSwitchChange(this, value)}
                        value={this.state.auto}
                        onTintColor='#66a3ff'
                        thumbTintColor='#0066ff'
                    />
                </View>

                <View style={styles.rowButton}>
                    <Button
                        style={styles.button}
                        styleDisabled={{ backgroundColor: '#66a3ff' }}
                        disabled={this.state.auto}
                        onPress={() => decreaseButton(this)}>
                        -
                        </Button>

                    <Button
                        disabled={this.state.auto}
                        styleDisabled={{ backgroundColor: '#66a3ff' }}
                        style={[styles.button, styles.plusButton]}
                        onPress={() => increaseButton(this)}>
                        +
                        </Button>

                </View>

                <Text style={styles.title}>Última captura</Text>

                <TouchableOpacity onPress={() => previousSaved(this, this.state.almacen)}>
                    <View style={styles.row}>
                        <Text style={styles.rowText}>Artículo</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Ninguno'
                            keyboardType='numeric'
                            underlineColorAndroid={'#E4E4E4'}
                            onChangeText={(value) => this.setState({ ultArticulo: value })}
                            value={this.state.ultArticulo.toString()}
                            editable={false}
                        />
                    </View>
                    {this.props.loteable &&
                        <View style={styles.row}>
                            <Text style={styles.rowText}>Lote</Text>
                            <TextInput
                                style={styles.input}
                                placeholder='Ninguno'
                                keyboardType='numeric'
                                underlineColorAndroid={'#E4E4E4'}
                                onChangeText={(value) => this.setState({ ultLote: value })}
                                value={this.state.ultLote}
                                editable={false}
                            />

                        </View>
                    }
                    <View style={styles.row}>
                        <Text style={styles.rowText}>Cantidad</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Ninguno'
                            keyboardType='numeric'
                            underlineColorAndroid={'#E4E4E4'}
                            onChangeText={(value) => this.setState({ ultCantidad: value })}
                            value={this.state.ultCantidad.toString()}
                            editable={false}
                        />
                    </View>
                </TouchableOpacity>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 60,
    },
    ComponentTitle: {
        alignSelf: 'center',
        fontSize: 20,
        marginTop: 15,
    },
    navButton: {
        color: '#0066ff',
        fontSize: 18,
    },
    navButtonInactive: {
        color: '#AAA',
        fontSize: 18,
    },
    row: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: -6,
        marginLeft: 12,
        alignItems: 'center',
    },
    rowButton: {
        justifyContent: 'flex-end',
        backgroundColor: '#DDD',
        flexDirection: 'row',
        marginLeft: 0,
        padding: 2,
        paddingTop: 5,
        paddingBottom: 8,
    },
    rowText: {
        alignSelf: 'center',
        flex: 0.2,
    },
    input: {
        flex: 0.8,

    },
    searchButton: {
        padding: 12
    },
    rowSwitch: {
        backgroundColor: '#DDD',
        marginLeft: 0,
        paddingLeft: 12,
        marginTop: 10,
    },
    button: {
        flex: 0.1,
        paddingTop: 20,
        paddingBottom: 25,
        paddingLeft: 48,
        paddingRight: 48,
        marginLeft: 25,
        backgroundColor: '#0066ff',
        fontSize: 45,
        color: 'white',
    },
    plusButton: {
        //debido a que el caracter '+' es mas ancho
        paddingLeft: 44,
        paddingRight: 44,
    },
    title: {
        alignSelf: 'center',
        fontSize: 20,
        paddingBottom: 5,
        marginLeft: 5,
    },
    descripcion: {
        padding: 10,
        paddingLeft: 10,
    },
    searchInput: {
        flex: 0.66
    },

});