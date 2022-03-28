import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../../../person.service'

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {

  constructor(public personSvc: PersonService) { }

  ngOnInit(): void {
  }

  loadGroupPosts(key) {
    this.personSvc.showGroup(key);
  }

}
