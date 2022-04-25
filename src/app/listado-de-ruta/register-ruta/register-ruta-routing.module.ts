import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterRutaPage } from './register-ruta.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterRutaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterRutaPageRoutingModule {}
