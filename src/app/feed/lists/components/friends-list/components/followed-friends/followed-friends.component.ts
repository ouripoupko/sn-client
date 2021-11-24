import { Component, OnInit } from '@angular/core';
import { IFriend } from '../../models/friend';

@Component({
  selector: 'app-followed-friends',
  templateUrl: './followed-friends.component.html',
  styleUrls: ['./followed-friends.component.css']
})
export class FollowedFriendsComponent implements OnInit {

  friends: IFriend[];

  constructor() { }

  ngOnInit(): void {
    this.friends = this.getFriends();
  }

  getFriends() {
    return [{name: 'sha'}, {name: 'ou'}, {name: 'ne'}];
  }

  unFollow() {
    
  }

}
