import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-ruta',
  templateUrl: './ruta.page.html',
  styleUrls: ['./ruta.page.scss'],
})
export class RutaPage implements OnInit {
  codRuta: string;
  cantidad = 1;
  src = 'assets/images/product-icon.png';
  descripcion = 'Colmado Sanchez';
  descripcion2 = 'Juan Perez';
  tipoVenta = 'Credito';
  concepto =
    'Pedido realizado por camion y quisiera que me cobraran todas las facturas pendiente que tengo';
  cbxcamion = false;
  results = [];
  recibido = 'active';
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
    public router: Router
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
  ionViewWillEnter(){
    this.results = [];
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
      Data.objeto.clientes.forEach((element) => {
        this.results.push(element);
      });
    });
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
}
