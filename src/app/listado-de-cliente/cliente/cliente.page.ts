import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { Geolocation,  PositionError, Geoposition  } from '@ionic-native/geolocation/ngx';
import { InAppBrowser,InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { AppComponent } from 'src/app/app.component';
import { SqlService } from 'src/app/services/sql.service';
import { element } from 'protractor';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {
  orderby: string;
  cantidad = 1;
  unidades = [{nombre: 'caja', unidad: 2}, {nombre: 'unidad', unidad: 1}];
  descripcion = 'Cargando cliente...';
  descripcion2 = 'Cargando...';
  codigo = '';
  default = 1;
  direccion = '';
  telefono = '';
  latitude = 0;
  longitude = 0;
  saveUbi= false;
  showUbi=false;
  load= false;
  visite=false;
  upload=true;
  fecha: any;
  countTimeout=0;
  takeLocation = false;


  constructor(private geolocation: Geolocation,
      public alertController: AlertController,
    private route: ActivatedRoute, public sqlservices: DataService,
     private platform: Platform,
     private inAppBrowser: InAppBrowser) {

      }


  async ngOnInit() {
    this.route.queryParams
    .subscribe(async params => {
      console.log(params); // { orderby: "price" }
      this.orderby = params.codigo;
      if(params.action!== undefined){
        const statu = await this.loadClienteWait(params.codigo);
        console.log('ya termino todo el proces');
        if(statu === true && this.showUbi && this.visite!==true){
          switch (params.action) {
            case 'saveForceUbi':
              this.load = true;
              this.takeLocation = false;

              console.log(this.latitude +'-'+this.longitude);

              this.geolocation.watchPosition().subscribe( async  (data) => {
              // data can be a set of coordinates, or an error (if an error occurred).
              // data.coords.latitude
              // data.coords.longitude
              console.log('watch start');
              console.log(data.coords);
              this.latitude = data.coords.latitude;
              this.longitude = data.coords.longitude;
              this.takeLocation= true;

              }, (error) => {

                console.log(error);
                console.log(this.latitude +'-'+this.longitude);
              });
              this.load = false;
              this.countTimeout=0;
              this.saveUbiForce();


              break;
            case 'saveAskUbi':
              this.visitoCliente();
              console.log('entro a guardar ante');

                break;
            default:
              console.log(this.orderby); // price
          this.loadCliente(params.codigo);
              break;
          }
        }

      }else{
        console.log(this.orderby); // price
        this.loadCliente(params.codigo);
      }

    }
  );
}


async saveUbiForce(){

  console.log('Confirm Okay');
  if(this.takeLocation===true){

  AppComponent.startLoading();
console.log('navigate visi clicked!');
const jsonDv = {
codVend : this.sqlservices.getCodVend(),
codCli : this.codigo,
latitud: this.latitude,
longitud: this.longitude,
date: new Date().toISOString(),
status: 0
};
const id = await this.sqlservices.sqlLocal.addObject('GeolocationModule','location',jsonDv);
// eslint-disable-next-line @typescript-eslint/naming-convention
this.sqlservices.setUbicacionVisitoVendedor(jsonDv).subscribe(
async (Data: any) => {

// const vari = await this.sqlservices.sqlLocal.getObjectById('GeolocationModule','location',id);
await this.sqlservices.sqlLocal.changeObject('GeolocationModule','location',id,{status: 1});

console.log(Data);
console.log(Data.objeto);
console.log(Data);
console.log(Data.objeto);

// if(Data.resultado === 1){
Data.objeto.forEach(async element => {

await this.sqlservices.sqlLocal.changeObject('GeolocationModule','clientes',element.Codigo,element);
// eslint-disable-next-line @typescript-eslint/naming-convention
await this.sqlservices.sqlLocal.changeObject('GeolocationModule','location',id,{CodigoVisitaLog: element.CodigoVisitaLog});
this.descripcion = element.RazonSocial;
this.descripcion2 = element.Nombre;
this.codigo = element.Codigo;
this.direccion = element.Direccion;
this.telefono = element.Telefono;
try {
this.fecha = element.FechaVisitada.date;

} catch (error) {

  console.log(error);
}
if(element.Latitud !== '' && element.Longitud !== ''){
this.latitude = element.Latitud;
this.longitude =element.Longitud;
this.showUbi = true;
this.saveUbi = false;
if(element.Visito !== '0'){
this.visite = true;
this.upload = true;
} else{
let listNoSend: any;
// eslint-disable-next-line prefer-const
listNoSend = await this.sqlservices.sqlLocal.getObjectByIndex('GeolocationModule','location','status',0);
listNoSend.forEach(element => {
  const dateAux = new Date(element.date);
  if (dateAux.toISOString().substring(0, 10)=== new Date().toISOString().substring(0, 10)
  && element.codCli === this.codigo) {
    this.visite = true;
    this.upload = false;
    this.fecha = dateAux.toISOString();
    return;
  } else {
    this.upload = false;

  }
});
}

}else{
this.showUbi = false;
this.saveUbi = true;
this.upload = false;

}

await this.uploadLocationNoSend();
this.load = false;

this.presentAlert();
});
}, async (error) =>{
this.errorAlert('No se puede utilizar la geolocalizacion');

this.showUbi = true;
this.saveUbi = false;



let listNoSend: any;
// eslint-disable-next-line prefer-const
listNoSend = await this.sqlservices.sqlLocal.getObjectByIndex('GeolocationModule','location','status',0);
listNoSend.forEach(elem => {
  const dateAux = new Date(elem.date);
  if (dateAux.toISOString().substring(0, 10)=== new Date().toISOString().substring(0, 10)
  && elem.codCli === this.codigo) {
    this.visite = true;
    this.upload = false;
    this.fecha = dateAux.toISOString();
    console.log('hay local');
    return;
  } else {

    this.upload = false;
    console.log('no hay local');
  }
});

});
}
else{
  let aux: any;
    const url = localStorage.getItem('conf');
    if (url !== null) {
      aux = JSON.parse(url);
    } else {
      aux = {posiTime:5};
      localStorage.setItem('conf',JSON.stringify(aux));
    }
if(this.countTimeout<aux.posiTime){
  setTimeout(() => {
    this.saveUbiForce();
  }, 400);
  this.countTimeout+=1;
}else{
  this.countTimeout=0;
  this.errorAlert('Se ha producido un error al tomar la ubicacion, intentelo de nuevo');
}
}
}



openMap(latitud: any, longitud: any){
  const location = latitud + ',' + longitud;
  const url = 'https://www.google.com/maps/dir/?api=1&destination=' + latitud + ',' + longitud;
  const options: InAppBrowserOptions = {
    zoom: 'no'
  };

  // Opening a URL and returning an InAppBrowserObject
  const browser = this.inAppBrowser.create(url, '_system', options);
  //  window.open(url, '_system', 'location=yes');
}
getdate(val: string){
  let date = new Date(val);



return date.toLocaleString('en-US');

}

//Carga toda la informacion del cliente

  async loadClienteOffline(aux: string){



// if(Data.resultado === 1){

  const element: any = await this.sqlservices.sqlLocal.getObjectById('GeolocationModule','clientes',aux);
  if(element !== null){
  // if(client !== null){
  //   await this.sqlservices.sqlLocal.changeObject('GeolocationModule','clientes',element.Codigo,element);
  // }else{
  //   const id = await this.sqlservices.sqlLocal.addObject('GeolocationModule','clientes',element);
  // }
  this.descripcion = element.RazonSocial;
  this.descripcion2 = element.Nombre;
  this.codigo = element.Codigo;
  this.direccion = element.Direccion;
  this.telefono = element.Telefono;
  try {
    this.fecha = element.FechaVisitada.date;
    console.log(this.fecha);
  } catch (error) {

  }
  if(element.Latitud !== '' && element.Longitud !== ''){
    this.latitude = element.Latitud;
    this.longitude =element.Longitud;
    this.showUbi = true;
    this.saveUbi = false;


    if(element.Visito !== '0'){
      this.visite = true;
      this.upload = true;
    }else{
      let listNoSend: any;
      // eslint-disable-next-line prefer-const
      listNoSend = await this.sqlservices.sqlLocal.getObjectByIndex('GeolocationModule','location','status',0);
      listNoSend.forEach(elem => {
        const dateAux = new Date(elem.date);
        if (dateAux.toISOString().substring(0, 10)=== new Date().toISOString().substring(0, 10)
        && elem.codCli === this.codigo) {
          this.visite = true;
          this.upload = false;
          this.fecha = dateAux.toISOString();
          console.log('hay local');
          return;
        } else {

          this.upload = false;
          console.log('no hay local');
        }
      });
    }
  }else{


this.showUbi = false;
    this.saveUbi = true;
    this.upload = false;
  }
  console.log('ya fi');

AppComponent.stopLoading();
  }else{
    this.descripcion = 'Error';
  this.descripcion2 = 'Error al buscar al cliente';
  this.showUbi = false;
  this.saveUbi = false;
  this.visite = false;

  }

}

loadCliente(aux: number){
  AppComponent.startLoading();
  const jsonDv = {
    codVend : '1',
    codCli : aux
  };

  this.sqlservices.getCliente(jsonDv).subscribe( async (Data: any)=>{


    console.log(Data);
    console.log(Data.objeto);

  // if(Data.resultado === 1){
  Data.objeto.forEach(async element => {
    const client = await this.sqlservices.sqlLocal.getObjectById('GeolocationModule','clientes',element.Codigo);
    if(client !== null){
      await this.sqlservices.sqlLocal.changeObject('GeolocationModule','clientes',element.Codigo,element);
    }else{
      const id = await this.sqlservices.sqlLocal.addObject('GeolocationModule','clientes',element);
    }
    this.descripcion = element.RazonSocial;
    this.descripcion2 = element.Nombre;
    this.codigo = element.Codigo;
    this.direccion = element.Direccion;
    this.telefono = element.Telefono;
    try {
      this.fecha = element.FechaVisitada.date;
      console.log(this.fecha);
    } catch (error) {

    }
    if(element.Latitud !== '' && element.Longitud !== ''){
      this.latitude = element.Latitud;
      this.longitude =element.Longitud;
      this.showUbi = true;
      this.saveUbi = false;


      if(element.Visito !== '0'){
        this.visite = true;
        this.upload = true;
      }else{
        let listNoSend: any;
        // eslint-disable-next-line prefer-const
        listNoSend = await this.sqlservices.sqlLocal.getObjectByIndex('GeolocationModule','location','status',0);
        listNoSend.forEach(elem => {
          const dateAux = new Date(elem.date);
          if (dateAux.toISOString().substring(0, 10)=== new Date().toISOString().substring(0, 10)
          && elem.codCli === this.codigo) {
            this.visite = true;
            this.upload = false;
            this.fecha = dateAux.toISOString();
            console.log('hay local');
            return;
          } else {

            this.upload = false;
            console.log('no hay local');
          }
        });
      }
    }else{


  this.showUbi = false;
      this.saveUbi = true;
      this.upload = false;
    }
    console.log('ya fi');

  });

  AppComponent.stopLoading();
  }, (error) => {
    this.errorAlert('No se ha podido sincronizar con el servidor, intente mas tarde');
    this.loadClienteOffline('' + aux);
  });
}
loadClienteWait(aux: number){
  return new Promise((resolve,reject)=>{

    AppComponent.startLoading();
    const jsonDv = {
      codVend : '1',
      codCli : aux
    };

    this.sqlservices.getCliente(jsonDv).subscribe( async (Data: any)=>{


      console.log(Data);
      console.log(Data.objeto);

    // if(Data.resultado === 1){
    Data.objeto.forEach(async element => {
      const client = await this.sqlservices.sqlLocal.getObjectById('GeolocationModule','clientes',element.Codigo);
      if(client !== null){
        await this.sqlservices.sqlLocal.changeObject('GeolocationModule','clientes',element.Codigo,element);
      }else{
        const id = await this.sqlservices.sqlLocal.addObject('GeolocationModule','clientes',element);
      }
      this.descripcion = element.RazonSocial;
      this.descripcion2 = element.Nombre;
      this.codigo = element.Codigo;
      this.direccion = element.Direccion;
      this.telefono = element.Telefono;
      try {
        this.fecha = element.FechaVisitada.date;
        console.log(this.fecha);
      } catch (error) {

      }
      if(element.Latitud !== '' && element.Longitud !== ''){
        this.latitude = element.Latitud;
        this.longitude =element.Longitud;
        this.showUbi = true;
        this.saveUbi = false;

        if(element.Visito !== '0'){
          this.visite = true;
          this.upload = true;
        }else{
          let listNoSend: any;
          // eslint-disable-next-line prefer-const
          listNoSend = await this.sqlservices.sqlLocal.getObjectByIndex('GeolocationModule','location','status',0);
          listNoSend.forEach(elem => {
            const dateAux = new Date(elem.date);
            if (dateAux.toISOString().substring(0, 10)=== new Date().toISOString().substring(0, 10)
            && elem.codCli === this.codigo) {
              this.visite = true;
              this.upload = false;
              this.fecha = dateAux.toISOString();
              console.log('hay local');
              return;
            } else {

              this.upload = false;
              console.log('no hay local');
            }
          });
          resolve(true);
        }
      }else{

    this.showUbi = false;
        this.saveUbi = true;
        this.upload = false;
      }
      resolve(true);
      console.log('ya fi');

    });


    AppComponent.stopLoading();
    }, (error) => {
      this.errorAlert('No se ha podido sincronizar con el servidor, intente mas tarde');
      this.loadClienteOffline('' + aux);
      reject(error);
    });
  });
}
async updateFechaNube(){
  try {
  const au = await this.uploadLocationNoSend();
  if(au===false){
    this.presentAlert();
    this.loadCliente(parseInt(this.codigo, 10));
    this.upload = true;
  }else{
    this.upload = false;
    this.load = false;
    this.errorAlert('Error al subir los datos. Valide la conexion de internet');
  }

  } catch (error) {
    this.upload = false;
    this.load = false;
    this.errorAlert('Error al subir los datos. Valide la conexion de internet');
  }

}

async visitoCliente(){
  this.load = true;
  let takeLocation = false;
  console.log('entro');

  console.log(this.latitude +'-'+this.longitude);

  this.geolocation.watchPosition().subscribe( async  (data) => {
   // data can be a set of coordinates, or an error (if an error occurred).
   // data.coords.latitude
   // data.coords.longitude
   console.log('watch start');
   console.log(data.coords);
   this.latitude = data.coords.latitude;
   this.longitude = data.coords.longitude;
   takeLocation= true;

  }, (error) => {

    console.log(error);
    console.log(this.latitude +'-'+this.longitude);
  });
  this.load = false;


  const alertConfirm = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Confirmacion!',
    message: 'Message <strong>¿Esta seguro de registrar la visita?</strong>',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        id: 'cancel-button',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      },

      {
        text: 'Registrar',
        id: 'confirm-button',
        handler: async () => {
          console.log('Confirm Okay');
          if(takeLocation===true){

          AppComponent.startLoading();
  console.log('navigate visi clicked!');
  const jsonDv = {
    codVend : this.sqlservices.getCodVend(),
    codCli : this.codigo,
    latitud: this.latitude,
    longitud: this.longitude,
    date: new Date().toISOString(),
    status: 0
  };
  const id = await this.sqlservices.sqlLocal.addObject('GeolocationModule','location',jsonDv);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  this.sqlservices.setUbicacionVisitoVendedor(jsonDv).subscribe(
    async (Data: any) => {

    // const vari = await this.sqlservices.sqlLocal.getObjectById('GeolocationModule','location',id);
    await this.sqlservices.sqlLocal.changeObject('GeolocationModule','location',id,{status: 1});

    console.log(Data);
    console.log(Data.objeto);
    console.log(Data);
    console.log(Data.objeto);

  // if(Data.resultado === 1){
  Data.objeto.forEach(async element => {

    await this.sqlservices.sqlLocal.changeObject('GeolocationModule','clientes',element.Codigo,element);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    await this.sqlservices.sqlLocal.changeObject('GeolocationModule','location',id,{CodigoVisitaLog: element.CodigoVisitaLog});
    this.descripcion = element.RazonSocial;
    this.descripcion2 = element.Nombre;
    this.codigo = element.Codigo;
    this.direccion = element.Direccion;
    this.telefono = element.Telefono;
    try {
      this.fecha = element.FechaVisitada.date;

    } catch (error) {

    }
    if(element.Latitud !== '' && element.Longitud !== ''){
      this.latitude = element.Latitud;
      this.longitude =element.Longitud;
      this.showUbi = true;
      this.saveUbi = false;
      if(element.Visito !== '0'){
        this.visite = true;
        this.upload = true;
      } else{
        let listNoSend: any;
        // eslint-disable-next-line prefer-const
        listNoSend = await this.sqlservices.sqlLocal.getObjectByIndex('GeolocationModule','location','status',0);
        listNoSend.forEach(element => {
          const dateAux = new Date(element.date);
          if (dateAux.toISOString().substring(0, 10)=== new Date().toISOString().substring(0, 10)
          && element.codCli === this.codigo) {
            this.visite = true;
            this.upload = false;
            this.fecha = dateAux.toISOString();
            console.log('hay local');
            return;
          } else {

            this.upload = false;
            console.log('no hay local');
          }
        });
      }
    }else{
      this.showUbi = false;
      this.saveUbi = true;
      this.upload = false;

    }

    await this.uploadLocationNoSend();
    this.load = false;
    this.presentAlert();
  });
  }, async (error) =>{
    this.errorAlert('No se puede utilizar la geolocalizacion');

      this.showUbi = true;
      this.saveUbi = false;



        let listNoSend: any;
        // eslint-disable-next-line prefer-const
        listNoSend = await this.sqlservices.sqlLocal.getObjectByIndex('GeolocationModule','location','status',0);
        listNoSend.forEach(elem => {
          const dateAux = new Date(elem.date);
          if (dateAux.toISOString().substring(0, 10)=== new Date().toISOString().substring(0, 10)
          && elem.codCli === this.codigo) {
            this.visite = true;
            this.upload = false;
            this.fecha = dateAux.toISOString();
            console.log('hay local');
            return;
          } else {

            this.upload = false;
            console.log('no hay local');
          }
        });

  });
        }
        else{
      this.errorAlert('Se ha producido un error al tomar la ubicacion, intentelo de nuevo');
    }
      }
    }
    ]
  });
   await alertConfirm.present();




  // this.geolocation.getCurrentPosition().then(async (resp) => {
  //   this.latitude = resp.coords.latitude;
  //   this.longitude = resp.coords.longitude;
  //   console.log('navigate visi clicked!');
  //   const jsonDv = {
  //     codVend : '1',
  //     codCli : this.codigo,
  //     latitud: this.latitude,
  //     longitud: this.longitude
  //   };
  //   // eslint-disable-next-line @typescript-eslint/naming-convention
  //   this.sqlservices.setUbicacionVisitoVendedor(jsonDv).subscribe((Data: any) => {
  //     console.log(Data);
  //     console.log(Data.objeto);
  //     console.log(Data);
  //     console.log(Data.objeto);

  //   // if(Data.resultado === 1){
  //   Data.objeto.forEach(element => {
  //     this.descripcion = element.RazonSocial;
  //     this.descripcion2 = element.Nombre;
  //     this.codigo = element.Codigo;
  //     this.direccion = element.Direccion;
  //     this.telefono = element.Telefono;
  //     try {
  //       this.fecha = element.FechaVisitada.date;

  //     } catch (error) {

  //     }
  //     if(element.Latitud !== '' && element.Longitud !== ''){
  //       this.latitude = element.Latitud;
  //       this.longitude =element.Longitud;
  //       this.showUbi = true;
  //       this.saveUbi = false;
  //       if(element.Visito !== '0'){
  //         this.visite = true;
  //       }
  //     }else{
  //       this.showUbi = false;
  //       this.saveUbi = true;
  //     }
  //     this.presentAlert();
  //   });
  //   });
  //  }).catch((error) => {
  //    console.log('Error getting location', error);
  //    this.errorAlert();
  //  });


}
// sube las fechas que no se ha podido sincronizar anteriormente
async uploadLocationNoSend(){
    return new Promise(async (resolve, reject) => {
      let listNoSend: any;
      let error = false;

      // eslint-disable-next-line prefer-const
      listNoSend = await this.sqlservices.sqlLocal.getObjectByIndex('GeolocationModule', 'location', 'status', 0);

      let count = 0;
      listNoSend.forEach(element => {
        AppComponent.startLoading();
        this.load = true;
        this.upload = false;
        this.sqlservices.setUbicacionVisitoVendedor(element).subscribe(async (Data: any) => {
          await this.sqlservices.sqlLocal.changeObject('GeolocationModule', 'location', element.id, { status: 1 });
          // eslint-disable-next-line max-len
          await this.sqlservices.sqlLocal.changeObject('GeolocationModule', 'location', element.id, { CodigoVisitaLog: element.CodigoVisitaLog });
          this.load = false;
          this.upload = true;
          error = false;
        }, () => {
          error = true;
          this.load = false;
          this.upload = false;
          resolve(error);
        },()=>{
          count+=1;
          if(count===listNoSend.length){

            resolve(false);
          }
        });
      });

      if(listNoSend.length===0){

        resolve(false);
      }

    });

}

 async avisoParaTomarUbicacion() {
  let takeLocation = false;
  console.log('entro click 1');


   this.geolocation.watchPosition().subscribe(  async (resp) => {
    console.log('entro click 2');
 // data can be a set of coordinates, or an error (if an error occurred).
 // data.coords.latitude
 // data.coords.longitude
 this.latitude = resp.coords.latitude;
    this.longitude = resp.coords.longitude;
    takeLocation = true;



});
const alert = await this.alertController.create({
  cssClass: 'my-custom-class',
  header: 'Confirmacion!',
  message: 'Message <strong>¿Esta seguro de guardar esta ubicacion?</strong>!!!',
  buttons: [
    {
      text: 'Cancelar',
      role: 'cancel',
      cssClass: 'secondary',
      id: 'cancel-button',
      handler: (blah) => {
        console.log('Confirm Cancel: blah');
      }
    }, {
      text: 'Ver',
      id: 'show-button',
      handler: () => {
        console.log('Show Okay');
        if(takeLocation===true){
          this.openMap(this.latitude,this.longitude);
        }else{
          this.errorAlert('Se ha producido un error al tomar la ubicacion, intentelo de nuevo');
        }

      }
    },
    {
      text: 'Guardar',
      id: 'confirm-button',
      handler: () => {
        console.log('Confirm Okay');
        if(takeLocation===true){
          this.setUbicacion();
        }else{
          this.errorAlert('Se ha producido un error al tomar la ubicacion, intentelo de nuevo');
        }

      }
    }
  ]
});
await alert.present();
  // this.geolocation.getCurrentPosition().then(async (resp) => {
  //   this.latitude = resp.coords.latitude;
  //   this.longitude = resp.coords.longitude;
  //   const alert = await this.alertController.create({
  //     cssClass: 'my-custom-class',
  //     header: 'Confirmacion!',
  //     message: 'Message <strong>¿Esta seguro de guardar esta ubicacion?</strong>!!!',
  //     buttons: [
  //       {
  //         text: 'Cancelar',
  //         role: 'cancel',
  //         cssClass: 'secondary',
  //         id: 'cancel-button',
  //         handler: (blah) => {
  //           console.log('Confirm Cancel: blah');
  //         }
  //       }, {
  //         text: 'Ver',
  //         id: 'show-button',
  //         handler: () => {
  //           console.log('Show Okay');
  //           this.openMap(this.latitude,this.longitude);
  //         }
  //       },
  //       {
  //         text: 'Guardar',
  //         id: 'confirm-button',
  //         handler: () => {
  //           console.log('Confirm Okay');
  //           this.setUbicacion();
  //         }
  //       }
  //     ]
  //   });

  //   await alert.present();
  //  }).catch((error) => {
  //    console.log('Error getting location', error);
  //    this.errorAlert();
  //  });

}
async presentAlert() {
  const alert = await this.alertController.create({
    header: 'Confirmacion',
    message: 'La ubicacion ha sido guardada Satisfactoriamente',
    buttons: ['Cerrar']
  });
  alert.present();
}

async errorAlert(mensaje: string) {
  const alert = this.alertController.create({
    header: 'Error',
    message: mensaje,
    buttons: ['Cerrar']
  });
   (await alert).present();
}
setUbicacion(){

  const jsonDv = {
    codVend : '1',
    codCli : this.codigo,
    latitud: this.latitude,
    longitud: this.longitude,
    status: 0
  };
  this.sqlservices.setUbicacion(jsonDv).subscribe( (Data: any)=>{

    console.log(Data);
    console.log(Data.objeto);

  // if(Data.resultado === 1){
  Data.objeto.forEach(async element => {
    const client = await this.sqlservices.sqlLocal.getObjectById('GeolocationModule','clientes',element.Codigo);
    if(client !== null){
      await this.sqlservices.sqlLocal.changeObject('GeolocationModule','clientes',element.Codigo,element);
    }else{
      const id = await this.sqlservices.sqlLocal.addObject('GeolocationModule','clientes',element);
    }
    this.descripcion = element.RazonSocial;
    this.descripcion2 = element.Nombre;
    this.codigo = element.Codigo;
    this.direccion = element.Direccion;
    this.telefono = element.Telefono;
    try {
      this.fecha = element.FechaVisitada.date;
    } catch (error) {

    }
    if(element.Latitud !== '' && element.Longitud !== ''){
      this.latitude = element.Latitud;
      this.longitude =element.Longitud;
      this.showUbi = true;
      this.saveUbi = false;
      if(element.Visito !== '0'){
        this.visite = true;
      }
    }else{
      this.showUbi = false;
      this.saveUbi = true;
    }
    this.presentAlert();
  });

  }, (error) => {
    this.errorAlert('Error al guardar la ubicacion del Cliente. Revise la conexion del internet');
  });
}


}
