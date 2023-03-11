import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../../../person.service'

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.scss']
})
export class FriendsListComponent implements OnInit {

  constructor(public personSvc: PersonService) { }

  ngOnInit(): void {
  }

  loadFriendPosts(key) {
    this.personSvc.showFriend(key);
  }
}
