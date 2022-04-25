import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { InAppBrowser,InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';

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


  constructor(private geolocation: Geolocation,
    public alertController: AlertController,
    private route: ActivatedRoute, public sqlservices: DataService,
     private platform: Platform,
     private inAppBrowser: InAppBrowser) { }


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

loadCliente(aux: number){
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
    if(element.Latitud !== '' && element.Longitud !== ''){
      this.latitude = element.Latitud;
      this.longitude =element.Longitud;
      this.showUbi = true;
      this.saveUbi = false;
    }else{
      this.showUbi = false;
      this.saveUbi = true;
    }

  });

  });
}

async avisoParaTomarUbicacion() {
  this.geolocation.getCurrentPosition().then(async (resp) => {
    this.latitude = resp.coords.latitude;
    this.longitude = resp.coords.longitude;
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
   }).catch((error) => {
     console.log('Error getting location', error);
     this.errorAlert();
   });

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
    if(element.Latitud !== '' && element.Longitud !== ''){
      this.latitude = element.Latitud;
      this.longitude =element.Longitud;
      this.showUbi = true;
      this.saveUbi = false;
    }else{
      this.showUbi = false;
      this.saveUbi = true;
    }
    this.presentAlert();
  });

  });
}


}
