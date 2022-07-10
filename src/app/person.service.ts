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

  createPost(text): void {
    const method = { name: 'create_post',
                     values: {'text': text}} as Method;
    let contract = (this.view == 'me') ? this.contract : this.groups[this.view_key]['contract'];
    this.contractService.write(this.server, this.agent, contract, method)
      .subscribe();
  }

  addFriendship(his_server, his_name, his_contract): void {
    console.log(his_server, his_name, his_contract);
    let contract: Contract = {} as Contract;
    contract.code = `
class Friendship:

  def __init__(self):
    self.first = {'server': '${this.server}', 'agent': '${this.agent}', 'contract': '${this.contract}'}
    self.second = {'server': '${his_server}', 'agent': '${his_name}', 'contract': '${his_contract}'}

  def get_partner(self, my_server, my_agent, my_contract):
    if self.first['server'] == my_server and self.first['agent'] == my_agent and self.first['contract'] == my_contract:
      return self.second
    elif self.second['server'] == my_server and self.second['agent'] == my_agent and self.second['contract'] == my_contract:
      return self.first
    else:
      return {}
`
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

  approveFriendship(key) {
    let request = this.requests[key];
    this.contractService.connect(this.server, this.agent, request.server, request.name, request.contract)
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
    this.contractService.addContract(this.server, this.agent, name, contract)
      .subscribe(_ => {
      const my_method = { name: 'add_group',
                          values: {'contract': name}} as Method;
      this.contractService.write(this.server, this.agent, this.contract, my_method).subscribe();
    });
  }

  joinGroup(his_server, his_name, his_contract): void {
    this.contractService.connect(this.server, this.agent, his_server, his_name, his_contract)
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
    console.log('inside update friend posts');
    let partner_method = { name: 'get_posts', values: {} }as Method;
    this.contractService.read(this.friends[key].server, this.friends[key].agent,
                              this.friends[key].profile_contract, partner_method)
      .subscribe(records => {
      console.log('received friends records');
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
//                   this.friends[key]['agent'], this.friends[key]['profile_contract'])
//       this.contractService.listen(this.friends[key]['server'],
//                   this.friends[key]['agent'], this.friends[key]['profile_contract'])
//         .addEventListener('message', message => {
//         console.log('update from friend');
//         if(message.data=="True") {
//           console.log('received friend update');
//           this.updateFriendPosts(key);
//         }
//       });
    });
  }

  updateFriend(key) {
    let method = { name: 'get_partner', values: {'my_server': this.server,
                                                 'my_agent': this.agent,
                                                 'my_contract': this.contract}} as Method;
    this.contractService.read(this.server, this.agent, this.friends[key].contract, method)
      .subscribe(partner => {
      this.friends[key]['server'] = partner.server;
      this.friends[key]['agent'] = partner.agent;
      this.friends[key]['profile_contract'] = partner.contract;
      console.log('will call update posts');
      this.updateFriendPosts(key);
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
    this.update('get_posts').subscribe(records => {
      Object.entries(records).forEach(
        ([post_key, record]) => {
          this.all_posts[post_key] = record;
        }
      );
    });
    this.update('get_friends').subscribe(records => {
      Object.entries(records).forEach(
        ([friend_key, record]) => {
          if(!(friend_key in this.friends)) {
            console.log(friend_key);
            this.friends[friend_key] = record;
            this.updateFriend(friend_key);
          }
        }
      );
    });
    this.update('get_requests').subscribe(records => {
      this.requests = {...records};
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
}
