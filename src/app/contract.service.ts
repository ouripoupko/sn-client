import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

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

  getContracts(server: string, identity: string, desired: string): Observable<Contract[]> {
    let params = new HttpParams().set('action', 'get_contracts');
    return this.http.get<Contract[]>(`${server}ibc/app/${identity}`, {params: params}).pipe(
        tap(_ => console.log('fetched contracts')),
        map((contracts: Contract[]) => {
          console.log('filter contracts', contracts);
          let refined: Contract[] = [];
          for (var contract of contracts) {
            if(contract.contract == desired) {
              refined.push(contract);
            }
          }
          return refined;
        }),
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
    let params = new HttpParams().set('action', 'contract_write');
    return this.http.post<any>(url, method, {...this.httpOptions, params: params}).pipe(
      tap(_ => console.log('wrote something')),
      catchError(this.handleError<any>(`write name=${name}`))
    );
  }

  read(server: string, identity: string, contract: string, method: Method): Observable<any> {
    const url = `${server}ibc/app/${identity}/${contract}/${method.name}`;
    let params = new HttpParams().set('action', 'contract_read');
    return this.http.post<any>(url, method, {...this.httpOptions, params: params}).pipe(
      tap(_ => console.log('read something')),
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
