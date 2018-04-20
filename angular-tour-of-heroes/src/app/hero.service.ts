import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';

import { Hero } from './hero';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class HeroService {
  private heroesUrl = '/api/heroes';

  constructor(private messageService: MessageService, private httpClient: HttpClient) { }

  getHeroes(): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(this.heroesUrl)
      .pipe(
          tap(heroes => this.log('fetched heroes')),
          catchError(this.handleError('getHeroes', []))
      );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.httpClient.get<Hero>(url)
      .pipe(
        tap(_ => this.log ('fetched hero with id: ' + id)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  addHero(heroToAdd: Hero): Observable<Hero> {
    return this.httpClient.post(this.heroesUrl, heroToAdd, httpOptions)
      .pipe(
        tap((hero: Hero) => this.log(`added hero with id=${hero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
  }

  updateHero(heroToUpdate: Hero): Observable<any> {
    return this.httpClient.put(this.heroesUrl, heroToUpdate, httpOptions)
      .pipe(
        tap(_ => this.log(`updated hero id=${heroToUpdate.id}`)),
        catchError(this.handleError<any>('updateHero'))
      )
  }

  deleteHero(heroToDelete: Hero | number): Observable<any> {
    const id = typeof heroToDelete === 'number' ? heroToDelete : heroToDelete.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.httpClient.delete(url, httpOptions)
      .pipe(
        tap(_ => this.log(`deleted hero with id=${id}`)),
        catchError(this.handleError<Hero>(`deleteHero`))
      );
  }

  searchHeroes(searchTerm: string): Observable<Hero[]> {
    if(searchTerm.length == 0) {
      return of([]);
    }

    return this.httpClient.get<Hero[]>(`api/heroes/?name=${searchTerm}`)
      .pipe(
        tap(_ => this.log(`found heroes matching "${searchTerm}"`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      );
  }

  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
        console.error(error);

      this.log(`${operation} failed: ${error.message}`);
  
      return of(result as T);
    };
  }
}
