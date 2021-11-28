import { Component, OnInit } from '@angular/core';
import { IFriend } from '../../models/friend';
import { PersonService } from '../../../../../../person.service'

@Component({
  selector: 'app-my-friends',
  templateUrl: './my-friends.component.html',
  styleUrls: ['./my-friends.component.css']
})
export class MyFriendsComponent implements OnInit {

  friends: IFriend[];

  constructor(public personSvc: PersonService) { }

  ngOnInit(): void {
    console.log(this.personSvc.friends);
    this.friends = this.getFriends();
  }

  getFriends() {
    return [{name: 'shahaf'}, {name: 'ouri'}, {name: 'neta'}, {name: 'shahaf'}, {name: 'ouri'}, {name: 'neta'}];
  }

  loadFriendPosts() {

  }

}
