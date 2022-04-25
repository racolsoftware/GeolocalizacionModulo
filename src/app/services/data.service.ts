import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';

// export const server = 'http://pagos.racolcomputers.com/data/php/'
export const server = 'http://serverracol.ddns.net:8080/GeolocationRacolCliente/data/php/';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public static  suplidorServer = server;
  public static  codVend = '';




  constructor(private http: HttpClient, private router: Router, private titleService: Title ) {

  }

  setSuplidorServer(aux: string){
    DataService.suplidorServer = aux;
  }
  getCodVend(){
    const valorLS: any = localStorage.getItem('vendedor');
    const data: any = JSON.parse(valorLS);
    if(data !== '' || data !== null){
      console.log(data);
      DataService.codVend = data;
    }else{
      DataService.codVend = '';
    }
    return DataService.codVend;
  }

  setUbicacion(aux: any): Observable<any> {
    this.getCodVend();
    aux.codVend = DataService.codVend;
    const serverName = DataService.suplidorServer + 'Procesos/setUbicacion.php';
    console.log(serverName);
    const jsonD = JSON.stringify({
      data :aux
  });
  console.log(jsonD);
    return this.http.post<any>(serverName,  jsonD );
  }
  setRuta(aux: any): Observable<any> {
    this.getCodVend();
    aux.codVend = DataService.codVend;
    const serverName = DataService.suplidorServer + 'Procesos/setRuta.php';
    console.log(serverName);
    const jsonD = JSON.stringify({
      data :aux
  });
  console.log(jsonD);
    return this.http.post<any>(serverName,  jsonD );
  }
  setAddRutaCliente(aux: any): Observable<any> {

    const serverName = DataService.suplidorServer + 'Procesos/setAddRutaCliente.php';
    console.log(serverName);
    const jsonD = JSON.stringify({
      data :aux
  });
  console.log(jsonD);
    return this.http.post<any>(serverName,  jsonD );
  }
  getCliente(aux: any): Observable<any> {
    this.getCodVend();
    aux.codVend = DataService.codVend;
    const serverName = DataService.suplidorServer + 'Consultas/getCliente.php';
    console.log(serverName);
    const jsonD = JSON.stringify({
      data :aux
  });
  console.log(jsonD);
    return this.http.post<any>(serverName,  jsonD );
  }
  getRutas(aux: any): Observable<any> {
    this.getCodVend();
    aux.codVend = DataService.codVend;
    const serverName = DataService.suplidorServer + 'Consultas/getRutas.php';
    console.log(serverName);
    const jsonD = JSON.stringify({
      data :aux
  });
  console.log(jsonD);
    return this.http.post<any>(serverName,  jsonD );
  }
  getListadoCliente(aux: any): Observable<any> {
    this.getCodVend();
    aux.codVend = DataService.codVend;
    const serverName = DataService.suplidorServer + 'Consultas/getListadoClientes.php';
    console.log(serverName);
    const jsonD = JSON.stringify({
      data :aux
  });
  console.log(jsonD);
    return this.http.post<any>(serverName,  jsonD );
  }
  getListadoClienteRuta(aux: any): Observable<any> {
    this.getCodVend();
    aux.codVend = DataService.codVend;
    const serverName = DataService.suplidorServer + 'Consultas/getListadoClienteRuta.php';
    console.log(serverName);
    const jsonD = JSON.stringify({
      data :aux
  });
  console.log(jsonD);
    return this.http.post<any>(serverName,  jsonD );
  }

  getClienteAVisitarHoy(aux: any): Observable<any> {
    this.getCodVend();
    aux.codVend = DataService.codVend;
    const serverName = DataService.suplidorServer + 'Consultas/getClienteAVisitarHoy.php';
    console.log(serverName);
    const jsonD = JSON.stringify({
      data :aux
  });
  console.log(jsonD);
    return this.http.post<any>(serverName,  jsonD );
  }


}
