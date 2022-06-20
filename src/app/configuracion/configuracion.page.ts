import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { DataService } from '../services/data.service';
import { AppVersion } from '@ionic-native/app-version/ngx';


@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  app_version: string;
  passwordUser: any;
  passwordConf: any;
  constructor(
    private alertCtrl: AlertController,
    public sqlservices: DataService,
    private appVersion: AppVersion
  ) {}

  ngOnInit() {
    this.appVersion.getVersionNumber().then(
      (versionNumber) => {
        this.app_version = versionNumber;
      },
      (error) => {
        console.log(error);
      });
      this.loadPassword();
  }
  loadPassword(){
    this.passwordUser = localStorage.getItem('passwordUser');
    this.passwordUser = JSON.parse(this.passwordUser);
    this.passwordConf = localStorage.getItem('passwordApp');
    this.passwordConf = JSON.parse(this.passwordConf);
  }

  async changePassword(posi: number) {
    let aux: any;
    let header: any;
    let passwordOld: any;
    let message: any;
    switch (posi) {
      case 1:
        passwordOld = localStorage.getItem('passwordUser');
        header = 'Constaseña de Acceso';
        break;
      case 2:
        passwordOld = localStorage.getItem('passwordApp');
        header = 'Constaseña de Configuracion';
        break;
      default:
        break;
    }
    if (passwordOld !== null) {
      aux = JSON.parse(passwordOld);
    } else {
      aux = '';
    }
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header,
      message,
      inputs: [
        {
          name: 'passwordOld',
          type: 'password',
          placeholder: 'Contraseña Antigua',
          cssClass: 'specialClass',
          attributes: {
            minlength: 4,
            inputmode: 'decimal',
          },
        },
        {
          name: 'passwordNew',
          type: 'password',
          placeholder: 'Contraseña Nueva',
          cssClass: 'specialClass',
          attributes: {
            minlength: 4,
            inputmode: 'decimal',
          },
        },
        {
          name: 'passwordNew2',
          type: 'password',
          placeholder: 'Repita Contraseña',
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
            if (value.passwordOld === aux) {
              if(value.passwordNew === value.passwordNew2){
                switch (posi) {
                  case 1:
                    localStorage.setItem('passwordUser', JSON.stringify(value.passwordNew));
                    header = 'Constaseña de Acceso guardada';
                    this.passwordUser = value.passwordNew;
                    break;
                  case 2:
                    localStorage.setItem('passwordApp', JSON.stringify(value.passwordNew));
                    header = 'Constaseña de Configuracion guardada';
                    this.passwordConf = value.passwordNew;
                    break;
                  default:
                    break;
                }
                this.presentVisitoAlert();
              console.log('Confirm Ok', value);
              }else{
                this.errorAlert();
              }
            } else {
              this.errorAlert();
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async alertDomain() {
    let aux: any;
    const url = localStorage.getItem('dominio');
    if (url !== null) {
      aux = JSON.parse(url);
    } else {
      aux = '';
    }
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Registro del Dominio',
      inputs: [
        {
          name: 'url',
          type: 'text',
          placeholder: 'URL',
          value: aux,
        },
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
            if (value.password === this.passwordConf) {
              localStorage.setItem('dominio', JSON.stringify(value.url));
              console.log('Confirm Ok', value);
              this.presentVisitoAlert();
            } else {
              this.errorAlert();
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async alertconfSist() {
    let aux: any;
    const url = localStorage.getItem('conf');
    if (url !== null) {
      aux = JSON.parse(url);
    } else {
      aux = '';
    }
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Configuracion del sistema',
      inputs: [
        {
          name: 'posiTime',
          type: 'number',
          placeholder: 'Timeout Para la toma de ubicacion',
          value: aux.posiTime,
        },
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
            if (value.password === this.passwordConf) {
              localStorage.setItem('conf', JSON.stringify({
                posiTime: value.posiTime
              }));
              console.log('Confirm Ok', value);
              this.presentVisitoAlert();
            } else {
              this.errorAlert();
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async validar() {
    let aux: any;
    const dominio = localStorage.getItem('dominio');
    const websocket = localStorage.getItem('websocket');
    const login = localStorage.getItem('vendedor');
    let jsonDv;
    if(websocket === null || websocket === undefined){
      jsonDv = {
        codVend: JSON.parse(login),
        codComp: null,
      };
    }else{
      jsonDv = {
        codVend: JSON.parse(login),
        codComp: JSON.parse(websocket).idComp,
      };
    }

    let dom = false;
    let webS = false;
    let log = false;
    AppComponent.startLoading();
    this.sqlservices.validateURL(JSON.parse(dominio)).subscribe(
      (res) => {
        AppComponent.startLoading();
        dom = true;
        console.log('Dominio verificado');

        const wsSubs = this.createObservableSocket(
          JSON.parse(websocket).url
        ).subscribe(
          (data) => {
            AppComponent.startLoading();
            console.log(data);
            webS = true;
            wsSubs.unsubscribe();
            this.sqlservices.getVendedor(jsonDv).subscribe(
              async (Data: any) => {
                console.log(Data);
                console.log(Data.objeto);

                // if(Data.resultado === 1){
                Data.objeto.forEach((element) => {
                  const nombre = element.Nombre;

                  if (element.Estado !== '1') {
                    log = false;
                  } else {
                    localStorage.setItem(
                      'user',
                      JSON.stringify({
                        nombre,
                        compNombre: element.Compania,
                        tokenGoogle: element.TokenGoogle,
                      })
                    );
                    AppComponent.nombre = nombre;
                    AppComponent.compania = element.Compania;
                    log = true;
                  }
                });
                const alert = await this.alertCtrl.create({
                  cssClass: 'my-custom-class',
                  header: 'Validacion',
                  inputs: [
                    {
                      name: 'url',
                      type: 'checkbox',
                      placeholder: 'Estado Url',
                      label: 'Estado Url',
                      checked: dom,
                      disabled: true,
                    },
                    {
                      name: 'webSocket',
                      type: 'checkbox',
                      placeholder: 'webSocket',
                      label: 'webSocket',
                      checked: webS,
                      disabled: true,
                    },
                    {
                      name: 'login',
                      type: 'checkbox',
                      placeholder: 'Login',
                      label: 'Login',
                      checked: log,
                      disabled: true,
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
                      handler: (value: any) => {},
                    },
                  ],
                });

                await alert.present();
              },
              async (error) => {
                const alert = await this.alertCtrl.create({
                  cssClass: 'my-custom-class',
                  header: 'Validacion',
                  inputs: [
                    {
                      name: 'url',
                      type: 'checkbox',
                      placeholder: 'Estado Url',
                      label: 'Estado Url',
                      checked: dom,
                      disabled: true,
                    },
                    {
                      name: 'webSocket',
                      type: 'checkbox',
                      placeholder: 'webSocket',
                      label: 'webSocket',
                      checked: webS,
                      disabled: true,
                    },
                    {
                      name: 'login',
                      type: 'checkbox',
                      placeholder: 'Login',
                      label: 'Login',
                      checked: log,
                      disabled: true,
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
                      handler: (value: any) => {},
                    },
                  ],
                });

                await alert.present();
              }
            );
          },
          (err1) => {
            AppComponent.startLoading();
            console.log('error websocket');
            // eslint-disable-next-line @typescript-eslint/naming-convention
            this.sqlservices
              .getVendedor(jsonDv)
              .subscribe(async (Data: any) => {
                AppComponent.startLoading();
                console.log(Data);
                console.log(Data.objeto);

                // if(Data.resultado === 1){
                Data.objeto.forEach((element) => {
                  const nombre = element.Nombre;

                  if (element.Estado !== '1') {
                    log = false;
                    console.log('no valido');
                  } else {
                    log = true;
                    localStorage.setItem(
                      'user',
                      JSON.stringify({
                        nombre,
                        compNombre: element.Compania,
                        tokenGoogle: element.TokenGoogle,
                      })
                    );
                    AppComponent.nombre = nombre;
                    AppComponent.compania = element.Compania;

                  }
                });
                const alert = await this.alertCtrl.create({
                  cssClass: 'my-custom-class',
                  header: 'Validacion',
                  inputs: [
                    {
                      name: 'url',
                      type: 'checkbox',
                      placeholder: 'Estado Url',
                      label: 'Estado Url',
                      checked: dom,
                      disabled: true,
                    },
                    {
                      name: 'webSocket',
                      type: 'checkbox',
                      placeholder: 'webSocket',
                      label: 'webSocket',
                      checked: webS,
                      disabled: true,
                    },
                    {
                      name: 'login',
                      type: 'checkbox',
                      placeholder: 'Login',
                      label: 'Login',
                      checked: log,
                      disabled: true,
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
                      handler: (value: any) => {},
                    },
                  ],
                });

                await alert.present();
              }, async (error) => {
                AppComponent.startLoading();
                console.log('error en el login');
                const alert = await this.alertCtrl.create({
                  cssClass: 'my-custom-class',
                  header: 'Validacion',
                  inputs: [
                    {
                      name: 'url',
                      type: 'checkbox',
                      placeholder: 'Estado Url',
                      label: 'Estado Url',
                      checked: dom,
                      disabled: true,
                    },
                    {
                      name: 'webSocket',
                      type: 'checkbox',
                      placeholder: 'webSocket',
                      label: 'webSocket',
                      checked: webS,
                      disabled: true,
                    },
                    {
                      name: 'login',
                      type: 'checkbox',
                      placeholder: 'Login',
                      label: 'Login',
                      checked: log,
                      disabled: true,
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
                      handler: (value: any) => {},
                    },
                  ],
                });

                await alert.present();
              });
          },
          () => console.log('The observable stream is complete')
        );
      },
      (err) => {
        AppComponent.startLoading();
        console.log('Dominio error');
        dom = false;
        const wsSubs = this.createObservableSocket(
          JSON.parse(websocket).url
        ).subscribe(
          (data) => {
            AppComponent.startLoading();
            console.log(data);
            webS = true;
            wsSubs.unsubscribe();
            this.sqlservices.getVendedor(jsonDv).subscribe(
              async (Data: any) => {
                console.log(Data);
                console.log(Data.objeto);

                // if(Data.resultado === 1){
                Data.objeto.forEach((element) => {
                  const nombre = element.Nombre;

                  if (element.Estado !== '1') {
                    log = false;
                  } else {
                    localStorage.setItem(
                      'user',
                      JSON.stringify({
                        nombre,
                        compNombre: element.Compania,
                        tokenGoogle: element.TokenGoogle,
                      })
                    );
                    AppComponent.nombre = nombre;
                    AppComponent.compania = element.Compania;
                    log = true;
                  }
                });
                const alert = await this.alertCtrl.create({
                  cssClass: 'my-custom-class',
                  header: 'Validacion',
                  inputs: [
                    {
                      name: 'url',
                      type: 'checkbox',
                      placeholder: 'Estado Url',
                      label: 'Estado Url',
                      checked: dom,
                      disabled: true,
                    },
                    {
                      name: 'webSocket',
                      type: 'checkbox',
                      placeholder: 'webSocket',
                      label: 'webSocket',
                      checked: webS,
                      disabled: true,
                    },
                    {
                      name: 'login',
                      type: 'checkbox',
                      placeholder: 'Login',
                      label: 'Login',
                      checked: log,
                      disabled: true,
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
                      handler: (value: any) => {},
                    },
                  ],
                });

                await alert.present();
              },
              async (error) => {
                const alert = await this.alertCtrl.create({
                  cssClass: 'my-custom-class',
                  header: 'Validacion',
                  inputs: [
                    {
                      name: 'url',
                      type: 'checkbox',
                      placeholder: 'Estado Url',
                      label: 'Estado Url',
                      checked: dom,
                      disabled: true,
                    },
                    {
                      name: 'webSocket',
                      type: 'checkbox',
                      placeholder: 'webSocket',
                      label: 'webSocket',
                      checked: webS,
                      disabled: true,
                    },
                    {
                      name: 'login',
                      type: 'checkbox',
                      placeholder: 'Login',
                      label: 'Login',
                      checked: log,
                      disabled: true,
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
                      handler: (value: any) => {},
                    },
                  ],
                });

                await alert.present();
              }
            );
          },
          (err1) => {
            AppComponent.startLoading();
            console.log('error websocket');
            // eslint-disable-next-line @typescript-eslint/naming-convention
            this.sqlservices
              .getVendedor(jsonDv)
              .subscribe(
                async (Data: any) => {

                console.log(Data);
                console.log(Data.objeto);

                // if(Data.resultado === 1){
                Data.objeto.forEach((element) => {
                  const nombre = element.Nombre;

                  if (element.Estado !== '1') {
                    log = false;
                  } else {
                    localStorage.setItem(
                      'user',
                      JSON.stringify({
                        nombre,
                        compNombre: element.Compania,
                        tokenGoogle: element.TokenGoogle,
                      })
                    );
                    AppComponent.nombre = nombre;
                    AppComponent.compania = element.Compania;
                    log = true;
                  }
                });
                const alert = await this.alertCtrl.create({
                  cssClass: 'my-custom-class',
                  header: 'Validacion',
                  inputs: [
                    {
                      name: 'url',
                      type: 'checkbox',
                      placeholder: 'Estado Url',
                      label: 'Estado Url',
                      checked: dom,
                      disabled: true,
                    },
                    {
                      name: 'webSocket',
                      type: 'checkbox',
                      placeholder: 'webSocket',
                      label: 'webSocket',
                      checked: webS,
                      disabled: true,
                    },
                    {
                      name: 'login',
                      type: 'checkbox',
                      placeholder: 'Login',
                      label: 'Login',
                      checked: log,
                      disabled: true,
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
                      handler: (value: any) => {},
                    },
                  ],
                });

                await alert.present();
              },
              async (error) => {
                console.log('error en el login');
                const alert = await this.alertCtrl.create({
                  cssClass: 'my-custom-class',
                  header: 'Validacion',
                  inputs: [
                    {
                      name: 'url',
                      type: 'checkbox',
                      placeholder: 'Estado Url',
                      label: 'Estado Url',
                      checked: dom,
                      disabled: true,
                    },
                    {
                      name: 'webSocket',
                      type: 'checkbox',
                      placeholder: 'webSocket',
                      label: 'webSocket',
                      checked: webS,
                      disabled: true,
                    },
                    {
                      name: 'login',
                      type: 'checkbox',
                      placeholder: 'Login',
                      label: 'Login',
                      checked: log,
                      disabled: true,
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
                      handler: (value: any) => {},
                    },
                  ],
                });

                await alert.present();
              });
          },
          () => console.log('The observable stream is complete')
        );
      }
    );
  }

  createObservableSocket(url: string): Observable<any> {
    const ws = new WebSocket(url);

    return new Observable((observer) => {
      ws.onopen = (event) => {
        console.log(event);
      };

      ws.onmessage = (event) => observer.next(event.data);

      ws.onerror = (event) => {
        console.log('error 3');
        observer.error(event);
      };

      ws.onclose = (event) => {
        observer.complete();
      };

      return () => ws.close(1000, 'The user disconnected');
    });
  }

  async alertWebSocket() {
    let aux: any;
    const url = localStorage.getItem('websocket');
    if (url !== null) {
      aux = JSON.parse(url);
    } else {
      aux = '';
    }
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Registro WebSocket',
      inputs: [
        {
          name: 'url',
          type: 'text',
          placeholder: 'url',
          value: aux.url,
        },
        {
          name: 'idComp',
          type: 'text',
          placeholder: 'Id Compañia',
          value: aux.idComp,
        },
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
            if (value.password === this.passwordConf) {
              const jsonConv = {
                url: value.url,
                idComp: value.idComp,
              };
              localStorage.setItem('websocket', JSON.stringify(jsonConv));
              console.log('Confirm Ok', value);
              this.presentVisitoAlert();
            } else {
              this.errorAlert();
            }
          },
        },
      ],
    });

    await alert.present();
  }
  async alertLogin() {
    let aux: any;
    const url = localStorage.getItem('vendedor');
    if (url !== null) {
      aux = JSON.parse(url);
    } else {
      aux = '';
    }
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Iniciar Sesion',
      inputs: [
        {
          name: 'user',
          type: 'text',
          placeholder: 'Usuario',
          attributes: {
            maxLength: 3,
          },
          value: aux,
        },
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
            if (value.password === this.passwordConf) {
              localStorage.setItem('vendedor', JSON.stringify(value.user));
              console.log('Confirm Ok', value);
              this.presentVisitoAlert();
            } else {
              this.errorAlert();
            }
          },
        },
      ],
    });

    await alert.present();
  }
  async presentVisitoAlert() {
    const alert = this.alertCtrl.create({
      header: 'Confirmacion',
      message: 'Se ha guardado satisfactoriamente',
      buttons: ['Cerrar'],
    });
    (await alert).present();
  }
  async errorAlert() {
    const alert = this.alertCtrl.create({
      header: 'Error',
      message: 'La contraseña es incorrecta',
      buttons: ['Cerrar'],
    });
    (await alert).present();
  }
}
