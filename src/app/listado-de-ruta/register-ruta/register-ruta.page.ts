import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-register-ruta',
  templateUrl: './register-ruta.page.html',
  styleUrls: ['./register-ruta.page.scss'],
})


export class RegisterRutaPage implements OnInit, OnDestroy {
  activar = false;


  // eslint-disable-next-line @typescript-eslint/member-ordering
  public errorMessager = {
    descripcion:[
      {type: 'required', message: 'La descripcion es requerida'}
    ],
    dia:[
      {type: 'required', message: 'El dia es requerido'}
    ]
  };
  default= '';
  listaDia = [
    {nombre: 'Domingo', valor:1},
    {nombre: 'Lunes', valor:2},
    {nombre: 'Martes', valor:3},
    {nombre: 'Miercoles', valor:4},
    {nombre: 'Jueves', valor:5},
    {nombre: 'Viernes', valor:6},
    {nombre: 'Sabado', valor:7},
  ];

  registrationForm = this.formBuilder.group({
    descripcion: ['', [Validators.required]],
    dia: ['', [Validators.required]]
  });
  constructor( private formBuilder: FormBuilder,
    public sqlservices: DataService, public router: Router, private route: ActivatedRoute){

  }
  ngOnDestroy(): void {
    this.registrationForm.value.descripcion = '';
    this.registrationForm.value.dia = '';
  }
  ngOnInit(): void {
    this.registrationForm.value.descripcion = '';
    this.registrationForm.value.dia = '';

  }


  public submit(){
    if(this.default!== ''){
      this.activar= false;
      this.setPago();

    }else{
      this.activar= true;
    }
  }
  searchChanged(){
    if(this.default!== ''){
      this.activar= false;
    }else{
      this.activar= true;
    }
  }
  setPago(){
    const jsonDv = {
      codVend : '1',
      descrip : this.registrationForm.value.descripcion,
      diaSemana: parseInt(this.default,10)
    };
    this.sqlservices.setRuta(jsonDv).subscribe( (Data: any)=>{
      console.log(Data);
      console.log(Data.objeto);
      this.router.navigateByUrl('/listado-de-ruta');

    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  get descripcion() {
    return this.registrationForm.get('descripcion');
  };
  // eslint-disable-next-line @typescript-eslint/member-ordering
  get dia() {
    return this.registrationForm.get('dia');
  };

}
