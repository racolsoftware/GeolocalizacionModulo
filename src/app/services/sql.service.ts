/* eslint-disable no-trailing-spaces */
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/SQLite/ngx';
@Injectable({
  providedIn: 'root',
})
export class SqlService {
  indexedDB: any = window.indexedDB;
  db: any;

  constructor(private sqlite: SQLite) {}

  openIndexDB() {
    this.db = indexedDB.open('GeolocationModule', 3);
    this.db.onerror = (evt) => {
      console.log('Database error code: ' + evt);
    };

    this.db.onupgradeneeded = (evt) => {
      console.log('ya db');
      const dbActive = evt.target.result;
      try {
        const objectStore = dbActive.createObjectStore('location', {
          keyPath: 'id',
          autoIncrement: true,
        });

        objectStore.createIndex('id', 'id', { unique: true });
        objectStore.createIndex('codVend', 'codVend', { unique: false });
        objectStore.createIndex('codCli', 'codCli', { unique: false });
        objectStore.createIndex('latitud', 'latitud', { unique: false });
        objectStore.createIndex('longitud', 'longitud', { unique: false });
        objectStore.createIndex('status', 'status', { unique: false });
      } catch (error) {}
      try {
        const objectStore = dbActive.createObjectStore('clientes', {
          keyPath: 'Codigo',
          // autoIncrement: true,
        });

        objectStore.createIndex('Codigo', 'Codigo', { unique: true });
        objectStore.createIndex('Direccion', 'Direccion', { unique: false });
        objectStore.createIndex('Estado', 'Estado', { unique: false });
        objectStore.createIndex('FechaVisitada', 'FechaVisitada', { unique: false });
        objectStore.createIndex('Latitud', 'Latitud', { unique: false });
        objectStore.createIndex('Longitud', 'Longitud', { unique: false });
        objectStore.createIndex('LatitudVisito', 'LatitudVisito', { unique: false });
        objectStore.createIndex('LongitudVisito', 'LongitudVisito', { unique: false });
        objectStore.createIndex('Nombre', 'Nombre', { unique: false });
        objectStore.createIndex('NombreVend', 'NombreVend', { unique: false });
        objectStore.createIndex('RazonSocial', 'RazonSocial', { unique: false });
        objectStore.createIndex('Telefono', 'Telefono', { unique: false });
        objectStore.createIndex('Visito', 'Visito', { unique: false });
      } catch (error) {}
    };
  }

  loadDB(db: string): any {
    return new Promise((resolve, reject) => {
      console.log('ini prome');
      this.db = indexedDB.open(db);
      this.db.onerror = (evt) => {
        console.log('Database error code: ' + evt);
      };
      this.db.onsuccess = (evt) => {
        this.db = evt.target.result;
        console.log('db abrio');
        resolve(this.db);
      };
    });
  }
  async addObject(dbName: string, object: string, value: any) {
    return new Promise(async (resolve, reject) => {
      const dbActive = await this.loadDB(dbName);
      const transaction = dbActive.transaction(object, 'readwrite'); // (1)

      //Manejando los errores.
      transaction.onerror = (e) => {
        alert(request.error.name + '\n\n' + request.error.message);
      };

      transaction.oncomplete = (e) => {
        console.log('Se ha guardado correctamente', request.result);
      };

      // get an object store to operate on it
      const objectTake = transaction.objectStore(object); // (2)

      const request = objectTake.put(value); // (3)

      request.onsuccess = () => {
        // (4)
        console.log('Object added to the store', request.result);
        resolve(request.result);
      };

      request.onerror = () => {
        console.log('Error', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Permite listar todos los datos digitados.
   */
  async listData(dbName: string, object: string) {
    return new Promise(async (resolve, reject) => {
      const dbActive = await this.loadDB(dbName);
      const data = dbActive.transaction([object]);
      const objetos = data.objectStore(object);
      let contador = 0;

      // eslint-disable-next-line prefer-const
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const datos_recuperados = [];

      //abriendo el cursor.
      objetos.openCursor().onsuccess = (e) => {
        //recuperando la posicion del cursor
        const cursor = e.target.result;
        if (cursor) {
          contador++;
          //recuperando el objeto.
          datos_recuperados.push(cursor.value);

          //Función que permite seguir recorriendo el cursor.
          cursor.continue();
        } else {
          console.log('La cantidad de registros recuperados es: ' + contador);
        }
      };

      //Una vez que se realiza la operación llamo la impresión.
      data.oncomplete = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        resolve(datos_recuperados);
        // this.imprimirTabla(estudiantes_recuperados);
      };
      data.onerror = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        reject(new Error(`Script load error `));
        // this.imprimirTabla(estudiantes_recuperados);
      };
    });
  }


  async searchDataList(dbName: string, object: string,index: [] ,value: any) {
    return new Promise(async (resolve, reject) => {
      const dbActive = await this.loadDB(dbName);
      const data = dbActive.transaction([object]);
      const objetos = data.objectStore(object);
      let contador = 0;

      // eslint-disable-next-line prefer-const
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const datos_recuperados = [];

      //abriendo el cursor.
      objetos.openCursor().onsuccess = (e) => {
        //recuperando la posicion del cursor
        const cursor = e.target.result;
        if (cursor) {

          let stringBuild = '';
          index.forEach((element, i) => {
            if(i===0){
              stringBuild += cursor.value[element];
            }else{
              stringBuild += ' '+ cursor.value[element];
            }

          });
          if(stringBuild.indexOf(value)){
            contador++;
            datos_recuperados.push(cursor.value);
          }
          //recuperando el objeto.



          //Función que permite seguir recorriendo el cursor.
          cursor.continue();
        } else {
          console.log('La cantidad de registros recuperados es: ' + contador);
        }
      };

      //Una vez que se realiza la operación llamo la impresión.
      data.oncomplete = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        resolve(datos_recuperados);
        // this.imprimirTabla(estudiantes_recuperados);
      };
      data.onerror = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        reject(new Error(`Script load error `));
        // this.imprimirTabla(estudiantes_recuperados);
      };
    });
  }

  /**
   *
   */
  async getObjectById(dbName: string, object: string, value: any) {
    return new Promise(async (resolve, reject) => {
      const dbActive = await this.loadDB(dbName);
      const data = dbActive.transaction([object]);
      const objetos = data.objectStore(object);

      // eslint-disable-next-line prefer-const
      // eslint-disable-next-line @typescript-eslint/naming-convention
      let aux;

      //abriendo el cursor.
      objetos.get(value).onsuccess = (e) => {
        const resultado = e.target.result;
        console.log('los datos: ' + resultado);
        console.log(resultado);

        if (resultado !== undefined) {
          aux = resultado;
        } else {
          aux = null;
        }
      };
      //Una vez que se realiza la operación llamo la impresión.
      data.oncomplete = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        resolve(aux);
        // this.imprimirTabla(estudiantes_recuperados);
      };
      data.onerror = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        reject(new Error(`Script load error `));
        // this.imprimirTabla(estudiantes_recuperados);
      };
    });
  }

  async getObjectByIndex(
    dbName: string,
    object: string,
    index: string,
    value: any
  ) {
    return new Promise(async (resolve, reject) => {
      const dbActive = await this.loadDB(dbName);
      const data = dbActive.transaction([object]);
      const objetos = data.objectStore(object);

      let contador = 0;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const datos_recuperados = [];

      //buscando la referencia por el indice.
      const indice = objetos.index(index);

      //determinando la forma de la consulta
      const singleKeyRange = IDBKeyRange.only(value);

      //abriendo el cursor.
      indice.openCursor(singleKeyRange).onsuccess = (e) => {
        //recuperando la posicion del cursor
        const cursor = e.target.result;
        if (cursor) {
          contador++;
          //recuperando el objeto.
          datos_recuperados.push(cursor.value);

          //Función que permite seguir recorriendo el cursor.
          cursor.continue();
        } else {
          console.log('La cantidad de registros recuperados es: ' + contador);
        }
      };

      //Una vez que se realiza la operación llamo la impresión.
      data.oncomplete = () => {
        resolve(datos_recuperados);
      };
      data.onerror = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        reject(new Error(`Script load error `));
      };
    });
  }

  async deleteObject(dbName: string, object: string, value: any) {
    return new Promise(async (resolve, reject) => {
      const dbActive = await this.loadDB(dbName);
      const data = this.db.transaction([object], 'readwrite');
      const estudiantes = data.objectStore(object);

      estudiantes.delete(value).onsuccess = (e) => {
        resolve(true);
      };
    });
  }

  async changeObject(dbName: string, object: string, id: any, value: any) {
    return new Promise(async (resolve, reject) => {
      const dbActive = await this.loadDB(dbName);
      const data = dbActive.transaction([object],'readwrite');
      const objetos = data.objectStore(object);

      // eslint-disable-next-line prefer-const
      // eslint-disable-next-line @typescript-eslint/naming-convention
      let aux;

      //abriendo el cursor.
      objetos.get(id).onsuccess = (e) => {
        const resultado = e.target.result;
        console.log('los datos: ' + resultado);
        console.log(resultado);

        if (resultado !== undefined) {
          // eslint-disable-next-line guard-for-in
          for (const key in value) {
            resultado[key] = value[key];
          }

          aux = resultado;

          const solicitudUpdate = objetos.put(resultado);

          //eventos.
          solicitudUpdate.onsuccess = () => {
            console.log('Datos Actualizados....');
          };

          solicitudUpdate.onerror = () => {
            console.error('Error Datos Actualizados....');
          };
        } else {
          aux = null;
        }
      };
      //Una vez que se realiza la operación llamo la impresión.
      data.oncomplete = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        resolve(aux);
        // this.imprimirTabla(estudiantes_recuperados);
      };
      data.onerror = () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        reject(new Error(`Script load error `));
        // this.imprimirTabla(estudiantes_recuperados);
      };
    });
  }

  startSql() {
    //  try {
    //   this.sqlite.create({
    //     name: 'GeolocationModule.db',
    //     location: 'default'
    //   })
    //     .then((db: SQLiteObject) => {

    //       console.log('se creo');
    //       db.executeSql('create table locationTake(name letCHAR(32))', [])
    //         .then(() => console.log('Executed SQL'))
    //         .catch(e => console.log(e));

    //     })
    //     .catch(e => console.log(e));
    //  } catch (error) {

    //  }
    this.openIndexDB();
  }
}
