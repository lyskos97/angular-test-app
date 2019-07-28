import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import { MessageService } from "./message.service";
import { Hero } from "./hero";

@Injectable({
  providedIn: "root"
})
export class HeroService {
  private heroesUrl = "api/heroes";
  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  private log(message: string) {
    this.messageService.add(message);
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<{ data: Hero[] }>(this.heroesUrl).pipe(
      map(res => res.data),
      tap(_ => this.log("fetched heroes")),
      catchError<Hero[], Observable<any>>(this.handleError("getHeroes"))
    );
  }

  getHeroById(id: number): Observable<Hero> {
    return this.http.get<{ data: Hero }>(`${this.heroesUrl}/${id}`).pipe(
      map(h => h.data),
      tap(h => this.log(`HeroService: fetched hero id=${h.id}`)),
      catchError<Hero, Observable<any>>(this.handleError("getHero", null))
    );
  }

  searchHeroes(name: string): Observable<Hero[]> {
    return this.http
      .get<{ data: Hero[] }>(this.heroesUrl, {
        params: new HttpParams({
          fromObject: {
            name
          }
        })
      })
      .pipe(map(res => res.data));
  }

  updateHero(hero: Hero): Observable<Hero> {
    return this.http.put<null>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(() => this.log(`Updated hero with id=${hero.id}`)),
      catchError(this.handleError("updateHero", null))
    );
  }

  createHero(name: string): Observable<Hero> {
    return this.http
      .post<{ data: Hero }>(this.heroesUrl, { name }, this.httpOptions)
      .pipe(
        map(res => res.data),
        tap(h => this.log(`Created hero ${h.name} with id=${h.id}`)),
        catchError(this.handleError("createHero", null))
      );
  }

  deleteHero(id: number): Observable<null> {
    return this.http
      .delete<null>(`/${this.heroesUrl}/${id}`, this.httpOptions)
      .pipe(
        tap(_ => this.log(`Deleted hero with id=${id}`)),
        catchError(this.handleError("deleteHero", null))
      );
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);

      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }
}
