/*tbGeneral
    Terminal Integer
    Host String(60)
    Port Integer
    Lotes Boolean

tbAlmacen
    Codigo Integer
    Descri String(30)

tbArticu
    Codigo String(12)
    Descri String(40)
    Loteable Boolean

tbCodBarr
    Articulo FK(tbArticu)
    Cod_Barra String(13)
    Nuevo Boolean

tbLotes
    Almacen FK(tbAlmacen)
    Articulo FK(tbArticu)
    Lote String(20)
    Existencia Float

tbInventario
    FechaHora DateTime
    Almacen Integer
    Articulo String(12)
    Lote String(20)
    Cantidad Float
*/
TbGeneralSchema = {
    name: 'tbGeneral',
    primaryKey: 'id',
    properties: {
        id: { type: 'int', default: 0 },
        terminal: { type: 'int', default: 1 },
        host: { type: 'string', default: '192.168.1.1' },
        port: { type: 'int', default: 8080 },
        lotes: { type: 'bool', default: false }
    }

};

TbAlmacenSchema = {
    name: 'tbAlmacen',
    primaryKey: 'codigo',
    properties: {
        codigo: { type: 'int' },
        descripcion: { type: 'string', default: 'Sin descripción' }
    }

};

TbArticuloSchema = {
    name: 'tbArticulo',
    primaryKey: 'codigo',
    properties: {
        codigo: { type: 'string' },
        descripcion: { type: 'string', default: 'Sin Descripción' },
        loteable: { type: 'bool', default: false }
    }

};

TbCodBarraSchema = {
    name: 'tbCodBarra',
    primaryKey: 'codigo',
    properties: {
        codigo: { type: 'string' },
        articulo: { type: 'string' },
        nuevo: { type: 'bool', default: true }
    }

};
//primary key tiene que ser única asi que para que englobe varios campos se deben concatenar
TbLotesSchema = {/** */
    name: 'tbLotes',
    primaryKey: 'pk',
    properties: {
        pk: { type: 'string' },
        lote: { type: 'string', },
        almacen: { type: 'int' },
        articulo: { type: 'string' },
        existencias: { type: 'float', default: 0 }
    }

};
//primary key tiene que ser única asi que para que englobe varios campos se deben concatenar
TbInventarioSchema = {
    name: 'tbInventario',
    primaryKey: 'pk',
    properties: {
        pk: { type: 'string' },
        fecha: { type: 'date', default: new Date() },
        almacen: { type: 'tbAlmacen' },
        articulo: { type: 'tbArticulo' },
        lote: { type: 'tbLotes', },
        cantidad: { type: 'int', }
    }

};

class Database {

    constructor() {

        this.migrate()
    }

    migrate = () => {
        schemas = [
            { schema: [TbAlmacenSchema, TbArticuloSchema, TbCodBarraSchema, TbLotesSchema, TbInventarioSchema], schemaVersion: 0, migration: this.initialMigration },
            {
                schema: [
                    TbGeneralSchema,
                    TbAlmacenSchema,
                    TbArticuloSchema,
                    TbCodBarraSchema,
                    TbLotesSchema,
                    TbInventarioSchema],
                schemaVersion: 1,
                migration: this.initialMigration
            }
        ]
        let nextSchemaIndex = Realm.schemaVersion(Realm.defaultPath);

        while (nextSchemaIndex < schemas.length) {

            /*necesario asi, en android problema con permisos de escritura (realm 1.0.0)  */

            let migratedRealm = new Realm({ ...schemas[nextSchemaIndex] });
            nextSchemaIndex++;

            migratedRealm.close();
        }

        this.realm = new Realm(schemas[schemas.length - 1]);
    }

    getRealm = () => {

        return this.realm;
    }

    initialMigration = (oldRealm, newRealm) => {
        newRealm.create('tbGeneral', { id: 0, terminal: 1, host: '192.168.1.1', port: 8080, lotes: false })

    }

    deleteAll = () => {
        //todo menos TbGeneral
        const almacen = this.realm.objects('tbAlmacen');
        const articulo = this.realm.objects('tbArticulo');
        const codBarra = this.realm.objects('tbCodBarra');
        const lotes = this.realm.objects('tbLotes');
        const inventario = this.realm.objects('tbInventario');

        this.realm.write(() => {
            this.realm.delete(almacen);
            this.realm.delete(articulo);
            this.realm.delete(codBarra);
            this.realm.delete(lotes);
            this.realm.delete(inventario);
        })

    }
    /*** console.log(para pruebas) ***/

    createDumyData = () => {
        //todo menos TbGeneral

        this.realm.write(() => {
            this.realm.create('tbAlmacen', { codigo: 0, descripcion: 'Almacen1' })
            this.realm.create('tbAlmacen', { codigo: 1, descripcion: 'Almacén n' })

            this.realm.create('tbArticulo', { codigo: '1000', descripcion: 'cosa 1', loteable: false })
            this.realm.create('tbArticulo', { codigo: '2000', descripcion: 'producto 2', loteable: false })
            this.realm.create('tbArticulo', { codigo: '3000', descripcion: 'comestible 3', loteable: false })
            this.realm.create('tbArticulo', { codigo: '0192', descripcion: 'comestible extra', loteable: true })
            this.realm.create('tbArticulo', { codigo: '7093', descripcion: 'Sardinas', loteable: true })
            this.realm.create('tbArticulo', { codigo: '5000', descripcion: 'Leche', loteable: true })

            this.realm.create('tbLotes', { pk: '04000lote1', lote: 'lote1', almacen: 0, articulo: '5000', existencias: 5 })
            this.realm.create('tbLotes', { pk: '07093lote2', lote: '180912', almacen: 0, articulo: '7093', existencias: 10 })
            this.realm.create('tbLotes', { pk: '17093180912', lote: 'lote3', almacen: 1, articulo: '0192', existencias: 20 })
            this.realm.create('tbLotes', { pk: '04000lote4', lote: 'lote4', almacen: 0, articulo: '5000', existencias: 30 })
            this.realm.create('tbLotes', { pk: '04000lote5', lote: 'lote5', almacen: 0, articulo: '5000', existencias: 31 })
            this.realm.create('tbLotes', { pk: '04000lote6', lote: 'lote6', almacen: 1, articulo: '5000', existencias: 55 })
            this.realm.create('tbLotes', { pk: '04000lote7', lote: 'lote7', almacen: 1, articulo: '5000', existencias: 77 })
            this.realm.create('tbLotes', { pk: '04000lote8', lote: 'lote8', almacen: 1, articulo: '5000', existencias: 48 })
            this.realm.create('tbLotes', { pk: '05000lote1', lote: 'lote1', almacen: 0, articulo: '5000', existencias: 50 })

            this.realm.create('tbCodBarra', { codigo: '01084139077093101518090010180912', articulo: '7093' })
            this.realm.create('tbCodBarra', { codigo: '18435477900192', articulo: '0192' })

        })
    }
    printData = () => {

        console.log('========database.js printData()==========')
        console.log('========almacen==========')
        console.log(realm.objects('tbAlmacen'))
        console.log('========articulo==========')
        console.log(realm.objects('tbArticulo'))
        console.log('========lotes==========')
        console.log(realm.objects('tbLotes'))
        console.log('========inventario==========')
        console.log(realm.objects('tbInventario'))
        console.log('========END printData()==========')

    }

}

/*** Simula singleton, para evitar varias instancias***/
const database = new Database();
const realm = database.getRealm();

class TbGeneral {

    update = (terminal, host, port, lotes) => {

        realm.write(() => {
            realm.create('tbGeneral', { id: 0, terminal, host, port, lotes }, true)
        })
    }

    get = (item = -1) => {
        if (item === -1)
            return realm.objectForPrimaryKey('tbGeneral', 0)
        else
            return realm.objectForPrimaryKey('tbGeneral', 0).lotes
    }

}

class TbAlmacen {

    insert = (items = []) => {

        realm.write(() => {
            items.map((item) => {
                realm.create('tbAlmacen', { codigo: item.codigo, descripcion: item.descripcion })
            })
        })
    }

    deleteAll = () => {

        const almacen = realm.objects('tbAlmacen');
        realm.write(() => {
            realm.delete(almacen);
        })
    }

    get = (codigo = -1) => {

        if (codigo === -1)
            return Object.values(realm.objects('tbAlmacen'));

        return realm.objectForPrimaryKey('tbAlmacen', codigo);

    }

}


class TbArticulo {

    insert = (items = []) => {

        realm.write(() => {
            items.map((item) => {
                realm.create('tbArticulo', { codigo: item.codigo, descripcion: item.descripcion, loteable: item.loteable })
            })
        })

    }

    deleteAll = () => {

        const articulos = realm.objects('tbArticulo');
        realm.write(() => {
            realm.delete(articulos);
        })
    }

    get = (codigo = -1) => {

        if (codigo === -1)
            return Object.values(realm.objects('tbArticulo'));

        return realm.objectForPrimaryKey('tbArticulo', codigo);

    }

}

class TbCodBarra {

    insert = (items = []) => {

        realm.write(() => {
            items.map((item) => {
                realm.create('tbCodBarra', { articulo: item.articulo, codigo: item.codigo, descripcion: item.descripcion })
            })
        })

    }

    deleteAll = () => {

        const codBarras = database.objects('tbCodBarra');
        database.write(() => {
            database.delete(codBarras);
        })
    }

    get = (codigo = -1) => {


        if (codigo === -1)
            return database.objects('tbCodBarra');

        return database.objectForPrimaryKey('tbCodBarra', codigo);

    }

}


class TbLotes {

    insert = (items = []) => {

        database.write(() => {
            items.map((item) => {
                database.create('tbLotes', { almacen: item.almacen, articulo: item.articulo, lote: item.lote, existencias: item.existencias })
            })
        })

    }

    deleteAll = () => {

        const lotes = realm.objects('tbLotes');
        realm.write(() => {
            realm.delete(lotes);
        })
    }


    get = (queries = -1) => {
        if (queries === -1)
            return Object.values(realm.objects('tbLotes'));

        let lotes = realm.objects('tbLotes').filtered(`articulo='${queries.articulo}' AND almacen=${queries.almacen}`)

        return Object.values(lotes)

    }
    getFromLote = (almacen, articulo, loteid) => {
        let lotes = realm.objects('tbLotes').filtered(`articulo='${articulo.codigo}' AND almacen = ${almacen.codigo} AND lote='${loteid}'`)
        return Object.values(lotes)
    }

}

class TbInventario {

    insert = (items = []) => {

        console.log('TbInventario insert')
        realm.write(() => {
            items.map((item) => {
                const { almacen, articulo, lote, fecha = new Date(), cantidad = 1 } = item
                const pk = almacen.codigo.toString() + articulo.codigo + lote.lote
                const previousItem = realm.objectForPrimaryKey('tbInventario', pk)
                console.log('previousItem')
                console.log(previousItem)
                if (previousItem) {
                    console.log('increase')
                    previousItem.cantidad += parseInt(cantidad)
                    previousItem.fecha = new Date();

                } else {
                    if ((typeof lote.articulo) == 'number')
                        lote.articulo = lote.articulo.toString()
                    console.log('insert')
                    console.log('almacen')
                    console.log(almacen)
                    console.log('articulo')
                    console.log(articulo)
                    console.log('lote')
                    console.log(lote)

                    realm.create('tbInventario', { pk, fecha, almacen, articulo, lote, cantidad: parseInt(cantidad) }, true)

                }
            })

        })
    }

    delete = (pk) => {
        //como se ha listado, se posee pk
        const item = realm.objectForPrimaryKey('tbInventario', pk)
        realm.write(() => {
            realm.delete(item);
        })
    }

    deleteAll = () => {
        const inventario = realm.objects('tbInventario');
        realm.write(() => {
            realm.delete(inventario);
        })
    }
    /*** === === === === === === === === === === === === === === === === === ***/
    /*** === === === === === === ===editar update=== === === === === === === ***/
    /*** === === === === === === === === === === === === === === === === === ***/

    update = (pk, cantidad) => {
        realm.write(() => {
            realm.create('tbInventario', {
                pk,
                cantidad: parseInt(cantidad)
            }, true);
        });

    }

    get = (almacen, articulo) => {
        //if id undefined get all

        return realm.objects('tbInventario').filtered(`almacen = "${almacen}" AND articulo = "${articulo}"`);

    }
    getAll = (almacen) => {
        const items = realm.objects('tbInventario').filtered(`almacen.codigo=${almacen.codigo}`).sorted('fecha').sorted('fecha', true)

        return (items)
    }

    getLast = (almacen) => {

        const rawitems = realm.objects('tbInventario')

        if (Object.keys(rawitems).length !== 0) {
            const items = rawitems.filtered(`almacen.codigo=${almacen.codigo}`).sorted('fecha', true)

            return items[0]
        }

        return false;

    }
}

export { database, TbGeneral, TbAlmacen, TbArticulo, TbCodBarra, TbLotes, TbInventario };
