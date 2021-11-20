import { Injectable } from '@angular/core';
import { ContractService } from './contract.service';
import { Method } from './contract';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  server: string;
  agent: string;
  contract: string;

  posts = {};
  public notifier;

  constructor(
    private contractService: ContractService
  ) {
    this.notifier = new Subject<void>();
  }

  setScope(server, agent, contract) {
    this.server = server;
    this.agent = agent;
    this.contract = contract;
  }

  createPost(text): void {
    const method = { name: 'create_post',
                     values: {'text': text}} as Method;
    this.contractService.write(this.server, this.agent, this.contract, method)
      .subscribe();
  }

  getUpdates() {
    let method = { name: 'get_posts', values: {}} as Method;
    this.contractService.read(this.server, this.agent, this.contract, method)
      .subscribe(posts => {
        let shouldUpdate = false;
        Object.entries(posts).forEach(
          ([key, post]) => {
            if(!(key in this.posts)) {
              this.posts[key] = post;
              shouldUpdate = true;
            }
          }
        );
        if (shouldUpdate) {
          this.notifier.next();
        }
      }
    );
  }

}
