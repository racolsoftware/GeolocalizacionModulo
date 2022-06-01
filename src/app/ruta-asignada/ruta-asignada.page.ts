import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonInfiniteScroll, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-ruta-asignada',
  templateUrl: './ruta-asignada.page.html',
  styleUrls: ['./ruta-asignada.page.scss'],
})
export class RutaAsignadaPage implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) content: IonContent;
  backToTop = false;
  titulo = '';
  results = [];
  searchTerm = '';

  pagination = 1;
  maxElement = 15;
  idVendedor = '1';
  default = '0';
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
    private platform: Platform,
    public sqlservices: DataService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    AppComponent.startLoading();
    this.results = [];
    const jsonDv = {
      codVend: this.idVendedor,
      posi: this.pagination,
      cantidadMostra: this.maxElement,
      busqueda: this.searchTerm,
      day: parseInt(this.default, 10),
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    this.sqlservices.getCXCRutas(jsonDv).subscribe((Data: any) => {
      console.log(Data);
      console.log(Data.objeto);

      // if(Data.resultado === 1){
      Data.objeto.forEach((element) => {
        this.results.push(element);
      });
      AppComponent.stopLoading();
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

  getScrollPos(pos: number) {
    if (pos > this.platform.height()) {
      this.backToTop = true;
    } else {
      this.backToTop = false;
    }
  }
  ngOnDestroy(): void {
    this.results = [];
  }
  gotToTop() {
    this.content.scrollToTop(1000);
  }
  doRefresh(event) {
    this.pagination = 1;
    let totalData = 0;
    const jsonDv = {
      codVend: this.idVendedor,
      posi: this.pagination,
      cantidadMostra: this.maxElement,
      busqueda: this.searchTerm,
      day: parseInt(this.default, 10),
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    this.sqlservices.getCXCRutas(jsonDv).subscribe((Data: any) => {
      this.results = [];
      console.log(Data);
      console.log(Data.objeto);

      // if(Data.resultado === 1){
      Data.objeto.forEach((element) => {
        this.results.push(element);
      });
      event.target.complete();

      totalData = Data.objeto.length;
      if (totalData === 0 || totalData < this.maxElement) {
        this.infiniteScroll.disabled = true;
      } else {
        this.infiniteScroll.disabled = false;
      }
    });

    console.log('Done');
  }
  searchChanged() {
    this.pagination = 1;
    let totalData = 0;
    const jsonDv = {
      codVend: this.idVendedor,
      posi: this.pagination,
      cantidadMostra: this.maxElement,
      busqueda: this.searchTerm,
      day: parseInt(this.default, 10),
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    this.sqlservices.getCXCRutas(jsonDv).subscribe((Data: any) => {
      this.results = [];
      console.log(Data);
      console.log(Data.objeto);

      // if(Data.resultado === 1){
      Data.objeto.forEach((element) => {
        this.results.push(element);
      });

      totalData = Data.objeto.length;
      if (totalData === 0 || totalData < this.maxElement) {
        this.infiniteScroll.disabled = true;
      } else {
        this.infiniteScroll.disabled = false;
      }
    });

    console.log('Done');
    // Call our service function which returns an Observable
    // this.results = this.movieService.searchData(this.searchTerm, this.type);
  }
  registerRuta() {
    this.router.navigate(['/listado-de-ruta/register-ruta']);
  }
  detailsRutaAsignada(codi: string) {
    this.router.navigate(['/ruta-asignada/ruta'], {
      queryParams: { codigo: codi },
    });
  }
  loadData(event) {
    this.pagination += 1;
    let totalData = 0;
    setTimeout(async () => {
      const jsonDv = {
        codVend: this.idVendedor,
        posi: this.pagination,
        cantidadMostra: this.maxElement,
        busqueda: this.searchTerm,
        day: parseInt(this.default, 10),
      };

      // eslint-disable-next-line @typescript-eslint/naming-convention
      this.sqlservices.getCXCRutas(jsonDv).subscribe((Data: any) => {
        console.log(Data);
        console.log(Data.objeto);

        // if(Data.resultado === 1){
        Data.objeto.forEach((element) => {
          this.results.push(element);
        });

        totalData = Data.objeto.length;
        if (totalData === 0 || totalData < this.maxElement) {
          event.target.disabled = true;
        } else {
          event.target.disabled = false;
        }
      });

      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }
}

