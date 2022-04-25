import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadoDeClientePageRoutingModule } from './listado-de-cliente-routing.module';

import { ListadoDeClientePage } from './listado-de-cliente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListadoDeClientePageRoutingModule
  ],
  declarations: [ListadoDeClientePage]
})
export class ListadoDeClientePageModule {}
