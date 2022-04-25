import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'mapa',
    loadChildren: () => import('./mapa/mapa.module').then( m => m.MapaPageModule)
  },
  {
    path: 'listado-de-cliente',
    loadChildren: () => import('./listado-de-cliente/listado-de-cliente.module').then( m => m.ListadoDeClientePageModule)
  },
  {
    path: 'listado-de-ruta',
    loadChildren: () => import('./listado-de-ruta/listado-de-ruta.module').then( m => m.ListadoDeRutaPageModule)
  },
  {
    path: 'ruta-dia',
    loadChildren: () => import('./ruta-dia/ruta-dia.module').then( m => m.RutaDiaPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
