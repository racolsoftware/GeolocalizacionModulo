import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonInfiniteScroll, Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AppComponent } from '../app.component';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-listado-de-cliente',
  templateUrl: './listado-de-cliente.page.html',
  styleUrls: ['./listado-de-cliente.page.scss'],
})
export class ListadoDeClientePage implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonContent) content: IonContent;
  backToTop = false;
  titulo = '';
  results = [];
  searchTerm = '';
  default= '';
  pagination=1;
  maxElement=15;
  idVendedor='1';

  departamento = [
  ];
  constructor(private platform: Platform,  public sqlservices: DataService, public router: Router, private route: ActivatedRoute ) { }

  ngOnInit() {
    AppComponent.startLoading();
    this.results = [];
    const jsonDv = {
      codVend : this.idVendedor,
      posi : this.pagination,
    cantidadMostra : this.maxElement,
    busqueda : this.searchTerm
    };
    // eslint-disable-next-line @typescript-eslint/naming-convention
    this.sqlservices.getListadoCliente(jsonDv).subscribe( (Data: any)=>{
      console.log(Data);
      console.log(Data.objeto);

// if(Data.resultado === 1){
  Data.objeto.forEach(element => {
    if(element.latitude !== ''){
      element.reg= 'Registrado';
    }else{
      element.reg= 'Sin Registrar';
    }
    this.results.push(element);
  });
  AppComponent.stopLoading();
},async ()=>{
  AppComponent.errorAlert('Se produjo un error al conectarse, intentelo mas tarde');
});


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

  searchChanged() {
    this.pagination =1;
    let totalData = 0;
    const jsonDv = {
      codVend: this.idVendedor,
      posi: this.pagination,
    cantidadMostra: this.maxElement,
    busqueda: this.searchTerm
    };

    // eslint-disable-next-line @typescript-eslint/naming-convention
    this.sqlservices.getListadoCliente(jsonDv).subscribe((Data: any)=>{
      this.results = [];
      console.log(Data);
      console.log(Data.objeto);

// if(Data.resultado === 1){
  Data.objeto.forEach(element => {
    if(element.latitude !== ''){
      element.reg= 'Registrado';
    }else{
      element.reg= 'Sin Registrar';
    }
    this.results.push(element);
  });

  totalData = Data.objeto.length;
  if (totalData === 0 || totalData < this.maxElement) {
    this.infiniteScroll.disabled = true;
  }else{
    this.infiniteScroll.disabled = false;
  }
});


    console.log('Done');
    // Call our service function which returns an Observable
    // this.results = this.movieService.searchData(this.searchTerm, this.type);
  }
  detailsCliente(codi: string){
    this.router.navigate(['/listado-de-cliente/cliente'], { queryParams: { codigo: codi } });
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
      this.sqlservices.getListadoCliente(jsonDv).subscribe((Data: any)=>{
        console.log(Data);
        console.log(Data.objeto);

  // if(Data.resultado === 1){
    Data.objeto.forEach(element => {
      if(element.latitude !== ''){
        element.reg= 'Registrado';
      }else{
        element.reg= 'Sin Registrar';
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

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }
}
