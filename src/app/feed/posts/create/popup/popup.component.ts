import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../../../person.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  counter: number;

  constructor(
    private personService: PersonService
  ) {
    this.counter = 0;
  }

  ngOnInit(): void {
  }

  post(event: Event) {
    let text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ultrices tincidunt arcu non sodales neque sodales ut. Elementum tempus egestas sed sed risus pretium quam vulputate. Dui nunc mattis enim ut tellus elementum sagittis vitae et. Vitae ultricies leo integer malesuada nunc vel. Dictumst quisque sagittis purus sit amet. Nunc faucibus a pellentesque sit amet porttitor eget dolor. Arcu cursus vitae congue mauris. Mauris rhoncus aenean vel elit. Gravida rutrum quisque non tellus. Lectus sit amet est placerat in egestas erat imperdiet. Ante in nibh mauris cursus mattis molestie a iaculis at. Quis hendrerit dolor magna eget. At urna condimentum mattis pellentesque id nibh tortor. Pharetra diam sit amet nisl suscipit.';
    this.personService.createPost(text + ' ' + this.counter);
    this.counter++;
  }
}
