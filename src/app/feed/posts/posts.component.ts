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

}
