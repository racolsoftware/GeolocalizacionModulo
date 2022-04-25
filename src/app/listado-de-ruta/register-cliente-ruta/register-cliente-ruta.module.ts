import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterClienteRutaPageRoutingModule } from './register-cliente-ruta-routing.module';

import { RegisterClienteRutaPage } from './register-cliente-ruta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterClienteRutaPageRoutingModule
  ],
  declarations: [RegisterClienteRutaPage]
})
export class RegisterClienteRutaPageModule {}
