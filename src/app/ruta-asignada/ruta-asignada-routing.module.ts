import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RutaAsignadaPage } from './ruta-asignada.page';

const routes: Routes = [
  {
    path: '',
    component: RutaAsignadaPage
  },
  {
    path: 'ruta',
    loadChildren: () => import('./ruta/ruta.module').then( m => m.RutaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RutaAsignadaPageRoutingModule {}
