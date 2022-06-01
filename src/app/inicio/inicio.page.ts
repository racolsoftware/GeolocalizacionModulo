import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonInfiniteScroll, LoadingController, Platform } from '@ionic/angular';
import { Chart, registerables  } from 'chart.js';
import { AppComponent } from '../app.component';
import { DataService } from '../services/data.service';

Chart.register(...registerables);


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit, AfterViewInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) content: IonContent;
  @ViewChild('doughnutCanvas') private doughnutCanvas: ElementRef;

  backToTop = false;
  titulo = '';
  results = [];
  resultsPendiente = [];
  resultsVisito = [];
  searchTerm = '';
  default= '';
  pagination=1;
  maxElement=15;
  idVendedor='1';
  loadScroll=true;
  fecha = 'ddd';
  asignado = 'activ';
  personali = '';
  load: any;

  public progress = 1;
  public total = 0;
  public visitado = 0;
  diaSemana = [
    { nombre: 'Domingo', valor: 1 },
    { nombre: 'Lunes', valor: 2 },
    { nombre: 'Martes', valor: 3 },
    { nombre: 'Miercoles', valor: 4 },
    { nombre: 'Jueves', valor: 5 },
    { nombre: 'Viernes', valor: 6 },
    { nombre: 'Sabado', valor: 7 },
  ];
  mes = [
    { nombre: 'Enero', valor: 1 },
    { nombre: 'Febrero', valor: 2 },
    { nombre: 'Marzo', valor: 3 },
    { nombre: 'Abril', valor: 4 },
    { nombre: 'Mayo', valor: 5 },
    { nombre: 'Junio', valor: 6 },
    { nombre: 'Julio', valor: 7 },
    { nombre: 'Agosto', valor: 8 },
    { nombre: 'Septiembre', valor: 9 },
    { nombre: 'Octubre', valor: 10 },
    { nombre: 'Noviembre', valor: 11 },
    { nombre: 'Diciembre', valor: 12 },
  ];


  doughnutChart: any;

  slidesOptions = {
    initialSlide: 0,
    // slidesPerView: 1.5
  };

  constructor(private platform: Platform,  public sqlservices: DataService, public router: Router, private route: ActivatedRoute,
    public loadingController: LoadingController ) {
      this.load = this.loadingController.create({
        message: 'Cargando'
      });
  }
  ngAfterViewInit(): void {

  }

  cambioPosision(posi: number){
    switch (posi) {
      case 1:
        this.asignado = 'activ';
        this.personali = '';
        break;
        case 2:
          this.asignado = '';
          this.personali = 'activ';
          break;

      default:
        break;
    }
  }
  startLoading(){
     this.load.present();
  }
  stopLoading(){
      this.load.dismiss();
     console.log('stop');
  }
  ionViewWillEnter() {
    AppComponent.startLoading();
    const d = new Date();
    const day = this.diaSemana[d.getDay()].nombre;
    const month = this.mes[d.getMonth()].nombre;
    this.fecha = day+' '+d.getDate()+' De '+month+' Del ' + d.getFullYear();
    this.loadScroll= true;
    this.infiniteScroll.disabled = true;
    this.results = [];
    this.resultsPendiente = [];
    this.resultsVisito = [];
    const jsonDv = {
      codVend : this.idVendedor,
      posi : 1,
    cantidadMostra : this.pagination*this.maxElement,
    busqueda : this.searchTerm
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    this.sqlservices.getClienteAVisitarHoyCXC(jsonDv).subscribe( (Data: any)=>{
      console.log(Data);
      console.log(Data.objeto);

// if(Data.resultado === 1){
  Data.objeto.forEach(element => {
    if(element.latitude !== ''){
      element.reg= 'Registrado';
    }else{
      element.reg= 'Sin Registrar';
    }
    if(element.Visito!=='1'){
      this.resultsPendiente.push(element);
    }else if(element.Visito ==='1'){
      this.resultsVisito.push(element);
    }
    this.results.push(element);
  });
  this.loadScroll= false;
  this.infiniteScroll.disabled = false;
  AppComponent.stopLoading();
  this.reloadGraphic();


});


  }

  ngOnInit() {
  }

  reloadGraphic(){

    const jsonDv = {
      codVend : this.idVendedor,
      posi : 1,
    cantidadMostra : this.pagination*this.maxElement,
    busqueda : this.searchTerm
    };
    this.sqlservices.getClienteAVisitarHoyCXCTotal(jsonDv).subscribe( (Data: any)=>{
      console.log(Data);
      console.log(Data.objeto);

// if(Data.resultado === 1){
  this.total = Data.objeto[0].Total;
  this.visitado = Data.objeto[0].Visito;
  this.progress = this.visitado/this.total;

  const datos = [
    {
      labels: 'Sin Visitar',
      value:  Data.objeto[0].NoVisito,
    },
    {
      labels: 'Visitado',
      value: this.visitado,
    }
  ];


  this.doughnutChartMethod(datos);

});
  }
  detailsCliente(codi: string){
    this.router.navigate(['/listado-de-cliente/cliente'], { queryParams: { codigo: codi } });
  }

  doughnutChartMethod(datos: any) {
    try {
      this.doughnutChart.destroy();
    } catch (error) {
      console.log(error);
    }

    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Sin Visitar', 'Visitado'],
        datasets: [{
          label: 'Visita del Dia',
          data: datos,
          backgroundColor: [
            // 'rgba(255, 159, 64, 0.8)',
            'rgba(255, 99, 132, 0.8)',//rojo
            // 'rgba(54, 162, 235, 0.8)',//ese azul
            // 'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)'//verde
          ],
          hoverBackgroundColor: [
            // '#FFCE56',
            '#FF6384',
            // '#36A2EB',
            // '#FFCE56',
            '#FF6384'
          ]
        }]
      },
      options: {
        elements: {

        }
      }
    });


  }

  loadData(event) {
    this.pagination+=1;
    let totalData = 0;
    setTimeout(async () => {
      const jsonDv = {
        codVend: this.idVendedor,
        posi: this.pagination,
      cantidadMostra: this.maxElement,
      busqueda: this.searchTerm
      };

      // eslint-disable-next-line @typescript-eslint/naming-convention
      this.sqlservices.getClienteAVisitarHoyCXC(jsonDv).subscribe((Data: any)=>{
        console.log(Data);
        console.log(Data.objeto);

  // if(Data.resultado === 1){
    Data.objeto.forEach(element => {
      if(element.latitude !== ''){
        element.reg= 'Registrado';
      }else{
        element.reg= 'Sin Registrar';
      }
      if(element.Visito!=='1'){
        this.resultsPendiente.push(element);
      }else if(element.Visito ==='1'){
        this.resultsVisito.push(element);
      }
      this.results.push(element);
    });

    totalData = Data.objeto.length;
    if (totalData === 0 || totalData < this.maxElement) {
      event.target.disabled = true;
    }else{
      event.target.disabled = false;
    }
  });


      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll

    }, 500);
  }

  gotToTop() {
    this.content.scrollToTop(1000);
  }

  getScrollPos(pos: number) {
    if (pos > this.platform.height()) {
         this.backToTop = true;
    } else {
         this.backToTop = false;
    }
}

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

}
