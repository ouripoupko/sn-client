import { Injectable } from '@angular/core';
import { ContractService } from './contract.service';
import { Contract, Method } from './contract';
import { map, tap, mergeMap } from 'rxjs/operators';
import { forkJoin, of, iif } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  server: string;
  agent: string;
  contract: string;
  profile: string;

  name: string;
  view = 'me';
  view_key = 0;
  posts = {};
  friends = {};
  requests = {};
  groups = {};
  group_members = {};
  all_posts = {};

  eventSource: EventSource;
  targets = {};

  constructor(
    private contractService: ContractService
  ) {
  }

  setScope(server, agent, contract) {
    this.server = server;
    this.agent = agent;
    this.contract = contract;
    this.posts = this.all_posts;
  }

  getName(agent) {
    if(agent == this.agent) {
      if(this.name) {
        return this.name;
      } else if(this.agent) {
        if(this.agent.length < 20) {
          return this.agent;
        } else {
          return this.agent.slice(0, 4) + '...' + this.agent.slice(-4)
        }
      } else {
        return '';
      }
    }
    else if(this.friends && agent in this.friends) {
      if('name' in this.friends[agent]) {
        return this.friends[agent]['name'];
      }
    } else if(agent in this.group_members) {
      return this.group_members[agent];
    }
    return agent.slice(0, 4) + '...' + agent.slice(-4);
  }

  createPost(text): void {
    const method = { name: 'create_post',
                     values: {'text': text}} as Method;
    let contract = (this.view == 'me') ? this.contract : this.groups[this.view_key]['contract'];
    this.contractService.write(this.server, this.agent, contract, method)
      .subscribe();
  }

  createGroup(name): void {
    let contract: Contract = {} as Contract;
    contract.code = `
class Group:

    def __init__(self):
        self.posts = Storage('posts')

    def create_post(self, text):
        self.posts.append({'owner': master(), 'time': timestamp(), 'text': text})

    def get_posts(self):
        return {str(key): self.posts[key].get_dict() for key in self.posts}
`
    contract.address = this.server;
    contract.pid = this.agent;
    contract.name = name;
    contract.profile = this.profile;
    contract.contract = 'sn_group.py';
    contract.protocol = 'BFT';
    this.contractService.addContract(this.server, this.agent, contract)
      .subscribe(contract_id => {
        const link = {'address': this.server, 'agent': this.agent, 'contract': contract_id};
        const blob = new Blob([JSON.stringify(link, null, 2)], { type: "application/json",});
        var url = window.URL.createObjectURL(blob);
        var anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "sn_group_invite.json";
        anchor.click();
        window.URL.revokeObjectURL(url);
        this.listen();
      });
  }

  joinGroup(address, agent, contract) {
    this.contractService.joinContract(this.server, this.agent, address, agent, contract, this.profile)
      .subscribe(_ => {
        this.listen();
      });
  }

  update(method_name) {
    let method = { name: method_name, values: {}} as Method;
    return this.contractService.read(this.server, this.agent, this.contract, method);
  }

  updateFriendPosts(key) {
    if(this.friends[key].profile) {
      let name_method = { name: 'get_value', values: {'key': 'first_name'}}as Method;
      this.contractService.read(this.friends[key].server, this.friends[key].agent,
                                this.friends[key].profile, name_method)
        .subscribe(name => {this.friends[key].name = name});
    }
    let partner_method = { name: 'get_posts', values: {} }as Method;
    this.contractService.read(this.friends[key].server, this.friends[key].agent,
                              this.friends[key].wall_contract, partner_method)
      .subscribe(records => {
      this.friends[key]['posts'] = {...records}
      if(this.view == 'friend' && this.view_key == key) {
        this.posts = this.friends[key]['posts'];
      }
      Object.entries(records).forEach(
        ([post_key, record]) => {
          this.all_posts[post_key] = record;
        }
      );
    });
  }

  readPartners(contract) {
    let partners_method = { name: 'get_partners', values: {}} as Method;
    return forkJoin(this.contractService.read(this.server, this.agent, contract, partners_method), of(contract));
  }

  readWall(partners, contract) {
    if(partners.length < 2) {
      return forkJoin(of([]), of({}), of(contract));
    }
    else {
      for(let partner of partners) {
        if(partner.agent != this.agent) {
          let wall_method = {name: 'get_wall', values: {'agent': partner.agent}} as Method;
          return forkJoin(this.contractService.read(this.server, this.agent, contract, wall_method),
                          of(partner),
                          of(contract));
        }
      }
    }
  }

  logPartner(wall, partner, contract) {
    if(Object.keys(partner).length > 0 && wall) {
      let key = partner.agent;
      this.friends[key] = {};
      this.friends[key]['server'] = partner.address;
      this.friends[key]['agent'] = partner.agent;
      this.friends[key]['wall_contract'] = wall;
      this.friends[key]['profile'] = partner.profile;
      this.updateFriendPosts(key);
      if(!(key in this.targets)) {
        this.targets[key] = [];
      }
      this.targets[key].push(this.friends[key]['wall_contract']);
    } else {
      this.targets[this.agent].push(contract);
      this.friends[contract] = {};
      this.friends[contract].agent = contract;
      this.friends[contract].server = '';
    }
    return of(42);
  }

  updateGroup(key) {
    let partners_method = { name: 'get_partners', values: {}} as Method;
    this.contractService.read(this.server, this.agent, key, partners_method)
      .subscribe(partners => {
      for(let partner of partners) {
        if(partner.profile) {
          let name_method = { name: 'get_value', values: {'key': 'first_name'}}as Method;
          this.contractService.read(partner.address, partner.agent, partner.profile, name_method)
            .subscribe(name => {
            this.group_members[partner.agent] = name;
            });
        }
      }
    });
    let method = { name: 'get_posts', values: {}} as Method;
    this.contractService.read(this.server, this.agent, this.groups[key].contract, method)
      .subscribe(records => {
      this.groups[key]['posts'] = {...records}
      if(this.view == 'group' && this.view_key == key) {
        this.posts = this.groups[key]['posts'];
      }
      Object.entries(records).forEach(
        ([post_key, record]) => {
          this.all_posts[post_key] = record;
        }
      );
    });
  }

  getUpdates() {
    this.targets = {};
    this.targets[this.agent] = [this.contract];
    this.update('get_partners').subscribe(partners => {
      for(let partner of partners) {
        if(partner.agent == this.agent) {
          this.profile = partner.profile;
          if(this.profile) {
            const method = { name: 'get_value', values: {'key': 'first_name'}} as Method;
            this.contractService.read(this.server, this.agent, this.profile, method)
              .subscribe(value => {this.name = value;});
          }
        }
      }
    });
    this.update('get_posts').subscribe(records => {
      Object.entries(records).forEach(
        ([post_key, record]) => {
          this.all_posts[post_key] = record;
        }
      );
    });
    this.friends = {};
    let friends$ = this.contractService.getContracts(this.server, this.agent, 'sn_friendship.py').pipe(
      mergeMap((contracts:Contract[]) => iif(() => contracts.length > 0,
        forkJoin(Array.from(contracts, contract => this.readPartners(contract.id))), of([]))),
      mergeMap(x => iif(() => x.length > 0,
        forkJoin(Array.from(x, ([partners, contract]) => this.readWall(partners, contract))), of([]))),
      mergeMap(x => iif(() => x.length > 0,
        forkJoin(Array.from(x, ([wall, partner, contract]) => this.logPartner(wall, partner, contract))), of([])))
    );

    this.groups = {};
    let groups$ = this.contractService.getContracts(this.server, this.agent, 'sn_group.py').pipe(
      map((contracts:Contract[]) => {
        for(let contract of contracts) {
          if(!(contract.id in this.groups)) {
            this.groups[contract.id] = {'contract': contract.id};
          }
          this.groups[contract.id]['name'] = contract.name;
          this.targets[this.agent].push(contract.id);
          this.updateGroup(contract.id);
        }
        return 17;
      }));
    return forkJoin(friends$, groups$);
  }

  showFeed() {
    this.view = 'me';
    this.view_key = 0;
    this.posts = this.all_posts;
  }

  showFriend(key) {
    this.view = 'friend';
    this.view_key = key;
    this.posts = this.friends[key]['posts'];
  }

  showGroup(key) {
    this.view = 'group';
    this.view_key = key;
    this.posts = this.groups[key]['posts'];
  }

  inviteFriend() {
    let contract: Contract = {} as Contract;
    contract.code = `
class Friendship:

  def __init__(self):
    self.walls = Storage('walls')

  def join(self, agent, contract):
    inviter = '${this.agent}'
    if len(self.walls) == 0 and agent != inviter:
      self.walls[inviter] = {'contract': '${this.contract}'}
      self.walls[agent] = {'contract': contract}

  def get_wall(self, agent):
    return self.walls[agent]['contract'] if agent in self.walls else None
`
    contract.address = this.server;
    contract.pid = this.agent;
    contract.name = 'sn_friendship';
    contract.profile = this.profile;
    contract.contract = 'sn_friendship.py';
    contract.protocol = 'BFT';
    this.contractService.addContract(this.server, this.agent, contract)
      .subscribe(contract_id => {
        const link = {'address': this.server, 'agent': this.agent, 'contract': contract_id};
        const blob = new Blob([JSON.stringify(link, null, 2)], { type: "application/json",});
        var url = window.URL.createObjectURL(blob);
        var anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "sn_friend_invite.json";
        anchor.click();
        window.URL.revokeObjectURL(url);
        this.listen();
      });
  }

  acceptInvitation(address, agent, contract) {
    this.contractService.joinContract(this.server, this.agent, address, agent, contract, this.profile)
      .subscribe(reply => {
        const method = { name: 'join',
                         values: {'agent': this.agent, 'contract': this.contract}} as Method;
        this.contractService.write(this.server, this.agent, contract, method).subscribe(_ => {
          this.listen();
        });
      });
  }

  listen() {
    this.getUpdates().subscribe(x => {
      if(this.eventSource) {
        this.eventSource.close();
      }
      this.eventSource = this.contractService.listen(this.server, this.targets);
      this.eventSource.addEventListener('message', message => {
        if(message.data) {
          this.listen();
        }
      });
    });
  }
}
