import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../../person.service';

// export interface Post {
//   owner: string;
//   time: string;
//   text: string;
// }

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class DisplayComponent implements OnInit {

  constructor(
    public personService: PersonService
  ) { }

  ngOnInit(): void {
  }

  initialize() {
  }

}
