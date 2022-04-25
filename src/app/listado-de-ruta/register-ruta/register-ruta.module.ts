import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { RegisterRutaPageRoutingModule } from './register-ruta-routing.module';

import { RegisterRutaPage } from './register-ruta.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterRutaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RegisterRutaPage]
})
export class RegisterRutaPageModule {}
