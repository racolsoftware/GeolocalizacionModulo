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
    const url=localStorage.getItem('dominio');
    if(url!==null){
      DataService.suplidorServer = JSON.parse(url);
    }
  }

  returnDomain(): string {
    const url=localStorage.getItem('dominio');
    if(url!==null){
      return JSON.parse(url);
    }else{
      return DataService.suplidorServer;
    }
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
    const serverName = this.returnDomain() + 'Procesos/setUbicacion.php';
    console.log(serverName);
    const jsonD = JSON.stringify({
      data :aux
  });
  console.log(jsonD);
    return this.http.post<any>(serverName,  jsonD );
  }
  setUbicacionVisitoVendedor(aux: any): Observable<any> {
    this.getCodVend();
    aux.codVend = DataService.codVend;
    const serverName = this.returnDomain() + 'Procesos/setVisitoCliente.php';
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
    const serverName = this.returnDomain() + 'Procesos/setRuta.php';
    console.log(serverName);
    const jsonD = JSON.stringify({
      data :aux
  });
  console.log(jsonD);
    return this.http.post<any>(serverName,  jsonD );
  }
  setAddRutaCliente(aux: any): Observable<any> {

    const serverName = this.returnDomain() + 'Procesos/setAddRutaCliente.php';
    console.log(serverName);
    const jsonD = JSON.stringify({
      data :aux
  });
  console.log(jsonD);
    return this.http.post<any>(serverName,  jsonD );
  }
  setDeleteClienteRuta(aux: any): Observable<any> {

    const serverName = this.returnDomain() + 'Procesos/setDeleteClienteRuta.php';
    console.log(serverName);
    const jsonD = JSON.stringify({
      data :aux
  });
  console.log(jsonD);
    return this.http.post<any>(serverName,  jsonD );
  }
  setDeleteRuta(aux: any): Observable<any> {

    const serverName = this.returnDomain() + 'Procesos/setDeleteRuta.php';
    console.log(serverName);
    const jsonD = JSON.stringify({
      data :aux
  });
  console.log(jsonD);
    return this.http.post<any>(serverName,  jsonD );
  }
  setReorderRutaCliente(aux: any): Observable<any> {

    const serverName = this.returnDomain() + 'Procesos/setReorderRutaCliente.php';
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
    const serverName = this.returnDomain() + 'Consultas/getCliente.php';
    console.log(serverName);
    const jsonD = JSON.stringify({
      data :aux
  });
  console.log(jsonD);
    return this.http.post<any>(serverName,  jsonD );
  }
  getVendedor(aux: any): Observable<any> {
    this.getCodVend();
    aux.codVend = DataService.codVend;
    const serverName = this.returnDomain() + 'Consultas/getVendedor.php';
    console.log(serverName);
    const jsonD = JSON.stringify({
      data :aux
  });
  console.log(jsonD);
    return this.http.post<any>(serverName,  jsonD );
  }


  getRutasNoAsignadaCliente(aux: any): Observable<any> {
    this.getCodVend();
    aux.codVend = DataService.codVend;
    const serverName = this.returnDomain() + 'Consultas/getRutaListByClientNoAsignado.php';
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
    const serverName = this.returnDomain() + 'Consultas/getRutas.php';
    console.log(serverName);
    const jsonD = JSON.stringify({
      data :aux
  });


  console.log(jsonD);
    return this.http.post<any>(serverName,  jsonD );
  }

  validateURL(url: string): Observable<any> {


    return this.http.get<any>(url +'valid.php');
  }
  getCXCRutas(aux: any): Observable<any> {
    this.getCodVend();
    aux.codVend = DataService.codVend;
    const serverName = this.returnDomain() + 'Consultas/getCXCRutas.php';
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
    const serverName = this.returnDomain() + 'Consultas/getListadoClientes.php';
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
    const serverName = this.returnDomain() + 'Consultas/getListadoClienteRuta.php';
    console.log(serverName);
    const jsonD = JSON.stringify({
      data :aux
  });
  console.log(jsonD);
    return this.http.post<any>(serverName,  jsonD );
  }
  getListadoClientecxcRuta(aux: any): Observable<any> {
    this.getCodVend();
    aux.codVend = DataService.codVend;
    const serverName = this.returnDomain() + 'Consultas/getListadoClienteCXCRutas.php';
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
    const serverName = this.returnDomain() + 'Consultas/getClienteAVisitarHoy.php';
    console.log(serverName);
    const jsonD = JSON.stringify({
      data :aux
  });
  console.log(jsonD);
    return this.http.post<any>(serverName,  jsonD );
  }



  getClienteAVisitarHoyCXC(aux: any): Observable<any> {
    this.getCodVend();
    aux.codVend = DataService.codVend;
    const serverName = this.returnDomain() + 'Consultas/getClienteAVisitarHoyCXCRuta.php';
    console.log(serverName);
    const jsonD = JSON.stringify({
      data :aux
  });
  console.log(jsonD);
    return this.http.post<any>(serverName,  jsonD );
  }
  getClienteAVisitarHoyCXCTotal(aux: any): Observable<any> {
    this.getCodVend();
    aux.codVend = DataService.codVend;
    const serverName = this.returnDomain() + 'Consultas/getClienteVisitarYTotalHoyCXCRuta.php';
    console.log(serverName);
    const jsonD = JSON.stringify({
      data :aux
  });
  console.log(jsonD);
    return this.http.post<any>(serverName,  jsonD );
  }


}
