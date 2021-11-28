import { Component, OnInit } from '@angular/core';
import { IFriend } from '../../models/friend';
import { PersonService } from '../../../../../../person.service'

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.css']
})
export class FriendRequestsComponent implements OnInit {

  friends: IFriend[];

  constructor(public personSvc: PersonService) { }

  ngOnInit(): void {
    this.friends = this.getFriends();
  }

  getFriends() {
    return [{name: 'haf'}, {name: 'ri'}, {name: 'ta'}];
  }

}
