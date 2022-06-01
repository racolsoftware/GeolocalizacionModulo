import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { Geolocation,  PositionError, Geoposition  } from '@ionic-native/geolocation/ngx';
import { InAppBrowser,InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { AppComponent } from 'src/app/app.component';
import { SqlService } from 'src/app/services/sql.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
})
export class ClientePage implements OnInit {
  orderby: string;
  cantidad = 1;
  unidades = [{nombre: 'caja', unidad: 2}, {nombre: 'unidad', unidad: 1}];
  descripcion = 'Cliente no Encontrado';
  descripcion2 = 'error';
  codigo = '';
  default = 1;
  direccion = '';
  telefono = '';
  latitude = 0;
  longitude = 0;
  saveUbi= false;
  showUbi=false;
  visite=false;
  fecha: any;


  constructor(private geolocation: Geolocation,
      public alertController: AlertController,
    private route: ActivatedRoute, public sqlservices: DataService,
     private platform: Platform,
     private inAppBrowser: InAppBrowser) {

      }


  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      console.log(params); // { orderby: "price" }
      this.orderby = params.codigo;
      console.log(this.orderby); // price
      this.loadCliente(params.codigo);
    }
  );
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

loadCliente(aux: number){
  AppComponent.startLoading();
  const jsonDv = {
    codVend : '1',
    codCli : aux
  };
  this.sqlservices.getCliente(jsonDv).subscribe( (Data: any)=>{
    console.log(Data);
    console.log(Data.objeto);

  // if(Data.resultado === 1){
  Data.objeto.forEach(element => {
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
      }
    }else{
      this.showUbi = false;
      this.saveUbi = true;
    }

  });
  AppComponent.stopLoading();
  });
}

async visitoCliente(){
  console.log('entro');


  this.geolocation.watchPosition().subscribe( async  (data) => {
   // data can be a set of coordinates, or an error (if an error occurred).
   // data.coords.latitude
   // data.coords.longitude
   this.latitude = data.coords.latitude;
   this.longitude = data.coords.longitude;

  });


  const alertConfirm = await this.alertController.create({
    cssClass: 'my-custom-class',
    header: 'Confirmacion!',
    message: 'Message <strong>¿Esta seguro de registrar la visita?</strong>!!!',
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
        handler: () => {
          console.log('Confirm Okay');
          AppComponent.startLoading();
  console.log('navigate visi clicked!');
  const jsonDv = {
    codVend : '1',
    codCli : this.codigo,
    latitud: this.latitude,
    longitud: this.longitude
  };
  // eslint-disable-next-line @typescript-eslint/naming-convention
  this.sqlservices.setUbicacionVisitoVendedor(jsonDv).subscribe((Data: any) => {
    console.log(Data);
    console.log(Data.objeto);
    console.log(Data);
    console.log(Data.objeto);

  // if(Data.resultado === 1){
  Data.objeto.forEach(element => {
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
  });
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

 async avisoParaTomarUbicacion() {
  console.log('entro click 1');


   this.geolocation.watchPosition().subscribe(  async (resp) => {
    console.log('entro click 2');
 // data can be a set of coordinates, or an error (if an error occurred).
 // data.coords.latitude
 // data.coords.longitude
 this.latitude = resp.coords.latitude;
    this.longitude = resp.coords.longitude;



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
        this.openMap(this.latitude,this.longitude);
      }
    },
    {
      text: 'Guardar',
      id: 'confirm-button',
      handler: () => {
        console.log('Confirm Okay');
        this.setUbicacion();
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
  const alert = this.alertController.create({
    header: 'Confirmacion',
    message: 'La ubicacion ha sido guardada Satisfactoriamente',
    buttons: ['Cerrar']
  });
   (await alert).present();
}

async errorAlert() {
  const alert = this.alertController.create({
    header: 'Error',
    message: 'No se puede utilizar la geolocalizacion',
    buttons: ['Cerrar']
  });
   (await alert).present();
}
setUbicacion(){
  const jsonDv = {
    codVend : '1',
    codCli : this.codigo,
    latitud: this.latitude,
    longitud: this.longitude
  };
  this.sqlservices.setUbicacion(jsonDv).subscribe( (Data: any)=>{
    console.log(Data);
    console.log(Data.objeto);

  // if(Data.resultado === 1){
  Data.objeto.forEach(element => {
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

  });
}


}
