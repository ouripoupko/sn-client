import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Contract, Method } from './contract';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

  getIdentities(server: string): Observable<string[]> {
    return this.http.get<string[]>(`${server}ibc/app`).pipe(
        tap(_ => console.log('fetched identities')),
        catchError(this.handleError<string[]>('getIdentities', []))
      );
  }

  getContracts(server: string, identity: string): Observable<Contract[]> {
    return this.http.get<Contract[]>(`${server}ibc/app/${identity}`).pipe(
        tap(_ => console.log('fetched contracts')),
        catchError(this.handleError<Contract[]>('getContracts', []))
      );
  }

  addContract(server: string, agent: string, name: string, contract: Contract): Observable<Contract> {
    return this.http.post<Contract>(`${server}ibc/app/${agent}/${name}`, contract, this.httpOptions).pipe(
      tap((newContract: Contract) => console.log(`added contract with name=${newContract.name}`)),
      catchError(this.handleError<Contract>('addContract'))
    );
  }

  connect(server: string, agent: string, address: string, pid: string, name: string): Observable<any> {
    return this.http.post(`${server}ibc/app/${agent}/${name}`, { address: address, pid: pid }, this.httpOptions).pipe(
      tap(_ => console.log(`connected to ${address} with contract ${name}`)),
      catchError(this.handleError<any>('connect'))
    );
  }

  listen(server: string, identity: string, contract: string): EventSource {
    return new EventSource(`${server}stream/${identity}/${contract}`);
  }

  write(server: string, identity: string, contract: string, method: Method): Observable<any> {
    const url = `${server}ibc/app/${identity}/${contract}/${method.name}`;
    return this.http.put<any>(url, method, this.httpOptions).pipe(
//      tap((list: Collection) => console.log(list)),
      catchError(this.handleError<any>(`write name=${name}`))
    );
  }

  read(server: string, identity: string, contract: string, method: Method): Observable<any> {
    const url = `${server}ibc/app/${identity}/${contract}/${method.name}`;
    return this.http.post<any>(url, method, this.httpOptions).pipe(
//      tap((list: Collection) => console.log(list)),
      catchError(this.handleError<any>(`read name=${name}`))
    );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
