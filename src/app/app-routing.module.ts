import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'selectores',
    loadChildren: () => import('./paises/paises.module').then( m => m.PaisesModule )
  },
  {
    path: '**',
    redirectTo: 'selectores'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
