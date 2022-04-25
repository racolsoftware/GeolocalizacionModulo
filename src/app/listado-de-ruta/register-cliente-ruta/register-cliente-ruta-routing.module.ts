import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterClienteRutaPage } from './register-cliente-ruta.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterClienteRutaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterClienteRutaPageRoutingModule {}
