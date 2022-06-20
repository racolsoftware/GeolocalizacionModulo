import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AppComponent } from 'src/app/app.component';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-ruta',
  templateUrl: './ruta.page.html',
  styleUrls: ['./ruta.page.scss'],
})
export class RutaPage implements OnInit {

  selection = false;
  cantidadSelect = 0;
  codRuta: string;

  src = 'assets/images/product-icon.png';
  descripcion = 'Colmado Sanchez';
  descripcion2 = 'Juan Perez';
  tipoVenta = 'Credito';
  concepto =
    'Pedido realizado por camion y quisiera que me cobraran todas las facturas pendiente que tengo';
  cbxcamion = false;
  results = [];
  recibido = 'active';
  totalCliente = 0;
  visito = 0;
  sinVisitar = 0;
  diaSemana = [
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
    private alertCtrl: AlertController
  ) {
    this.route.queryParams.subscribe((params) => {
      console.log(params); // { codRuta: "price" }
      this.codRuta = params.codigo;
      console.log(this.codRuta); // price
    });
  }

  public selectItem(index: number) {
    console.log('selecciono largo');
    this.selection = true;
    if(!this.results[index].isSelected === true){
      this.cantidadSelect +=1;
    }else{
      this.cantidadSelect -=1;
    }
    if(this.cantidadSelect===0){
      this.selection = false;
    }
    console.log(this.cantidadSelect);
    this.results[index].isSelected = !this.results[index].isSelected;
  }

 public unselectAll() {
    this.selection = false;
    this.results.forEach(notification => {
      notification.isSelected = false;
    });
   }

  async presentConfirm(value: any) {
    console.log(value);
    const jsonDv = {
      codVend: '1',
      codClirut: value,
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    this.sqlservices.getRutasNoAsignadaCliente(jsonDv).subscribe(async (Data: any) => {
      console.log(Data);
      console.log(Data.objeto);

      let listRuta: any [] = [];

      // if(Data.resultado === 1){
      Data.objeto.forEach(async (element) => {
        let disabl = false;
        if(element.CodigoCli !== ''){
          disabl = true;
        }
        listRuta.push({
          type: 'radio',
          label: element.Codigo+' - '+element.Nombre+' - '+ this.selectDia(element.Dia),
          value: element.Codigo,
          disabled: disabl,
          cssClass: 'inputSelect',

        });

      });
      const alert = await this.alertCtrl.create({
        cssClass: 'inputSelect',
        header: 'Ruta del Cliente Personalizada',
        message: 'Seleccione la Ruta Personalizada que le desea asignar al cliente',
        inputs: listRuta,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Agregar',
            handler: (data: string) => {

              console.log(data);
              this.addCliente(value,data).then(()=>{
                this.presentAlertConfirm('Confirmacion','Se ha agregado el cliente a la ruta',data);
              });
            }
          }
        ]
      });
      await alert.present();
    },async ()=>{
      AppComponent.errorAlert('Se produjo un error al conectarse, intentelo mas tarde');
    });

  }
  async addCliente(codi: string, codRuta: string){

    const jsonDv = {
      codRuta: parseInt(codRuta,10),
      codCli: parseInt(codi,10)
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    this.sqlservices.setAddRutaCliente(jsonDv).subscribe((Data: any)=>{
      console.log(Data);
      console.log('vend:' +this.sqlservices.getCodVend());
      // this.router.navigate(['/listado-de-ruta/ruta'],{
      //   queryParams: { codigo: this.codigoRuta },
      // });
},async ()=>{
  AppComponent.errorAlert('Se produjo un error al conectarse, intentelo mas tarde');
});
  }
  async presentAlertConfirm(headerSt: string, messageSt: string, codRuta: string) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: headerSt,
      message: messageSt,
      buttons: [
         {
          text: 'Okay',
          id: 'confirm-button',
          handler: () => {
            console.log('Confirm Okay');
          }
        },
          {
            text: 'Ver Ruta',
            id: 'confirm-button',
            handler: () => {
                this.router.navigate(['/listado-de-ruta/ruta'],{
                  queryParams: { codigo: codRuta },
                });
            }
          }
      ]
    });

    await alert.present();
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
  ionViewWillEnter(){
    AppComponent.startLoading();
    this.results = [];
    const jsonDv = {
      codVend: '1',
      codRuta: parseInt(this.codRuta, 10),
    };

    this.reloadTemplate(jsonDv);
    AppComponent.stopLoading();
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
    this.sqlservices.getListadoClientecxcRuta(jsonDv).subscribe((Data: any) => {
      console.log(Data);
      console.log(Data.objeto);
      this.visito = 0;
      this.sinVisitar = 0;

      // if(Data.resultado === 1){
      this.descripcion = Data.objeto.ruta[0].Nombre;
      this.descripcion2 = this.selectDia(Data.objeto.ruta[0].Dia);
      Data.objeto.clientes.forEach((element) => {
        if(element.Visito === '1'){
          this.visito +=1;
        }else{
          this.sinVisitar +=1;
        }
        if(element.latitud_cli !== null){
          element.reg= 'Registrado';
        }else{
          element.reg= 'Sin Registrar';
        }
        element['isSelected'] = false;
        this.results.push(element);
      });
      this.totalCliente = this.results.length;
    },async ()=>{
      AppComponent.errorAlert('Se produjo un error al conectarse, intentelo mas tarde');
    });
  }
  showInMap() {
    this.router.navigate(['/mapa'], {
      queryParams: { codigo: this.codRuta, accion: 'rutaAsig' },
    });
  }
  updateReorder(){

    const jsonDv = {
      rutaClientes: this.results
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    this.sqlservices.setReorderRutaCliente(jsonDv).subscribe((Data: any)=>{
      console.log(Data);
      this.results = [];
      Data.objeto.forEach((element) => {
        element['isSelected'] = false;
        this.results.push(element);
      });
},async ()=>{
  AppComponent.errorAlert('Se produjo un error al conectarse, intentelo mas tarde');
});
  }

  selectDia(dia: string) {
    let vsa = 'Error';
    this.diaSemana.forEach((element) => {
      if (element.valor.toString() === dia) {
        vsa = element.nombre;
      }
    });
    return vsa;
  }
  detailsCliente(codi: string) {
    if(this.selection===false){
      this.router.navigate(['/listado-de-cliente/cliente'], {
      queryParams: { codigo: codi },
    });
    }
  }
}
