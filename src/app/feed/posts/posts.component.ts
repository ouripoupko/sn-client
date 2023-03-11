import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../person.service';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {



  constructor(
    public personService: PersonService
  ) { }

  ngOnInit(): void {
  }

  groupName(key) {
    if(key in this.personService.groups && 'name' in this.personService.groups[key]) {
      return this.personService.groups[key]['name'];
    }
    return '';
  }
}
