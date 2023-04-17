import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private baseUrl: string = "https://restcountries.com/v3.1";
  private _regiones: string[] = ['Africa','Americas','Asia','Europe','Oceania'];

  get regiones(): string[] {
    return [...this._regiones ];
  }

  constructor( private http: HttpClient ) { }

  public getPaisesPorRegion( region: string ): Observable<PaisSmall[]> {

    const url: string = `${this.baseUrl}/region/${ region }?fields=cca3,name`;
    return this.http.get<PaisSmall[]>( url );
  }

  public getPaisPorCodigo( codigo: string ): Observable<Pais[]> {

    if( !codigo ){
      return of([]);
    }

    const url: string = `${ this.baseUrl }/alpha/${ codigo }`;
    return this.http.get<Pais[]>( url );
  }


  public getPaisPorCodigoSmall( codigo: string ): Observable<PaisSmall> {
    const url = `${ this.baseUrl }/alpha/${ codigo }?fields=name,cca3`;
    return this.http.get<PaisSmall>( url );
  }

  public getPaisesPorCodigos( borders: string[] ): Observable< PaisSmall[] | []> {
    if( !borders ){
      return of([]);
    }

    const peticiones: Observable<PaisSmall>[] = [];

    borders.forEach( codigo => {
      const peticion = this.getPaisPorCodigoSmall(codigo);
      peticiones.push( peticion );
    })

    // para disparar todas las peticiones de observables

    return combineLatest( peticiones );
  }
}
