import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoDeRutaPageRoutingModule } from './listado-de-ruta-routing.module';

import { ListadoDeRutaPage } from './listado-de-ruta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListadoDeRutaPageRoutingModule
  ],
  declarations: [ListadoDeRutaPage]
})
export class ListadoDeRutaPageModule {}
