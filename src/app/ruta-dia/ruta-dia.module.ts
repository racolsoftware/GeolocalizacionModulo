import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RutaDiaPageRoutingModule } from './ruta-dia-routing.module';

import { RutaDiaPage } from './ruta-dia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RutaDiaPageRoutingModule
  ],
  declarations: [RutaDiaPage]
})
export class RutaDiaPageModule {}
