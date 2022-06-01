import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RutaAsignadaPageRoutingModule } from './ruta-asignada-routing.module';

import { RutaAsignadaPage } from './ruta-asignada.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RutaAsignadaPageRoutingModule
  ],
  declarations: [RutaAsignadaPage]
})
export class RutaAsignadaPageModule {}
