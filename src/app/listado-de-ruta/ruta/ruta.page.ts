import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { InAppBrowser,InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-ruta',
  templateUrl: './ruta.page.html',
  styleUrls: ['./ruta.page.scss'],
})
export class RutaPage implements OnInit {
  codRuta: string;
  cantidad = 1;

  puedeAdd = true;
  src = 'assets/images/product-icon.png';
  descripcion = 'Colmado Sanchez';
  descripcion2 = 'Juan Perez';
  tipoVenta = 'Credito';
  concepto =
    'Pedido realizado por camion y quisiera que me cobraran todas las facturas pendiente que tengo';
  cbxcamion = false;
  resultsPrincipal = [];
  results = [];
  recibido = 'active';
  default = '2';
  estadoVisita = [
    { nombre: 'Visitado', valor: '1' },
    { nombre: 'No Visitado', valor: '0' },
  ];
  departamento = [
    { nombre: 'Domingo', valor: 1 },
    { nombre: 'Lunes', valor: 2 },
    { nombre: 'Martes', valor: 3 },
    { nombre: 'Miercoles', valor: 4 },
    { nombre: 'Jueves', valor: 5 },
    { nombre: 'Viernes', valor: 6 },
    { nombre: 'Sabado', valor: 7 },
  ];
  constructor(
    public sqlservices: DataService,
    private route: ActivatedRoute,
    public router: Router,
    private inAppBrowser: InAppBrowser,
    private alertCtrl: AlertController
  ) {
    this.route.queryParams.subscribe((params) => {
      console.log(params); // { codRuta: "price" }
      this.codRuta = params.codigo;
      console.log(this.codRuta); // price
    });
  }

  onRenderItems(event) {
    console.log(`Moving item from ${event.detail.from} to ${event.detail.to}`);
     let draggedItem = this.results.splice(event.detail.from,1)[0];
     this.results.splice(event.detail.to,0,draggedItem);
    //this.listItems = reorderArray(this.listItems, event.detail.from, event.detail.to);
    event.detail.complete();
  }
  registerRutaCliente() {
    this.router.navigate(['/listado-de-ruta/register-cliente-ruta'],{
      queryParams: { codigo: this.codRuta },
    });
  }
  processPedido(codi: string) {
    this.router.navigate(['/app/tab2/success'], {
      queryParams: { codigo: codi },
    });
  }
  selectChanged() {
    if(this.default === '2'){
      this.results = [];
      this.resultsPrincipal.forEach(element => {

          this.results.push(element);
      });

    }else{
      this.results = [];
      this.resultsPrincipal.forEach(element => {
        if(element.Visito === this.default){
          this.results.push(element);
        }
      });
    }
    // this.pagination = 1;
    // let totalData = 0;
    // const jsonDv = {
    //   codVend: this.idVendedor,
    //   posi: this.pagination,
    //   cantidadMostra: this.maxElement,
    //   busqueda: this.searchTerm,
    //   day: parseInt(this.default, 10),
    // };

    // // eslint-disable-next-line @typescript-eslint/naming-convention
    // this.sqlservices.getRutas(jsonDv).subscribe((Data: any) => {
    //   this.results = [];
    //   console.log(Data);
    //   console.log(Data.objeto);

    //   // if(Data.resultado === 1){
    //   Data.objeto.forEach((element) => {
    //     this.results.push(element);
    //     this.resultsPrincipal.push(element);
    //   });

    //   totalData = Data.objeto.length;
    //   if (totalData === 0 || totalData < this.maxElement) {
    //     this.infiniteScroll.disabled = true;
    //   } else {
    //     this.infiniteScroll.disabled = false;
    //   }
    // });

    // console.log('Done');
    // Call our service function which returns an Observable
    // this.results = this.movieService.searchData(this.searchTerm, this.type);
  }

  ionViewWillEnter(){
    this.results = [];
    this.resultsPrincipal = [];
    const jsonDv = {
      codVend: '1',
      codRuta: parseInt(this.codRuta, 10),
    };

    this.reloadTemplate(jsonDv);
  }
  ngOnInit() {
    // this.results = [];
    // const jsonDv = {
    //   codVend: '1',
    //   codRuta: parseInt(this.codRuta, 10),
    // };

    // this.reloadTemplate(jsonDv);
  }

  reloadTemplate(jsonDv: any) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    this.sqlservices.getListadoClienteRuta(jsonDv).subscribe((Data: any) => {
      console.log(Data);
      console.log(Data.objeto);

      // if(Data.resultado === 1){
      this.descripcion = Data.objeto.ruta[0].Nombre;
      this.descripcion2 = this.selectDia(Data.objeto.ruta[0].Dia);
      console.log('cantidad'+this.results.length );
      Data.objeto.clientes.forEach((element) => {
        if(element.latitude !== null){
          element.reg= 'Registrado';
        }else{
          element.reg= 'Sin Registrar';
        }
        this.results.push(element);
        this.resultsPrincipal.push(element);
      });
      console.log(this.results.length );

    });
    this.selectChanged();
  }

  openMap(url: string){


    const options: InAppBrowserOptions = {
      zoom: 'no'
    };

    // Opening a URL and returning an InAppBrowserObject
    const browser = this.inAppBrowser.create(url, '_system', options);
    //  window.open(url, '_system', 'location=yes');
  }

  async createRouteAndOpenMap(){
    let aux = [];
    let noUrl = [];
    let count = 0;
    this.results.forEach((element, i) => {
      if (element.latitude !== null && element.Visito !== '1') {
        if(count < 10){
          aux.push(element);
          count+=1;
        }
      } else if(element.latitude === null || element.latitude === '' || element.latitude === undefined) {
        if(count < 10){
          noUrl.push(element);
        }
      }
    });
    console.log(this.results);
    console.log(noUrl);
    let urlListo = this.generateRoute(aux);
    if(noUrl.length===0){
      let tesShow = [];
      aux.forEach(element => {
        tesShow.push( {
          type: 'text',
          value: element.RazonSocial,
          disabled: true,
          cssClass: 'inputSelect',
        });
      });
      this.openMapShowBefore('Aviso','Ruta de los clientes a visitar:',tesShow,urlListo);

    }else{
      let stri = 'De los primeros 10 clientes, estos no tienen la ubicacion asignada, al continuar, no se podran visualizar en el mapa:';
      let test = [];
      noUrl.forEach(element => {
        test.push( {

          type: 'text',
          value: element.RazonSocial,
          disabled: true,
          cssClass: 'inputSelect',
        });
      });
      const alert = await this.alertCtrl.create({
        cssClass: 'inputSelect',
        header: 'Advertencia',
        message: stri,
        inputs: test,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Aceptar',
            handler: () => {
              let tesShow = [];
              aux.forEach(element => {
                tesShow.push( {
                  type: 'text',
                  value: element.RazonSocial,
                  disabled: true,
                  cssClass: 'inputSelect',
                });
              });
              this.openMapShowBefore('Aviso','Ruta de los clientes a visitar:',tesShow,urlListo);
            }
          }
        ]
      });
      await alert.present();

    }

  }

  async openMapShowBefore(header1: string, stri: string, test: any, urlListo: string){
    const alert = await this.alertCtrl.create({

      header: header1,
      message: stri,
      inputs: test,
      cssClass: 'inputSelect',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {

            this.openMap(urlListo);
          }
        }
      ]
    });
    await alert.present();
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

  updateReorder(){

    const jsonDv = {
      rutaClientes: this.results
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    this.sqlservices.setReorderRutaCliente(jsonDv).subscribe((Data: any)=>{
      console.log(Data);
      this.results = [];
      this.resultsPrincipal = [];

      Data.objeto.forEach((element) => {
        if(element.latitude !== null){
          element.reg= 'Registrado';
        }else{
          element.reg= 'Sin Registrar';
        }
        this.results.push(element);
        this.resultsPrincipal.push(element);
      });
});
  }
  async deleteCliente(codi: string){
    const alert = await this.alertCtrl.create({
      cssClass: 'alertLogCss',
      header: 'Advertencia',
      message: '¿Esta seguro que desea eliminar de la ruta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            const jsonDv = {
              codRuta: parseInt(this.codRuta,10),
              codCli: parseInt(codi,10)
            };

            // eslint-disable-next-line @typescript-eslint/naming-convention
            this.sqlservices.setDeleteClienteRuta(jsonDv).subscribe((Data: any)=>{
              console.log(Data);
              console.log('vend:' +this.sqlservices.getCodVend());
              Data.objeto.forEach((element) => {
                if(element.latitude !== null){
                  element.reg= 'Registrado';
                }else{
                  element.reg= 'Sin Registrar';
                }
                this.results.push(element);
                this.resultsPrincipal.push(element);
              });

              this.updateReorder();

            });

          }
        }
      ]
    });
    await alert.present();


  }

  selectDia(dia: string) {
    let vsa = 'Error';
    this.departamento.forEach((element) => {
      if (element.valor.toString() === dia) {
        vsa = element.nombre;
      }
    });
    return vsa;
  }
  detailsCliente(codi: string) {
    this.router.navigate(['/listado-de-cliente/cliente'], {
      queryParams: { codigo: codi },
    });
  }
  showInMap() {
    this.router.navigate(['/mapa'], {
      queryParams: { codigo: this.codRuta, accion: 'ruta' },
    });
  }
}
