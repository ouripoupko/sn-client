import { Component, OnInit } from '@angular/core';
import { IFriend } from '../../models/friend';

@Component({
  selector: 'app-my-friends',
  templateUrl: './my-friends.component.html',
  styleUrls: ['./my-friends.component.css']
})
export class MyFriendsComponent implements OnInit {

  friends: IFriend[];

  constructor() { }

  ngOnInit(): void {
    this.friends = this.getFriends();
  }

  getFriends() {
    return [{name: 'shahaf'}, {name: 'ouri'}, {name: 'neta'}, {name: 'shahaf'}, {name: 'ouri'}, {name: 'neta'}];
  }

  loadFriendPosts() {
    
  }

}
