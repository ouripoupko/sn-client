import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../../../../../person.service'

@Component({
  selector: 'app-my-friends',
  templateUrl: './my-friends.component.html',
  styleUrls: ['./my-friends.component.scss']
})
export class MyFriendsComponent implements OnInit {

  constructor(public personSvc: PersonService) { }

  ngOnInit(): void {
  }

  loadFriendPosts(key) {
    this.personSvc.showFriend(key);
  }

}
