import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/SQLite/ngx';
@Injectable({
  providedIn: 'root'
})
export class SqlService {

  indexedDB: any =  window.indexedDB;
  db: any;

  constructor(private sqlite: SQLite) {

   }


   openIndexDB(){


    this.db = indexedDB.open('GeolocationModule',1);
    this.db.onerror = (evt) => {
      console.log('Database error code: ' + evt);
    };

    this.db.onupgradeneeded =  (evt) => {
      console.log('ya db');
      const dbActive = this.db.result;
      const objectStore = dbActive.
      createObjectStore('location', { keyPath: 'id', autoIncrement: true });

      objectStore.createIndex('id', 'id', { unique: true });
      objectStore.createIndex('codVend', 'codVend', { unique: false });
      objectStore.createIndex('codCli', 'codCli', { unique: false });
      objectStore.createIndex('latitud', 'latitud', { unique: false });
      objectStore.createIndex('longitud', 'longitud', { unique: false });
      objectStore.createIndex('status', 'status', { unique: false });



  };

   }


   loadDB(){

   }
  addObject( object: string, value: any){
    this.loadDB();
    this.db = indexedDB.open('GeolocationModule',1);
    this.db.onerror = (evt) => {
      console.log('Database error code: ' + evt);
    };

    this.db.onSuccess =  (evt) => {
      console.log('ya db');


      console.log('agregar vvv');
      const dbActive = this.db.result;

     const transaction = dbActive.transaction(object, 'readwrite'); // (1)

   //Manejando los errores.
   transaction.onerror =  (e) => {
     alert(request.error.name + '\n\n' + request.error.message);
 };

   transaction.oncomplete =  (e) => {
       alert('Objeto agregado correctamente');
   };



     // get an object store to operate on it
     const objectTake = transaction.objectStore(object); // (2)

     const request = objectTake.put(value); // (3)

     request.onsuccess = () => { // (4)
       console.log('Object added to the store', request.result);
     };

     request.onerror = () => {
       console.log('Error', request.error);
     };

  };

   }

   startSql(){
    //  try {
    //   this.sqlite.create({
    //     name: 'GeolocationModule.db',
    //     location: 'default'
    //   })
    //     .then((db: SQLiteObject) => {


    //       console.log('se creo');
    //       db.executeSql('create table locationTake(name VARCHAR(32))', [])
    //         .then(() => console.log('Executed SQL'))
    //         .catch(e => console.log(e));


    //     })
    //     .catch(e => console.log(e));
    //  } catch (error) {

    //  }
     this.openIndexDB();
   }

}

