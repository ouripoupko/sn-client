import { Injectable } from '@angular/core';
import { ContractService } from './contract.service';
import { Contract, Method } from './contract';

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
  all_posts = {};

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
    else {
      if('name' in this.friends[agent]) {
        return this.friends[agent]['name'];
      } else {
        return agent.slice(0, 4) + '...' + agent.slice(-4);
      }
    }
  }

  createPost(text): void {
    const method = { name: 'create_post',
                     values: {'text': text}} as Method;
    let contract = (this.view == 'me') ? this.contract : this.groups[this.view_key]['contract'];
    this.contractService.write(this.server, this.agent, contract, method)
      .subscribe();
  }

  approveFriendship(key) {
    let request = this.requests[key];
    this.contractService.joinContract(this.server, this.agent, request.server, request.name, request.contract, '')
      .subscribe(_ => {
      const my_method = { name: 'befriend',
                          values: {'friendship': request.contract,
                                   'request_key': key}} as Method;
      this.contractService.write(this.server, this.agent, this.contract, my_method).subscribe();
    });
    console.log("approve");
  }

  createGroup(name): void {
    console.log("will create group " + name);
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
    this.contractService.addContract(this.server, this.agent, contract)
      .subscribe(_ => {
      const my_method = { name: 'add_group',
                          values: {'contract': name}} as Method;
      this.contractService.write(this.server, this.agent, this.contract, my_method).subscribe();
    });
  }

  joinGroup(his_server, his_name, his_contract): void {
    this.contractService.joinContract(this.server, this.agent, his_server, his_name, his_contract, '')
      .subscribe(_ => {
      const my_method = { name: 'add_group',
                          values: {'contract': his_contract}} as Method;
      this.contractService.write(this.server, this.agent, this.contract, my_method).subscribe();
    });
  }

  update(method_name) {
    let method = { name: method_name, values: {}} as Method;
    return this.contractService.read(this.server, this.agent, this.contract, method);
  }

  updateFriendPosts(key) {
    let name_method = { name: 'get_value', values: {'key': 'first_name'}}as Method;
    this.contractService.read(this.friends[key].server, this.friends[key].agent,
                              this.friends[key].profile, name_method)
      .subscribe(name => {this.friends[key].name = name});
    let partner_method = { name: 'get_posts', values: {}, arguments: ['shlomo'] }as Method;
    this.contractService.read(this.friends[key].server, this.friends[key].agent,
                              this.friends[key].wall_contract, partner_method)
      .subscribe(records => {
      console.log('posts:', records);
      this.friends[key]['posts'] = {...records}
      if(this.view == 'friend' && this.view_key == key) {
        this.posts = this.friends[key]['posts'];
      }
      Object.entries(records).forEach(
        ([post_key, record]) => {
          this.all_posts[post_key] = record;
        }
      );
//       console.log('listen', this.friends[key]['server'],
//                   this.friends[key]['agent'], this.friends[key]['wall_contract'])
//       this.contractService.listen(this.friends[key]['server'],
//                   this.friends[key]['agent'], this.friends[key]['wall_contract'])
//         .addEventListener('message', message => {
//         console.log('update from friend');
//         if(message.data=="True") {
//           console.log('received friend update');
//           this.updateFriendPosts(key);
//         }
//       });
    });
  }

  updateFriend(contract) {
    console.log('update friend:', contract);
    let partners_method = { name: 'get_partners', values: {}} as Method;
    this.contractService.read(this.server, this.agent, contract.id, partners_method)
      .subscribe(partners => {
      for(let partner of partners) {
        if(partner.agent != this.agent) {
          let wall_method = {name: 'get_wall', values: {'agent': partner.agent}} as Method;
          this.contractService.read(this.server, this.agent, contract.id, wall_method).subscribe(wall => {
            let key = partner.agent;
            console.log('the partner:', partner, partner.address, wall);
            this.friends[key] = {};
            this.friends[key]['server'] = partner.address;
            this.friends[key]['agent'] = partner.agent;
            this.friends[key]['wall_contract'] = wall;
            this.friends[key]['profile'] = partner.profile;
            this.updateFriendPosts(key);
          });
        }
      }
    });
  }

  updateGroup(key) {
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
    this.update('get_partners').subscribe(partners => {
      for(let partner of partners) {
        if(partner.agent == this.agent) {
          this.profile = partner.profile;
          const method = { name: 'get_value', values: {'key': 'first_name'}} as Method;
          this.contractService.read(this.server, this.agent, this.profile, method)
            .subscribe(value => {console.log('read name', value); this.name = value;});
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
    this.contractService.getContracts(this.server, this.agent, 'sn_friendship.py')
      .subscribe((contracts:Contract[]) => {
        for(let contract of contracts) {
          this.updateFriend(contract);
        }
      });
    this.update('get_groups').subscribe(records => {
      Object.entries(records).forEach(
        ([group_key, record]) => {
          if(!(group_key in this.groups)) {
            this.groups[group_key] = record;
//             this.contractService.listen(this.server, this.agent, record['contract'])
//               .addEventListener('message', message => {
//               console.log('update from group');
//               if(message.data=="True") {
//                 this.updateGroup(group_key);
//               }
//             });
          }
          this.updateGroup(group_key);
        }
      );
    });
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
        const link = {'address': this.server, 'agent': this.agent, 'contract': contract_id, 'profile': this.profile};
        const blob = new Blob([JSON.stringify(link, null, 2)], { type: "application/json",});
        var url = window.URL.createObjectURL(blob);
        var anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "sn_friend_invite.json";
        anchor.click();
        window.URL.revokeObjectURL(url);
      });
  }

  acceptInvitation(address, agent, contract) {
    this.contractService.joinContract(this.server, this.agent, address, agent, contract, this.profile)
      .subscribe(reply => {
        console.log(reply);
        const method = { name: 'join',
                         values: {'agent': this.agent, 'contract': this.contract}} as Method;
        this.contractService.write(this.server, this.agent, contract, method).subscribe();
      });
  }
}
