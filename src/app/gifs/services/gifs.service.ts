import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchGif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private _apiKey     : string = 'p7ya9pZPMrYVU9XgJdlkARMPNUhkuZnP';
  private _servicioUrl : string = 'https://api.giphy.com/v1/gifs'
  private _historial  : string[] = [];
  private _resultados : Gif[] = []

  get historial() {
    return [...this._historial];
  }

  get resultados() {
    return this._resultados;
  }

  validarQuery( query: string ):boolean {
    if(query.trim().length===0){
      return false;
    }else{
      return true
    }
  }    

  buscarGifs(query: string) {
    query = query.trim().toLocaleLowerCase();
    if(this.validarQuery(query)){
      if( !this._historial.includes(query) ){
        this._historial.unshift(query);
        this._historial = this._historial.splice(0,10);
        localStorage.setItem('historial',JSON.stringify(this._historial));
        //console.log(this._historial);
      }

      const params = new HttpParams()
        .set('api_key',this._apiKey)
        .set('q',query)
        .set('limit','10');
      
      console.log(params.toString());
      this.http.get<SearchGif>(`${this._servicioUrl}/search`,{params})
          .subscribe( (resp) => {
            this._resultados = resp.data;
            console.log(resp.data);
            localStorage.setItem('resultados', JSON.stringify(this._resultados));
          });
    }
  }

  constructor( private http: HttpClient ) { 
    this._historial = JSON.parse(localStorage.getItem('historial')!)||[];
    this._resultados = JSON.parse(localStorage.getItem('resultados')!)||[];
  }

}


