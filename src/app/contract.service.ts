import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of, first } from 'rxjs';
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
    return this.http.get<string[]>(`${server}/ibc/app`).pipe(
        tap(_ => console.log('fetched identities')),
        catchError(this.handleError<string[]>('getIdentities', [])),
        first()
      );
  }

  getContracts(server: string, identity: string, desired: string): Observable<Contract[]> {
    let params = new HttpParams().set('action', 'get_contracts');
    return this.http.get<Contract[]>(`${server}/ibc/app/${identity}`, {params: params}).pipe(
        tap(_ => console.log('fetched contracts')),
        map((contracts: Contract[]) => {
          if(desired) {
            let refined: Contract[] = [];
            for (var contract of contracts) {
              if(contract.contract == desired) {
                refined.push(contract);
              }
            }
            return refined;
          } else {
            return contracts;
          }
        }),
        catchError(this.handleError<Contract[]>('getContracts', [])),
        first()
      );
  }

  addContract(server: string, agent: string, contract: Contract): Observable<Boolean> {
    let params = new HttpParams().set('action', 'deploy_contract');
    return this.http.put<Boolean>(`${server}/ibc/app/${agent}`,
                                    contract,
                                    {...this.httpOptions, params: params}).pipe(
      tap(_ => console.log('added contract')),
      catchError(this.handleError<Boolean>('addContract')),
      first()
    );
  }

  joinContract(server: string, agent: string,
               address: string, other_agent: string, contract_id: string, profile: string): Observable<any> {
    let params = new HttpParams().set('action', 'join_contract');
    return this.http.put(`${server}/ibc/app/${agent}`,
                         { address: address, agent: other_agent, contract: contract_id, profile: profile },
                          {...this.httpOptions, params: params}).pipe(
      tap(_ => console.log('joined contract')),
      catchError(this.handleError<any>('connect')),
      first()
    );
  }

  listen(server, targets): EventSource {
    let parameters = "";
    for(let agent in targets) {
      for(let contract of targets[agent]) {
        if(parameters != "") {
          parameters += '&';
        }
        parameters += `agent=${agent}&contract=${contract}`
      }
    }
    return new EventSource(`${server}/stream?${parameters}`);
  }

  write(server: string, identity: string, contract: string, method: Method): Observable<any> {
    const url = `${server}/ibc/app/${identity}/${contract}/${method.name}`;
    let params = new HttpParams().set('action', 'contract_write');
    return this.http.post<any>(url, method, {...this.httpOptions, params: params}).pipe(
      tap(_ => console.log('wrote something')),
      catchError(this.handleError<any>(`write name=${name}`)),
      first()
    );
  }

  read(server: string, identity: string, contract: string, method: Method): Observable<any> {
    const url = `${server}/ibc/app/${identity}/${contract}/${method.name}`;
    let params = new HttpParams().set('action', 'contract_read');
    return this.http.post<any>(url, method, {...this.httpOptions, params: params}).pipe(
      tap(_ => console.log('read something')),
      catchError(this.handleError<any>(`read name=${name}`)),
      first()
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
