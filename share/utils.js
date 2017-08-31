import React from 'react';
import { Alert, Modal } from 'react-native';
import { Actions } from 'react-native-router-flux';

import { database, TbGeneral, TbAlmacen, TbArticulo, TbLotes, TbInventario } from '../share/database'

//splash.js
//index.js
/*** === === === === === === === === === === === === === === === === === === ***/
/*** === === === === === === === === Main.js === === === === === === === === ***/
/*** === === === === === === === === === === === === === === === === === === ***/

export function sendData() {
    database.printData()
    /*
    const netConfig = new TbGeneral().get();
    fetch(netConfig.host + ':' + netConfig.port, {
        method: 'GET',
        headers: {

        },
        body: JSON.stringify({
            firstParam: 'yourValue',
            secondParam: 'yourOtherValue',
        })
    })
        .then((response) => {
            //datos enviados
        })
        .catch((error) => {
            //monsaje de error
        })
        */
}

export function reciveData() {

    Alert.alert(
        'Aviso de borrado',
        'Se borrarán los datos en este terminal para sustituilos por los mas recientes, ¿estas seguro?',
        [
            { text: 'CANCELAR', style: 'cancel' },
            {
                text: 'ACEPTAR', onPress: () => {
                    Alert.alert(
                        'Confirmación',
                        'Se borrarán los datos en este terminal, ¿estas seguro?',
                        [
                            {
                                text: 'ACEPTAR', onPress: () => {

                                    const db = database;
                                    db.deleteAll();
                                    db.createDumyData();

                                }
                            },
                            { text: 'CANCELAR', style: 'cancel' },
                        ],
                    )
                }
            }
        ]
    )
}

export function hojeaAlmacen(ref) {

    Actions.hojea({ 'title': 'Selecciona almacén', 'getItems': getItems, 'actionSelected': almacenSelected, 'filter': ['codigo', 'descripcion'], parentRef: ref });
}

export function launchConfiguration() {

    Actions.configuration();
}

function getItems(type, params) {
    switch (type) {
        case 'Selecciona almacén':
            return (new TbAlmacen()).get();

        case 'Selecciona artículo':
            return (new TbArticulo()).get();

        case 'Selecciona lote':
            return (new TbLotes()).get(params);
        default:

    }
}

function almacenSelected(ref, item) {

    const ultimo = new TbInventario().getLast(item)
    const loteable = new TbGeneral().get('loteable')

    Actions.tomador({ almacen: item, ultimo, loteable })
}

/*** === === === === === === === === === === === === === === === === === === ***/
/*** === === === === === === === ===search.js=== === === === === === === === ***/
/*** === === === === === === === === === === === === === === === === === === ***/

export function updateDataSource(ref, data) {

    ref.setState({
        dataSource: ref.state.dataSource.cloneWithRows(data),
    });
};

export function setSearchText(ref, event, title, itemsParams) {

    const searchText = event.nativeEvent.text;
    const filteredData = filterNotes(searchText, getItems(title, itemsParams), ref.props.filter);

    updateDataSource(ref, filteredData);

}

function filterNotes(searchText, items, filterLimit) {
    const text = searchText.toLowerCase();


    return items.filter((item) => {

        let match = false;
        filterLimit.forEach((key) => {

            const data = String(item[key]).toLowerCase();

            if (data.search(text) != -1)
                match = true

        });

        return match;
    });

}

/*** === === === === === === === === === === === === === === === === === === ***/
/*** === === === === === === ===   dataTaker.js  === === === === === === === ***/
/*** === === === === === === === === === === === === === === === === === === ***/

export function increaseButton(ref) {

    ref.setState({ cantidad: (ref.state.cantidad + 1) })
    if (ref.state.cantidad < 1)
        Actions.refresh()
}

export function decreaseButton(ref) {

    const cantidad = ref.state.cantidad
    if (cantidad > 0) {

        ref.setState({ cantidad: cantidad - 1 })
        if (cantidad == 1)
            Actions.refresh()
    }
}
//lo usa también inventory
export function quantityChanged(ref, value) {
    //evita numeros negativos a mano y numero excesivamente grande)
    if (value >= 0 && value <= (1.8 * Math.pow(10, 18))) {
        ref.setState({ cantidad: value.toString() })
    } else {
        ref.setState({ cantidad: (0).toString() })

    }

}

export function openSearch(ref, searchItem, auto, loteable) {
    if (!auto) {
        if (searchItem == 'art') {
            Actions.hojea({ 'title': 'Selecciona artículo', 'getItems': getItems, 'actionSelected': articleSelected, 'filter': ['descripcion'], parentRef: ref });
        } else {
            if (loteable) {
                Actions.hojea({
                    title: 'Selecciona lote',
                    getItems: getLotes,
                    actionSelected: loteSelected,
                    filter: ['lote', 'existencias'],
                    parentRef: ref,
                    loteLimits: { almacen: ref.state.almacen.codigo, articulo: ref.state.articulo.codigo }
                });
            }
        }
    }
}

getLotes = (titulo, param) => {

    return getItems(titulo, param.loteLimits)
}

articleSelected = (ref, item) => {

    ref.setState({ articulo: item, lote: { pk: '', lote: '', almacen: 0, articulo: 0, existencias: 0 } })
    Actions.pop()

}

loteSelected = (ref, item) => {

    ref.setState({ lote: item })
    Actions.pop()

}

export function setData(ref) {

    const { almacen, articulo, lote, cantidad } = ref.state;
    //si tiene código y, si no es loteable o si es loteable y tiene lote, y si es mas de 0
    if ((articulo.codigo != '') && ((!articulo.loteable) || (lote.pk != '')) && cantidad != 0) {

        new TbInventario().insert([{ almacen, articulo, lote, cantidad }])
        ref.setState(cleanState(articulo, lote, cantidad))
        Actions.refresh()
    }

}
cleanState = (articulo, lote, cantidad) => {
    return {
        ultArticulo: articulo.codigo,
        ultLote: lote.lote,
        ultCantidad: cantidad,
        articulo: { codigo: '', descripcion: ' ', loteable: false },
        lote: { pk: '', lote: '', almacen: 0, articulo: 0, existencias: 0 },
        cantidad: 1,
    }
}

export function updateLast(ref) {
    if (ref.state.shoudRefresh) {
        ref.setState({ shoudRefresh: false })
        const { almacen, ultArticulo, ultLote, ultCantidad } = ref.state
        const ultimo = new TbInventario().getLast(almacen)

        if (ultimo.articulo.codigo != ultArticulo || ultimo.lote.lote != ultLote || ultimo.cantidad != ultCantidad)
            ref.setState({
                ultArticulo: ultimo.articulo.codigo,
                ultLote: ultimo.lote.lote,
                ultCantidad: ultimo.cantidad,
            })
    }



}

export function resetDataTakerState(ref) {

    const { ultimo, almacen } = ref.props

    ref.state = {
        almacen: almacen,
        barras: '',
        articulo: { codigo: '', descripcion: ' ', loteable: false },
        lote: { pk: '', lote: '', almacen: 0, articulo: '0', existencias: 0 },
        cantidad: 1,
        auto: true,
        ultArticulo: ultimo ? ultimo.articulo.codigo : 'Ninguno',
        ultLote: ultimo ? ultimo.lote.lote : 'Ninguno',
        ultCantidad: ultimo ? ultimo.cantidad : 'Ninguno',
    }



}

export function previousSaved(ref, almacen) {
    ref.setState({ shoudRefresh: true })
    Actions.listar({ almacen })
}

export function barrasSubmit(ref, event) {

    event.preventDefault()

    const codigo = ref.state.barras
    ref.setState({ barras: '' })

    //]c1 01 08413907[7093]10 15 180900 10 180912
    //]c1 inicio
    //(01) identificador de aplicacion
    //0841390770931 EAN,13, 0 security digit
    //7093 articulo
    //(15) identificador de algo
    //180900 caducidad?
    //(10) identificador de lote
    //180912 lote
    const codLote = codigo.substring(codigo.length - 6, codigo.length)
    const codArticulo = codigo.substring(13, 17)

    const inventario = new TbInventario();
    const almacen = ref.state.almacen
    const articulo = (new TbArticulo).get(codArticulo)
    //controla código inexistente
    if (articulo) {
        const lote = (new TbLotes).getFromLote(almacen, articulo, codLote)[0]

        //almacen equivocado o articulos loteables sin lote
        if ((!articulo.loteable) || (lote != null && lote.pk != ''))

            if (ref.state.auto)
                inventario.insert([{ almacen, articulo, lote }])
            else
                ref.setState({ articulo, lote })

        else
            Alert.alert(
                'Error al leer',
                `El artículo '${articulo.descripcion}' no pertenece a este almacen o pertenece a un lote`,
                [
                    { text: 'CANCELAR', style: 'cancel' },
                    {
                        text: 'ACEPTAR', onPress: () => {



                        }
                    },
                ]
            )

    } else {
        Alert.alert(
            'Error al leer',
            `El artículo no existe en la base de datos`,
            [
                { text: 'CANCELAR', style: 'cancel' },
                {
                    text: 'ACEPTAR', onPress: () => {


                    }
                },
            ]
        )
    }

    //]c1 18 43547790[0192]12
    //]c1 inicio

    ref.refs.barra.focus()
    Actions.refresh()
}

export function hideKeyboard() {
    //NativeModules.hideKeyboard.hide();

}

export function dataTakerSwitchChange(ref, value) {
    ref.setState({ auto: value })

    if (value == true)
        ref.refs.barra.focus()

}


/*** === === === === === === === === === === === === === === === === === === ***/
/*** === === === === === === === ===Inventory.js === === === === === === === ***/
/*** === === === === === === === === === === === === === === === === === === ***/

export function setInventory(ref, almacen) {

    ref.setState({
        dataSource: ref.state.dataSource.cloneWithRows(new TbInventario().getAll(almacen)),
    });
}


export function deleteItemInventory(selectedItem, ref) {
    Alert.alert(
        '¿Borrar ítem?',
        `Se borrará ${selectedItem.articulo.descripcion}`,
        [
            { text: 'CANCELAR', style: 'cancel' },
            {
                text: 'ACEPTAR', onPress: () => {

                    const inventario = new TbInventario()
                    inventario.delete(selectedItem.pk)
                    const newItems = inventario.getAll(ref.props.almacen)

                    ref.setState({
                        dataSource: ref.state.dataSource.cloneWithRows(newItems),
                    });

                }
            },
        ],
    )

}

export function rowSelectedAction(ref, item) {
    console.log('rowSelectedAction')
    ref.setState({
        articulo: item.articulo,
        lote: item.lote,
        cantidad: item.cantidad,
        showModal: true
    })

}

export function updateInventoryItem(ref) {
    //guardar items actualizados, si cantidad es 0 deleteItemInventory()

    hideModal(ref)
    const { almacen, articulo, lote, cantidad = 0 } = ref.state
    const inventario = new TbInventario();
    const pk = almacen.codigo.toString() + articulo.codigo + lote.lote

    if (cantidad && cantidad != 0) {

        inventario.update(pk, cantidad)
    } else {
        Alert.alert(
            '¿Borrar ítem?',
            `Se borrará ${articulo.descripcion}`,
            [
                { text: 'CANCELAR', style: 'cancel' },
                {
                    text: 'ACEPTAR', onPress: () => {

                        inventario.delete(pk)
                        const newItems = inventario.getAll(almacen)

                        ref.setState({
                            dataSource: ref.state.dataSource.cloneWithRows(newItems),
                        });

                    }
                },
            ],
        )

    }


}

export function hideModal(ref) {
    ref.setState({
        showModal: false
    })
}


/*** === === === === === === === === === === === === === === === === === === ***/
/*** === === === === === === === === options.js  === === === === === === === ***/
/*** === === === === === === === === === === === === === === === === === === ***/

export function getSettings() {
    return new TbGeneral().get();
}

export function saveSettings(state) {
    let { terminal, host, port, lotes } = state

    if (terminal && host && port)
        new TbGeneral().update(parseInt(terminal), host, parseInt(port), lotes)

    Actions.pop()
}
