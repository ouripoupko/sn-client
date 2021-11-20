import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

  private personSubscription: Subscription;
  posts;

  constructor(
    private personService: PersonService
  ) { }

  ngOnInit(): void {
    this.personSubscription = this.personService.notifier.subscribe(() => {
      this.initialize();
    });
  }

  initialize() {
    this.posts = this.personService.posts;
  }

}
