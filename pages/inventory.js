import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button,
    ListView,
    Modal,
    TextInput,
    TouchableHighlight,
    Image,
} from 'react-native';
import { Actions } from 'react-native-router-flux';

import { deleteItemInventory, setInventory, rowSelectedAction, updateInventoryItem, hideModal, quantityChanged } from '../share/utils'
import image from '../node_modules/react-native-router-flux/src/back_chevron.png'
import InventoryItem from '../components/inventoryRow'

export default class Inventory extends Component {

    constructor(props) {
        super(props);
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            almacen: this.props.almacen,
            dataSource: ds,
            showModal: false,
            articulo: {},
            lote: {},
            cantidad: 0,
        };

    }

    renderTitle = () => {
        return (
            <Text style={styles.title}>Inventario</Text>
        )
    }

    renderBackButton = () => {
        return (
            <TouchableHighlight onPress={() => { Actions.pop({ refresh: { refresh: true } }) }}>

                <Image style={styles.back} source={image} />

            </TouchableHighlight>
        )
    }

    componentDidMount() {

        Actions.refresh({ renderBackButton: this.renderBackButton, renderTitle: this.renderTitle })
        setInventory(this, this.props.almacen);
    }

    render() {
        const { articulo = {}, lote = {}, cantidad, dataSource } = this.state
        const { modalText } = styles;
        return (
            <View style={styles.container}>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.showModal}
                    onRequestClose={() => hideModal(this)}
                    onclick={() => hideModal(this)}
                >
                    <View style={styles.modalParent}>
                        <View style={styles.modal}>

                            <Text style={modalText}>{articulo.descripcion}</Text>
                            {(lote.lote !== '') &&
                                <Text style={modalText}>{lote.lote} - {lote.existencias} uds</Text>
                            }
                            <View style={styles.row}>
                                <Text style={modalText} >Cantidad: </Text>

                                <TextInput
                                    style={{ fontSize: 20, flex: 1 }}
                                    placeholder='0'
                                    autoFocus={true}
                                    onChangeText={(text) => quantityChanged(this, text)}
                                    underlineColorAndroid='transparent'
                                    keyboardType='numeric'
                                    value={this.state.cantidad.toString()}
                                />

                            </View>
                            <View style={styles.rowButton}>
                                <Button
                                    onPress={() => hideModal(this)}
                                    title="Cancelar"
                                    accessibilityLabel="Cancelar"
                                />
                                <Button
                                    onPress={() => updateInventoryItem(this)}
                                    title="Guardar"
                                    accessibilityLabel="Guardar"
                                />

                            </View>
                        </View>
                    </View>
                </Modal>
                <ListView
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    renderRow={(rowData) => <InventoryItem item={rowData} actionDelete={deleteItemInventory} rowSelectedAction={rowSelectedAction} parent={this} />}

                />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    title: {
        alignSelf: 'center',
        fontSize: 20,
        marginTop: 15,
    },
    container: {
        flex: 1,
        marginTop: 55,
        marginBottom: 0,
    },
    modalParent: {

        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modal: {
        borderRadius: 5,
        flexDirection: 'column',
        borderWidth: 1,
        backgroundColor: '#fff',
        width: 300,
        marginTop: 30,
        marginLeft: 20,
        marginRight: 20,
        paddingLeft: 10,
        paddingRight: 10,
    },
    row: {
        flexDirection: 'row',
    },
    modalText: {
        marginTop: 10,
        fontSize: 20,
    },
    rowButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        paddingTop: 5,
        paddingBottom: 10,
    },
    modalButton: {
        marginLeft: 50,
        fontSize: 20,
    },
    back: {
        height: 20,
        width: 14,
        marginTop: 1,
        marginRight: 5,
    }

});