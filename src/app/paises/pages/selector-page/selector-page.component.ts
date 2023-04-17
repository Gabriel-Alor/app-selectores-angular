import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs';
import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {

  public miFormulario: FormGroup = this.fb.group({
      region: ['', [ Validators.required ]],
      pais: ['', [ Validators.required ]],
      frontera: ['', [Validators.required] ]
  });

  // llenar selectores
  public regiones: string[] = [];
  public paises: PaisSmall[] = [];
  // public fronteras: string[] = [];
  public fronteras: PaisSmall[] = [];
  
  //UI
  public cargando: boolean = false;

  constructor( private fb: FormBuilder, private paisesService: PaisesService ) {}

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    // codigo para cuando cambia el primer selector la region
    // this.miFormulario.get('region')?.valueChanges
    //     .subscribe({
    //       next: (region) => {
    //         console.log( region );
    //         this.paisesService.getPaisesPorRegion( region )
    //             .subscribe( paises => {
    //               console.log( paises );
    //               this.paises = paises;
    //             })
    //       },
    //       error: (err) => {
    //         console.log(err);
    //       }
    //     })
    this.miFormulario.get('region')?.valueChanges
        .pipe(
          tap( ( _ ) => {
            // restlabecer el valor de campo pais
            this.miFormulario.get('pais')?.reset('');
            this.cargando = true;
          }),
          switchMap( region => {
            // esto regresa un nuevo observable
            return this.paisesService.getPaisesPorRegion( region );
          })
        )
        .subscribe({
          next: ( paises ) => {
            console.log( paises );
            this.paises = paises;
            this.cargando = false;
          },
          error: (err) => {
            console.log( err );
          }
        })

      //codigo para cuando el valor del selector de paises cambia
      this.miFormulario.get('pais')?.valueChanges
          .pipe(
            tap( ( _ ) => {
              this.miFormulario.get('frontera')?.reset('');
              this.cargando = true;
            }),
            switchMap( codigoPais => {
              console.log('hola');
              return this.paisesService.getPaisPorCodigo( codigoPais );
            }),
            switchMap( pais => {
              return this.paisesService.getPaisesPorCodigos( pais[0]?.borders );
            })
          )
          .subscribe({
            next: ( paises ) => {
              console.log("mal", paises );
              // si no existe fronteras entonces que sea un arreglo vacio
              // this.fronteras = pais[0]?.borders || [];
              this.fronteras = paises;
              this.cargando = false;
            },
            error: ( err ) => {
              console.log( err );
            }
          })

  }

  public guardar() {
    console.log(this.miFormulario.value);
  }
}
