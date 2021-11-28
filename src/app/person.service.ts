import { Injectable } from '@angular/core';
import { ContractService } from './contract.service';
import { Contract, Method } from './contract';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  server: string;
  agent: string;
  contract: string;

  posts = {};
  friends = {};
  requests = {};
  groups = {};
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

  addFriendship(his_server, his_name, his_contract): void {
    console.log(his_server, his_name, his_contract);
    let contract: Contract = {} as Contract;
    contract.code = "\
class Friendship:\n\
\n\
  def __init__(self):\n\
    self.friends = Storage('friends')\n\
    self.friends['first'] = {'name': master()}\n\
\n\
  def approve_join_contract(self):\n\
    pass\n\
\n\
  def set_partner(self, partner, address):\n\
    self.friends['second'] = {'name': master()}\n\
"
    contract.address = this.server;
    contract.pid = this.agent;
    let contract_name = 'sn_'+this.agent+'_'+his_name;
    this.contractService.addContract(this.server, this.agent, contract_name, contract)
      .subscribe(_ => {
      const my_method = { name: 'befriend',
                          values: {'friendship': contract_name}} as Method;
      this.contractService.write(this.server, this.agent, this.contract, my_method).subscribe();
      const his_method = { name: 'request',
                       values: {'server': this.server, 'name': this.agent, 'contract': contract_name}} as Method;
      this.contractService.write(his_server, his_name, his_contract, his_method).subscribe();
    });
  }

  update(method_name, storage) {
    let method = { name: method_name, values: {}} as Method;
    this.contractService.read(this.server, this.agent, this.contract, method)
      .subscribe(records => {
        let shouldUpdate = false;
        Object.entries(records).forEach(
          ([key, record]) => {
            if(!(key in storage)) {
              storage[key] = record;
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

  getUpdates() {
    this.update('get_posts', this.posts);
    this.update('get_friends', this.friends);
    this.update('get_requests', this.requests);
  }
}
