import { Component, OnInit } from '@angular/core';
import { IFriend } from '../../models/friend';

@Component({
  selector: 'app-pending-friends',
  templateUrl: './pending-friends.component.html',
  styleUrls: ['./pending-friends.component.css']
})
export class PendingFriendsComponent implements OnInit {

  friends: IFriend[];

  constructor() { }

  ngOnInit(): void {
    this.friends = this.getFriends();
  }

  getFriends() {
    return [{name: 'sha'}, {name: 'ou'}, {name: 'ne'}];
  }

  addFriend() {
    
  }

}
