import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadoDeRutaPage } from './listado-de-ruta.page';

const routes: Routes = [
  {
    path: '',
    component: ListadoDeRutaPage
  },
  {
    path: 'register-ruta',
    loadChildren: () => import('./register-ruta/register-ruta.module').then( m => m.RegisterRutaPageModule)
  },
  {
    path: 'ruta',
    loadChildren: () => import('./ruta/ruta.module').then( m => m.RutaPageModule)
  },
  {
    path: 'register-cliente-ruta',
    loadChildren: () => import('./register-cliente-ruta/register-cliente-ruta.module').then( m => m.RegisterClienteRutaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListadoDeRutaPageRoutingModule {}
