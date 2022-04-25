import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RutaDiaPage } from './ruta-dia.page';

const routes: Routes = [
  {
    path: '',
    component: RutaDiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RutaDiaPageRoutingModule {}
