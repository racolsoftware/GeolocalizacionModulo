import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
})
export class ConfiguracionPage implements OnInit {
  constructor(
    private alertCtrl: AlertController,
    public sqlservices: DataService
  ) {}

  ngOnInit() {}

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
            if (value.password === 'adminadmin') {
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

  async validar() {
    let aux: any;
    const dominio = localStorage.getItem('dominio');
    const websocket = localStorage.getItem('websocket');
    const login = localStorage.getItem('vendedor');

    const jsonDv = {
      codVend: JSON.parse(login),
    };
    let dom = false;
    let webS = false;
    let log = false;

    this.sqlservices.validateURL(JSON.parse(dominio)).subscribe(
      (res) => {
        dom = true;
        console.log('Dominio verificado');

        const wsSubs = this.createObservableSocket(
          JSON.parse(websocket).url
        ).subscribe(
          (data) => {
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
                      })
                    );
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
            console.log('error websocket');
            // eslint-disable-next-line @typescript-eslint/naming-convention
            this.sqlservices
              .getVendedor(jsonDv)
              .subscribe(async (Data: any) => {

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
                      })
                    );

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
        console.log('Dominio error');
        dom = false;
        const wsSubs = this.createObservableSocket(
          JSON.parse(websocket).url
        ).subscribe(
          (data) => {
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
                      })
                    );
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
            console.log('error websocket');
            // eslint-disable-next-line @typescript-eslint/naming-convention
            this.sqlservices
              .getVendedor(jsonDv)
              .subscribe(async (Data: any) => {

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
                      })
                    );
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
              }, async (error) => {
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
            if (value.password === 'adminadmin') {
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
            if (value.password === 'adminadmin') {
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
