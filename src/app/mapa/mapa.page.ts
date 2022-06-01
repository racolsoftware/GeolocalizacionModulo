import { Component } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InAppBrowser,InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ubicacion } from '../instancia/ubicacion.models';
import { DataService } from '../services/data.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController } from '@ionic/angular';
import { AppComponent } from '../app.component';

declare let google: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage {
  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;

  map: any;
  infoWindow: any;
  labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  labelIndex = 0;
  public static miUbiEnElMap: any;
  public static latitud: any;
  public static longitud: any;

  circleRound: any;
  countRadius= 0;
  accion: string;
  codigo: '';



  infoWindows: any = [];
  markers: ubicacion [] = [
    {
        title: 'National Art Gallery',
        latitude: '-17.824991',
        longitude: '31.049295',
        visito: false,
        codigo: 0
    },
    {
        title: 'West End Hospital',
        latitude: '-17.820987',
        longitude: '31.039682',
        visito: false,
        codigo: 0
    },
    {
        title: 'Dominican Convent School',
        latitude: '-17.822647',
        longitude: '31.052042',
        visito: false,
        codigo: 0
    },
    {
        title: 'Chop Chop Brazilian Steakhouse',
        latitude: '-17.819460',
        longitude: '31.053844',
        visito: false,
        codigo: 0
    },
    {
        title: 'Canadian Embassy',
        latitude: '-17.820972',
        longitude: '31.043587',
        visito: false,
        codigo: 0
    },
    {
        title: 'RD',
        latitude: '19.453591',
        longitude: '-70.658814',
        visito: false,
        codigo: 0
    },
    {
      title: 'RD1',
      latitude: '19.453591',
      longitude: '-70.659819',
      visito: false,
      codigo: 0
  }
  ];
  markersMap = [];

  constructor(private geolocation: Geolocation,
    public sqlservices: DataService,
    private inAppBrowser: InAppBrowser,
    public alertController: AlertController,
    private route: ActivatedRoute) {


    }
    async reloadRutaClienteVisitarHoyCXC(jsonDv: any) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      await this.sqlservices.getClienteAVisitarHoyCXC(jsonDv).subscribe((Data: any) => {
        console.log(Data);
        console.log(Data.objeto);
        this.markers = [];
        let cont = 0;


        Data.objeto.forEach((element) => {
          if (element.latidude === null || element.latitude ==='') {

          }else{
            let aux = {
              title: element.RazonSocial,
              latitude: element.latitude,
              longitude: element.longitude,
              visito: false,
              codigo: parseInt(element.Codigo,10),
            };
            if(element.Visito !== '0'){
              cont+=1;
              aux.visito = true;
            }
            this.markers.push(aux);
          }
        });
        console.log('compa: '+cont);
        this.showMap2();
      });
    }
    async reloadRutaCliente(jsonDv: any) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      await this.sqlservices.getListadoClienteRuta(jsonDv).subscribe((Data: any) => {
        console.log(Data);
        console.log(Data.objeto);
        this.markers = [];


        Data.objeto.clientes.forEach((element) => {
          if (element.latitude !== null) {
            let aux = false;
            if(element.Visito === '1'){

              aux = true;
            }
            this.markers.push({
              title: element.RazonSocial,
              latitude: element.latitude,
              longitude: element.longitude,
              visito: aux,
              codigo: parseInt(element.Codigo)
            });

          }
        });
        this.showMap2();
      });
    }
//construye el mapa cuando inicia la app
  ionViewWillEnter() {
    AppComponent.startLoading();
  //   this.route.queryParams
  //   .subscribe(params => {
  //     console.log(params); // { orderby: "price" }
  //     const aux = params.ubicaciones;
  //     if(aux!==undefined){
  //       console.log(aux);
  //       this.markers=aux;
  //     }else{
  //     }

  //   }
  // );
  this.route.queryParams.subscribe((params) => {
    console.log(params); // { codRuta: "price" }
    this.accion = params.accion;
    this.codigo = params.codigo;
    switch (this.accion) {
      case 'ruta':
        const jsonDv = {
          codVend: '1',
          codRuta: parseInt(this.codigo, 10),
        };
        this.reloadRutaCliente(jsonDv);

        break;
        case 'rutaAsig':
          const jsonDv2 = {
            codVend: '1',
            codRuta: parseInt(this.codigo, 10),
          };
          this.reloadRutaClienteCXC(jsonDv2);

          break;
      default:
        const jsonDv1 = {
          codVend: '1'
        };
        this.reloadRutaClienteVisitarHoyCXC(jsonDv1);
        break;
    }
    AppComponent.stopLoading();
  });

  }

  reloadRutaClienteCXC(jsonDv: any){
    this.sqlservices.getListadoClientecxcRuta(jsonDv).subscribe((Data: any) => {
      console.log(Data);
      console.log(Data.objeto);
      this.markers = [];

      Data.objeto.clientes.forEach((element) => {
        if (element.latitud_cli !== null) {
          let aux = false;
            if(element.Visito === '1'){

              aux = true;
            }
          this.markers.push({
            title: element.RazonSocial,
            latitude: element.latitud_cli,
            longitude: element.longitud_cli,
            visito: aux,
            codigo: parseInt(element.Codigo)
          });
        }
      });
      this.showMap2();
    });
  }

  svgCheckVisited(){
    const svgMarker = {
      // eslint-disable-next-line max-len
      path: 'M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z',
      fillColor: 'blue',
      fillOpacity: 0.6,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(15, 30),
    };
    return svgMarker;
  }

  svgMyLocation(){
    const svgMarker = {
      // eslint-disable-next-line max-len
      path: 'M43 0v13.166C27.944 16.03 16.03 27.944 13.166 43H0v14h13.166C16.03 72.056 27.944 83.97 43 86.834V100h14V86.834C72.056 83.97 83.97 72.056 86.834 57H100V43H86.834C83.97 27.944 72.056 16.03 57 13.166V0H43zm7 22.5A27.425 27.425 0 0 1 77.5 50A27.425 27.425 0 0 1 50 77.5A27.425 27.425 0 0 1 22.5 50A27.425 27.425 0 0 1 50 22.5z',
      fillColor: 'blue',
      fillOpacity: 1,
      strokeWeight: 0,
      rotation: 0,
      scale:0.2,
      // url: '/assets/img/location-on-svgrepo-com.svg',

      size: new google.maps.Size(0, 32),
   scaledSize: new google.maps.Size(1, 1),
   origin: new google.maps.Point(0, 0)
    };
    return svgMarker;
  }


  svgPoint(){


    const svgMarker = {
      // eslint-disable-next-line max-len
      path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
      fillColor: 'red',
      fillOpacity: 1,
      strokeWeight: 0,
      rotation: 0,
      scale: 2,
      anchor: new google.maps.Point(15, 30),
    };
    return svgMarker;
  }

  setMapOnAll(map: any | null) {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < this.markersMap.length; i++) {
      this.markersMap[i].setMap(map);
    }
  }
  addMarkersToMap(markers) {
    this.setMapOnAll(null);
    console.log(this.generateRoute(markers));
    const svgMarker = this.svgMyLocation();
    const shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: 'poly',
    };
    for (const marker of markers) {
      let posi = 0;
      const position = new google.maps.LatLng(marker.latitude, marker.longitude);
      let mapMarker= null;
      if(marker.title === 'Mi Ubicacion'){
        posi = 1;
         mapMarker = new google.maps.Marker({
          position,
          shape,
          title: marker.title,
          latitude: marker.latitude,
          longitude: marker.longitude,
          label: this.labels[this.labelIndex++ % this.labels.length],
          icon: this.svgMyLocation(),
          idCliente: marker.codigo,
        });
      }else if(marker.visito === true){
        posi = 2;
          mapMarker = new google.maps.Marker({
          position: position,
          title: marker.title,
          shape: shape,
          latitude: marker.latitude,
          longitude: marker.longitude,
          label: this.labels[this.labelIndex++ % this.labels.length],
          icon: this.svgCheckVisited(),
          idCliente: marker.codigo,
        });
      }else{
        mapMarker = new google.maps.Marker({
          position: position,
          title: marker.title,
          shape: shape,
          latitude: marker.latitude,
          longitude: marker.longitude,
          label: this.labels[this.labelIndex++ % this.labels.length],
          icon: this.svgPoint(),
          idCliente: marker.codigo,
        });
      }


      mapMarker.setMap(this.map);
      this.addInfoWindowToMarker(mapMarker,posi);
      this.markersMap.push(mapMarker);
    }
  }


  loadCircleRound(pos){
    const json = localStorage.getItem('ubication');
    const conv = JSON.parse(json);
    const auxil = {
      lat: conv.latitude,
      lng: conv.longitude
    };
    const position1 = new google.maps.LatLng(auxil.lat, auxil.lng);
    if(this.circleRound !== undefined){
      this.countRadius+=1;
      this.circleRound.setCenter(position1);
      this.circleRound.setRadius(8*(1.5+Math.sin(this.countRadius*(Math.PI/56))));
    }else{
      this.circleRound = new google.maps.Circle({
      strokeColor: '#477CE0',
      strokeOpacity: 0.8,
      strokeWeight: 0,
      fillColor: '#477CE0',
      fillOpacity: 0.1
    });
    this.circleRound.setRadius(8*(1.5+Math.sin(this.countRadius*(Math.PI/56))));
    this.circleRound.setMap(this.map);
    this.circleRound.setCenter(position1);
    }


  }
  openMap(url: string){


    const options: InAppBrowserOptions = {
      zoom: 'no'
    };

    // Opening a URL and returning an InAppBrowserObject
    const browser = this.inAppBrowser.create(url, '_system', options);
    //  window.open(url, '_system', 'location=yes');
  }


  addInfoWindowToMarker(marker, posi) {
    let infoWindowContent;
    switch (posi) {
      case 1:
        infoWindowContent = '<div id="content">' +
                              '<h2 id="firstHeading" class"firstHeading" style="color: black;">' + marker.title + '</h2>' +
                              '<p style="color: black;">Latitude: ' + marker.latitude + '</p>' +
                              '<p style="color: black;">Longitude: ' + marker.longitude + '</p>' +

                            '</div>';
        break;
        case 2:
          infoWindowContent = '<div id="content">' +
                                '<h2 id="firstHeading" class"firstHeading" style="color: black;">' + marker.title + '</h2>' +
                                '<h6 id="firstHeading" class"firstHeading" style="color: black;">Codigo: ' + marker.idCliente + '</h6>' +
                                '<p style="color: black;">Latitude: ' + marker.latitude + '</p>' +
                                '<p style="color: black;">Longitude: ' + marker.longitude + '</p>' +
                                '<ion-button id="navigate">Navegar</ion-button>' +
                              '</div>';
          break;
      default:
        infoWindowContent = '<div id="content">' +
                              '<h2 id="firstHeading" class"firstHeading" style="color: black;">' + marker.title + '</h2>' +
                              '<h6 id="firstHeading" class"firstHeading" style="color: black;">Codigo: ' + marker.idCliente + '</h6>' +
                              '<p style="color: black;">Latitude: ' + marker.latitude + '</p>' +
                              '<p style="color: black;">Longitude: ' + marker.longitude + '</p>' +
                              '<ion-button id="navigate">Navegar</ion-button>' +
                              '<ion-button id="visito">Visitado</ion-button>' +
                            '</div>';
        break;
    }


    const infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });

    marker.addListener('click', () => {
      this.closeAllInfoWindows();
      infoWindow.open(this.map, marker);

      google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
        document.getElementById('navigate').addEventListener('click', () => {
          console.log('navigate button clicked!');
          // code to navigate using google maps app
          // eslint-disable-next-line max-len
          this.openMap('https://www.google.com/maps/dir/?api=1&destination=' + marker.latitude + ',' + marker.longitude);
          // eslint-disable-next-line max-len
          // this.openMap('https://www.google.com/maps/dir/?api=1&destination=' + marker.latitude + ',' + marker.longitude+'&waypoints=19.4522879,-70.6553089%7C19.451831,-70.654702');
          // eslint-disable-next-line max-len
          // window.open('https://www.google.com/maps/dir/?api=1&destination=' + marker.latitude + ',' + marker.longitude+'&waypoints=19.4522879,-70.6553089%7C19.451831,-70.654702');
        });
        try {
          document.getElementById('visito').addEventListener('click', () => {
            console.log('navigate visi clicked!');
            const jsonDv = {
              codVend : '1',
              codCli : marker.idCliente,
              latitud:  MapaPage.latitud,
              longitud: MapaPage.longitud
            };
            this.sqlservices.setUbicacionVisitoVendedor(jsonDv).subscribe( (Data: any)=>{
              console.log(Data);
              console.log(Data.objeto);
// code to navigate using google maps app
            // eslint-disable-next-line max-len
            marker.setIcon(this.svgCheckVisited());
            infoWindow.setContent('<div id="content">' +
            '<h2 id="firstHeading" class"firstHeading" style="color: black;">' + marker.title + '</h2>' +
            '<p style="color: black;">Latitude: ' + marker.latitude + '</p>' +
            '<p style="color: black;">Longitude: ' + marker.longitude + '</p>' +
            '<ion-button id="navigate">Navigate</ion-button>' +
          '</div>');
            // eslint-disable-next-line max-len
            // window.open('https://www.google.com/maps/dir/?api=1&destination=' + marker.latitude + ',' + marker.longitude+'&waypoints=19.4522879,-70.6553089%7C19.451831,-70.654702');
          this.presentVisitoAlert();
            });
            });
        } catch (error) {

        }

      });

    });
    this.infoWindows.push(infoWindow);
  }
  async presentVisitoAlert() {
    const alert = this.alertController.create({
      header: 'Confirmacion',
      message: 'El Cliente se ha marcado como visitado',
      buttons: ['Cerrar']
    });
     (await alert).present();
  }

  generateRoute(destino: any){
    let url = 'https://www.google.com/maps/dir/?api=1';
    if(destino.length === 1){
      url = 'https://www.google.com/maps/dir/?api=1&destination=' + destino[0].latitude + ',' + destino[0].longitude;
    }else{
      url+= '&waypoints=';
      let index = 0;
      destino.forEach(element => {
        if(destino.length-1 === index){
          url+='&destination='+element.latitude + ',' + element.longitude;
        }else if(index === 0){
          url+=''+element.latitude + ',' + element.longitude;
        }else{
          url+='%7C'+element.latitude + ',' + element.longitude;
        }
        index+=1;
      });
    }

    return url;
  }

  closeAllInfoWindows() {
    for(const window of this.infoWindows) {
      window.close();
    }
  }

  showMap2() {
    const json = localStorage.getItem('ubication');
    const conv = JSON.parse(json);
    try {
      if (conv.latitude === 0 || conv.latitude === undefined) {
      this.showMap();
    } else {

      const location = new google.maps.LatLng(conv.latitude,conv.longitude);

      console.log(conv.latitude +' - '+conv.longitude);
      const au ={
        title: 'Mi Ubicacion',
        latitude: conv.latitude.toString(10),
        longitude: conv.longitude.toString(10),
      };
      console.log(au);
      // this.markers.push(au);
      const options = {
        center: location,
        zoom: 15,

      };
      if(this.map === undefined){
        this.map = new google.maps.Map(this.mapRef.nativeElement, options);
      }


  const locationButton = document.createElement('button');

  locationButton.textContent = 'Ir al punto de Mi Ubicacion';
  locationButton.classList.add('buttonP');

  // this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);


  const po = {
    lat: au.latitude,
    lng: au.longitude,
  };

  this.setYourPositionOnMap(po);



  // locationButton.addEventListener('click', () => {
  //   console.log('posi');
  //   // Try HTML5 geolocation.
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position: GeolocationPosition) => {
  //         const pos = {
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         };
  //         this.setYourPositionOnMap(pos);


  //       },
  //       () => {
  //         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //         this.handleLocationError(true, this.infoWindow, this.map.getCenter()!);
  //       }
  //     );
  //   } else {
  //     // Browser doesn't support Geolocation
  //     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //     this.handleLocationError(false, this.infoWindow, this.map.getCenter()!);
  //   }
  // });

    this.addMarkersToMap(this.markers);
     setInterval(async () => {

      this.loadPosiByAppcomponet();



    }, 1000);

    }
    } catch (error) {
      console.log(error);
      this.showMap();
    }







  }
  loadPosiByAppcomponet(){
    const json = localStorage.getItem('ubication');
    const conv = JSON.parse(json);
    console.log('hh'+conv.latitude);
    if(MapaPage.miUbiEnElMap!== undefined){
        MapaPage.latitud = conv.latitude;
    MapaPage.longitud = conv.longitude;
    const latlng1 = new google.maps.LatLng(conv.latitude, conv.longitude);
    MapaPage.miUbiEnElMap.setPosition(latlng1);
    }
  }
  showMap() {
    console.log('ene');
    this.geolocation.getCurrentPosition().then(async (resp) => {
      console.log('entre');
      const location = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);

      console.log(resp.coords);
      const au ={
        title: 'Mi Ubicacion',
        latitude: resp.coords.latitude.toString(10),
        longitude: resp.coords.longitude.toString(10),
      };
      localStorage.setItem('ubication',JSON.stringify(au));
      console.log(au);
      // this.markers.push(au);
      const options = {
        center: location,
        zoom: 15,

      };
      console.log('hola: '+this.map);
      if(this.map === undefined){
        this.map = new google.maps.Map(this.mapRef.nativeElement, options);
      }


  const locationButton = document.createElement('button');

  locationButton.textContent = 'Ir al punto de Mi Ubicacion';
  locationButton.classList.add('buttonP');

  // this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);


  const po = {
    lat: au.latitude,
    lng: au.longitude,
  };

  this.setYourPositionOnMap(po);



  // locationButton.addEventListener('click', () => {
  //   console.log('posi');
  //   // Try HTML5 geolocation.
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position: GeolocationPosition) => {
  //         const pos = {
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         };
  //         this.setYourPositionOnMap(pos);


  //       },
  //       () => {
  //         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //         this.handleLocationError(true, this.infoWindow, this.map.getCenter()!);
  //       }
  //     );
  //   } else {
  //     // Browser doesn't support Geolocation
  //     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  //     this.handleLocationError(false, this.infoWindow, this.map.getCenter()!);
  //   }
  // });

    this.addMarkersToMap(this.markers);
    const optio = { timeout: 600 , enableHighAccuracy: true };
          if(MapaPage.miUbiEnElMap!== undefined){
            const watchID = navigator.geolocation.watchPosition(auxi => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const valau = {
                lat: auxi.coords.latitude,
                lng: auxi.coords.longitude,
              };
              const au2 ={
                title: 'Mi Ubicacion',
                latitude: auxi.coords.latitude.toString(10),
                longitude: auxi.coords.longitude.toString(10),
              };
              localStorage.setItem('ubication',JSON.stringify(au2));
              console.log('ff'+auxi.coords.latitude);
              this.setloadUbi(auxi);
            },
              this.onError,
              optio
              );
          }

     }).catch((error) => {
       console.log('Error getting location', error);
       this.errorAlert();
     });



  }



  setloadUbi(position){
      MapaPage.latitud = position.coords.latitude;
    MapaPage.longitud = position.coords.longitude;
    const latlng1 = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    MapaPage.miUbiEnElMap.setPosition(latlng1);
  }
  listenButtonShowUbi(){
    this.infoWindow = new google.maps.InfoWindow();
    console.log('posi');
    // Try HTML5 geolocation.

    const pos = {
      lat:  MapaPage.latitud,
      lng: MapaPage.longitud,
    };
    console.log(pos);
    this.setYourPositionOnMap(pos);
    this.infoWindow.setPosition(pos);
    this.infoWindow.setContent('Mi Ubicacion');
    this.infoWindow.open(this.map);
    this.map.setCenter(pos);
    this.map.setZoom(17);
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(
    //     (position: GeolocationPosition) => {
    //       const pos = {
    //         lat:   MapaPage.latitud,
    //         lng: MapaPage.longitud,
    //       };
    //       this.setYourPositionOnMap(pos);
    //       this.infoWindow.setPosition(pos);
    //       this.infoWindow.setContent('Mi Ubicacion');
    //       this.infoWindow.open(this.map);
    //       this.map.setCenter(pos);


    //     },
    //     () => {
    //       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //       this.handleLocationError(true, this.infoWindow, this.map.getCenter()!);
    //     }
    //   );
    // } else {
    //   // Browser doesn't support Geolocation
    //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    //   this.handleLocationError(false, this.infoWindow, this.map.getCenter()!);
    // }
  }


  setYourPositionOnMap(pos){




    const shape = {
      coords: [1, 1, 1, 20, 18, 20, 18, 1],
      type: 'poly',
    };
    if(MapaPage.miUbiEnElMap=== undefined){
      const position1 = new google.maps.LatLng(pos.lat, pos.lng);
    MapaPage.miUbiEnElMap = new google.maps.Marker({
      position: position1,
      shape,
      title: 'Mi Ubicacion',
      latitude: pos.lat,
      longitude: pos.lng,
      icon: this.svgMyLocation(),
    });
    MapaPage.miUbiEnElMap.setMap(this.map);
    this.map.setCenter(pos);




    }else{
      const latlng1 = new google.maps.LatLng(pos.lat, pos.lng);
    MapaPage.miUbiEnElMap.setPosition(latlng1);
    this.map.setCenter(latlng1);
    }
    const latlng1 = new google.maps.LatLng(pos.lat, pos.lng);

    setInterval(()=>{
      this.loadCircleRound(null);
    },50);



    // this.infoWindow.setPosition(pos);
    // this.infoWindow.setContent('Mi ubicacion');
    // this.infoWindow.open(this.map);

  }

   onSuccess(position) {
    console.log('ff'+position.coords.latitude);
    this.setloadUbi(position);

}

// onError Callback receives a PositionError object
//
 onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

// Options: retrieve the location every 3 seconds
//

  handleLocationError(
    browserHasGeolocation: boolean,
    infoWindow: any,
    pos: any
  ) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? 'Error:   El servicio de geolocalizacion fallo.'
        : 'Error: Your browser does not support geolocation.'
    );
    infoWindow.open(this.map);
  }


  async errorAlert() {
    const alert = this.alertController.create({
      header: 'Error',
      message: 'No se puede utilizar la geolocalizacion, debe solicitar los permiso para la utilizacion del gps',
      buttons: ['Cerrar']
    });
     (await alert).present();
  }

}
