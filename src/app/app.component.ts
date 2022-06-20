import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { AlertController, LoadingController, Platform } from '@ionic/angular';
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents,
} from '@ionic-native/background-geolocation/ngx';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import { Observable, Subscription } from 'rxjs';
import { ForegroundService } from '@awesome-cordova-plugins/foreground-service/ngx';
import { Timeouts } from 'selenium-webdriver';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';
import { SqlService } from './services/sql.service';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit {
  latitude = 0;
  longitude = 0;
  scripts: any;
  //websocket
  wsurl = 'ws://serverracol.ddns.net:10000/start-websocket/angular';
  ws: WebSocket;
  socketIsOpen = 1;
  messageFromServer: string;
  wsSubscription: Subscription;
  status = false;
  stayConnect = false;
  public  nombre = 'Sin registrar';
  public compania= 'sin Registrar';
  puedeEnviar= true;
  public  loading: any;

  public appPages = [
    { title: 'Inicio', url: '/inicio', icon: 'home' },
    { title: 'Mapa', url: '/mapa', icon: 'paper-plane' },
    { title: 'Lista De Clientes', url: '/listado-de-cliente', icon: 'people' },
    {
      title: 'Ruta Personalizada',
      url: '/listado-de-ruta',
      icon: 'list',
    },
    { title: 'Rutas Asignadas', url: '/ruta-asignada', icon: 'archive' },
    // { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Ruta Del Dia', url: '/ruta-dia', icon: 'calendar' },
    { title: 'Configuracion', url: '/configuracion', icon: 'settings' },
  ];
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  config: BackgroundGeolocationConfig = {
    stopOnTerminate: false,
    locationProvider: 2,
    desiredAccuracy: 0,
    stationaryRadius: 0,
    distanceFilter: 0,
    debug: false,
    interval: 1000,
    fastestInterval: 800,
    saveBatteryOnBackground: false,

    notificationsEnabled: false,
    startForeground: true,
    notificationTitle: 'Navegacion',
    notificationText: 'Navegación activada',
    notificationIconColor: '#c50707',
    notificationIconLarge: 'ic_tracking',
    notificationIconSmall: 'ic_tracking',

    // url: 'http://192.168.81.15:3000/location',
    // httpHeaders: {
    //   'X-FOO': 'bar'
    // },
    // // customize post properties
    // postTemplate: {
    //   lat: '@latitude',
    //   lon: '@longitude',
    //   foo: 'bar' // you can also add your own properties
    // }
  };
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public static loading: any;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public static load: any;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  static nombre: any;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  static compania: any;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  static alertCtrl1: any;
  constructor(
    private androidPermissions: AndroidPermissions,
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy,
    private backgroundGeolocation: BackgroundGeolocation,
    private platform: Platform,
    private backgroundMode: BackgroundMode,
    public foregroundService: ForegroundService,
    public alertCtrl: AlertController,
    private openNativeSettings: OpenNativeSettings,
    public loadingController: LoadingController, public sqlLocal: SqlService,
    protected deeplinks: Deeplinks,
    private router: Router,
    private zone: NgZone,
    public notify: Notifications
    ) {
      AppComponent.alertCtrl1 = this.alertCtrl;

      this.platform.ready().then(() => {
        this.initDeeplinks();
      });


    AppComponent.load = this.loadingController;

    if(localStorage.getItem('passwordUser')===null){
      localStorage.setItem('passwordUser', JSON.stringify('adminadmin'));
    }
    if(localStorage.getItem('passwordApp')===null){
      localStorage.setItem('passwordApp', JSON.stringify('adminadmin'));
    }
    if(localStorage.getItem('vendedor')===null){
      localStorage.setItem('vendedor', JSON.stringify('1'));
    }
    if(localStorage.getItem('conf')===null){
      localStorage.setItem('conf',JSON.stringify({posiTime:5}));
    }
    if(localStorage.getItem('user')!==null){
      const varia = JSON.parse(localStorage.getItem('user'));
      AppComponent.nombre = varia.nombre;
      AppComponent.compania = varia.compNombre;
    }

    this.configurateBackground();
  }



   static async startLoading(){
    AppComponent.loading = await AppComponent.load.create({
      message: 'Cargando',
      duration: 1000
    });
    await AppComponent.loading.present();
  }
  static async stopLoading(){
     await AppComponent.loading.dismiss();
     console.log('stop');
  }
  static async errorAlert(mensaje: string) {
    const alert = AppComponent.alertCtrl1.create({
      header: 'Error',
      message: mensaje,
      buttons: ['Cerrar']
    });
     (await alert).present();
  }
  initDeeplinks() {
    this.deeplinks.route({ '/:value': ''  }).subscribe(
    match => {
      console.log(match);
      const path = '/'+ match.$link['host'] + match.$link['path'] +'?'+ match.$link['queryString'] ;
    // const path = `/${match.$route}/${match.$args['value1']}`;
    // // Run the navigation in the Angular zone

    this.zone.run(() => {
      this.router.navigateByUrl(path);
      });

    },
    nomatch => {
    console.log('Deeplink that didn\'t match', nomatch);
    });
    }

  getNombre(){
    return AppComponent.nombre;
  }

  getCompania(){
    return AppComponent.compania;
  }


    async ngOnInit() {
      const user = localStorage.getItem('user');
      let tok = JSON.parse(user);
      try {
         tok = tok.tokenGoogle;
      await this.loadScript('https://maps.googleapis.com/maps/api/js?key='+tok+'&libraries=places,drawing').then(() => {
        console.log('Success');
      });
      } catch (error) {

      }

  }



loadScript(name: string) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = name;
      document.getElementsByTagName('head')[0].appendChild(script);
      console.log('Script Loaded');
      resolve(true);
    });
  }

  configurateBackground() {
    this.backgroundGeolocation
      .configure(this.config)
      .then((location: BackgroundGeolocationResponse) => {
        console.log(location);

        // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
        // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
        // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        this.backgroundGeolocation.finish(); // FOR IOS ONLY
      });
  }
  // start recording location

  stopBackground() {
    this.backgroundGeolocation.stop();
  }
  async exitApp(){
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: '¿Desea salir de la aplicacion?',
      inputs: [
        {
          name: 'password',
          type: 'password',
          placeholder: 'Contraseña',
          cssClass: 'specialClass',
          attributes: {
            minlength: 4,
            inputmode: 'decimal',
          },
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Ok',
          handler: (value: any) => {
            if (value.password === 'adminadmin') {
            navigator['app'].exitApp();
            } else {
              this.errorAlert();
            }
          },
        },
      ],
    });
    await alert.present();
  }
    async errorAlert() {
    const alert = this.alertCtrl.create({
      header: 'Error',
      message: 'La contraseña es incorrecta',
      buttons: ['Cerrar'],
    });
    (await alert).present();
  }

  // If you wish to turn OFF background-tracking, call the #stop method.
  startService() {
    // Notification importance is optional, the default is 1 - Low (no sound or vibration)
    this.foregroundService.start('GPS Running', 'Background Service', 'drawable/fsicon');
   }

   stopService() {
    // Disable the foreground service
    this.foregroundService.stop();
   }

   async presentAlert(mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: 'Back',
      message: mensaje,
      buttons: ['Dismiss']
    });
    await alert.present();
  }


  createObservableSocket(url: string): Observable<any> {

    this.ws = new WebSocket(url);

    if(this.status===false){
      return new Observable((observer) => {
        this.ws.onopen = (event) => {
          this.status = true;
          console.log(event);
          setTimeout(() => {
            console.log('text message send');
            this.sendMessageToServer();
          }, 1000);
        };

        this.ws.onmessage = (event) =>
        {

            // observer.next(event.data)
            try {
              console.log(JSON.parse(event.data));
              if(JSON.parse(event.data).status==='stop'){
                this.puedeEnviar = false;
              }else if(JSON.parse(event.data).status==='start'){
                this.puedeEnviar = true;
              }

            } catch (error) {

            }


          observer.next(event.data);
        };

        this.ws.onerror = (event) => {
          this.status = false;
          console.log('error 3');
          console.log('try to connect again in 3 second');
          observer.error(event);

        };

        this.ws.onclose = (event) => {
          this.status = false;
          this.wsSubscription.unsubscribe();
          observer.complete();

        };

        return () => this.ws.close(1000, 'The user disconnected');
      });
    }


  }
  sendMessage(message: string): string {
    if (this.ws.readyState === this.socketIsOpen) {
      this.ws.send(message);
      return `Sent to server ${message}`;
    } else {
      return 'Message was not sent - the socket is closed';
    }
  }
  sendMessageToServer() {
    console.log('mensaje');
    console.log(this.sendMessage('Hello from client'));
  }

  connectToServer() {
    try {

      let urlAux: any;
      let infoSend: any;
    const url=localStorage.getItem('websocket');
    const idvend=localStorage.getItem('vendedor');
    if(url!==null && idvend !==null){
      urlAux = JSON.parse(url);
      infoSend = {
        id: JSON.parse(idvend),
        idComp: urlAux.idComp,
        tipo: 'Vendedor'
      };
    }else{
      urlAux ={url: this.wsurl};
    }

      this.wsSubscription = this.createObservableSocket(urlAux.url+JSON.stringify(infoSend)).subscribe(
      (data) => {

        this.messageFromServer = data;
        console.log('Llego WebSocket:'+ this.messageFromServer);
      },
      (err) => {
        console.log('err');
        console.log(err);
        this.wsSubscription.unsubscribe();
          setTimeout(() => {
            this.connectToServer();
          }, 3000);
      },
      () => {
        this.wsSubscription.unsubscribe();
          setTimeout(() => {
            this.connectToServer();
          }, 3000);
        console.log('The observable stream is complete');
      }

    );
    } catch (error) {
      console.log(error);
    }

  }

  async ngAfterViewInit(): Promise<void> {
    this.sqlLocal.startSql();
    // console.log('esto sale del db'+await this.sqlLocal.loadData('GeolocationModule','location'));
    // console.log('esto sale del db'+await this.sqlLocal.getObjectById('GeolocationModule','location',2));
    // console.log('esto sale del db',await this.sqlLocal.getObjectByIndex('GeolocationModule','location','status',0));
    console.log('esto sale del db',await this.sqlLocal.changeObject('GeolocationModule','location',1,{status: 0}));
    // console.log('Add',await this.sqlLocal.addObject('GeolocationModule','location',{
    //   codVend: '1',
    //   codCli: 1,
    //   latitud: 0.0,
    //   longitud: 0.0,
    //   status: 1,
    //   date: new Date().toISOString()
    // }));
    localStorage.removeItem('ubication');
    console.log('entro');
    this.stayConnect = true;
    this.connectToServer();
    this.backgroundMode.enable();
    this.backgroundMode.on('activate').subscribe(()=>{
      this.backgroundMode.disableWebViewOptimizations();
      this.checkStatusAndStartAgain();
    });
    document.addEventListener('deviceready',() => {
      this.onDeviceReady();

      },
      false
    );

    console.log('entro2');
    this.checkGPSPermission();

    // try {

    // } catch (error) {
    //   console.log(error);
    // }
    // if (this.platform.is('cordova')) {
    //   console.log('enro');
    //   this.configurateBackground();
    // } else {
    //   // You're testing in browser, do nothing or mock the plugins' behaviour.
    //   //
    //   // var url: string = 'assets/mock-images/image.jpg';
    // }
  }
  //Check if application having GPS access permission
  checkGPSPermission() {
    try {
      this.androidPermissions
        .checkPermission(
          this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
        )
        .then(
          (result) => {
            if (result.hasPermission) {
              //If having permission show 'Turn On GPS' dialogue
              this.askToTurnOnGPS();
              try {
                // this.backgroundGeolocation.start();
                // this.backgroundGeolocation.checkStatus().then((status: any) => {
                //   console.log(
                //     '[INFO] BackgroundGeolocation service is running',
                //     status.isRunning
                //   );
                //   console.log(
                //     '[INFO] BackgroundGeolocation services enabled',
                //     status.locationServicesEnabled
                //   );
                //   console.log(
                //     '[INFO] BackgroundGeolocation auth status: ' +
                //       status.authorization
                //   );

                //   // you don't need to check status before start (this is just the example)
                //   if (!status.isRunning) {
                //     this.backgroundGeolocation.start(); //triggers start on start event
                //   }
                // });
              } catch (error) {}
            } else {
              //If not having permission ask for permission
              this.requestGPSPermission();
            }
          },
          (err) => {}
        );
    } catch (e) {}
  }
  onDeviceReady() {


                this.checkStatusAndStartAgain();
                this.backgroundGeolocation.on(BackgroundGeolocationEvents.background).subscribe((aux: any) => {
                  // this.backgroundGeolocation.configure({ debug: true });

                  console.log('inicio del background 123');
                  setTimeout(() => {
                    this.checkStatusAndStartAgain();
                  }, 2000);

                  // this.startService();
                  // this.connectToServer();
                });
                this.backgroundGeolocation.on(BackgroundGeolocationEvents.foreground).subscribe((aux: any) => {
                  // this.backgroundGeolocation.configure({ debug: false });
                  console.log('inicio del foreground');

                  setTimeout(() => {
                    this.checkStatusAndStartAgain();
                  }, 2000);

                  //  this.startService();

                });

                this.backgroundGeolocation.on(BackgroundGeolocationEvents.authorization).subscribe((status: any) => {
                  console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
                  if (status !== 1) {
                    // we need to set delay or otherwise alert may not be shown
                    setTimeout(() => {
                      const showSettings = confirm('La aplicacion reguiere el acceso de localizacion.'+
                       'Desearia abrir configuracion para activar?');
                      if (showSettings === true) {
                        this.openNativeSettings.open('location');
                        this.requestToSwitchOnGPS();
                      }
                    }, 1000);
                  }
                });

                this.backgroundGeolocation.on(BackgroundGeolocationEvents.stop).subscribe((stop: any) => {
                  console.log('[ERROR] BackgroundGeolocation stop:');


                  setTimeout(() => {
                    this.checkStatusAndStartAgain();
                  this.stopService();
                  }, 2000);
                });
                this.backgroundGeolocation.on(BackgroundGeolocationEvents.error).subscribe((error: any) => {
                  console.log('[ERROR] BackgroundGeolocation error:');
                  setTimeout(() => {
                    this.checkStatusAndStartAgain();
                  this.stopService();
                  }, 2000);

                });

                this.backgroundGeolocation.on(BackgroundGeolocationEvents.start).subscribe( () => {
                  this.startService();
                  console.log('[INFO] BackgroundGeolocation service has been started good');
                });


                // eslint-disable-next-line max-len
                this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
                  this.backgroundGeolocation.startTask().then((taskKey) => {
                    console.log(taskKey);
                    // execute long running task
                    // eg. ajax post location
                    // IMPORTANT: task has to be ended by endTask
                    if(location.isFromMockProvider===true){
                      setTimeout(() => {
                        const showSettings = confirm('La aplicacion esta ejecutando una aplicacion fraudulenta para la localizacion\n'+
                         'Debe deshabilitar la aplicacion si no desea tener problemas legales');
                        if (showSettings === true) {
                          this.openNativeSettings.open('application_development');
                        }
                      }, 1000);
                    }
                        localStorage.setItem('ubication', JSON.stringify(
                        {latitude: location.latitude,
                        longitude: location.longitude}
                        ));

                        if (this.status === true) {
                          let idvend = '1';
                          try {
                            idvend = localStorage.getItem('vendedor');
                            idvend = JSON.parse(idvend);
                          } catch (error) {

                          }
                          const jsonSend = {
                            location,
                            idVendedor: idvend,
                            latitude: location.latitude,
                            longitude: location.longitude,
                            time: location.time,
                            action: 'sendStatus'
                          };
                          if(this.puedeEnviar===true){
                            this.sendMessage(
                              JSON.stringify(jsonSend)
                            );
                          }

                      } else {
                        console.log('socket is down');
                        this.connectToServer();
                      }
                      this.backgroundGeolocation.endTask(taskKey);
                  });


                  console.log(location);

                  // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
                  // and the background-task may be completed.  You must do this regardless if your operations are successful or not.
                  // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
                });

    // Now safe to use device APIs
  }
  requestToSwitchOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
      },
      error => alert(JSON.stringify(error))
    );
  }
  checkStatusAndStartAgain(){
    this.backgroundGeolocation.checkStatus().then((status: any) => {
      console.log(
        '[INFO] BackgroundGeolocation service is running',
        status.isRunning
      );
      console.log(
        '[INFO] BackgroundGeolocation services enabled',
        status.locationServicesEnabled
      );
      console.log(
        '[INFO] BackgroundGeolocation auth status: ' +
          status.authorization
      );

      // you don't need to check status before start (this is just the example)
      if (!status.isRunning) {
        this.backgroundGeolocation.start(); //triggers start on start event
      }
    });
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions
          .requestPermission(
            this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION
          )
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            (error) => {
              //Show alert if user click on 'No Thanks'
              alert(
                'requestPermission Error requesting location permissions ' +
                  error
              );
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy
      .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
      .then(
        () => {
          // When GPS Turned ON call method to get Accurate location coordinates
        },
        (error) =>
          alert(
            'Error requesting location permissions ' + JSON.stringify(error)
          )
      );
  }
}
