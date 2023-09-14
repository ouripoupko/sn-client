import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../person.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    let server = this.route.snapshot.queryParamMap.get('server');
    let agent = this.route.snapshot.queryParamMap.get('agent');
    let contract = this.route.snapshot.queryParamMap.get('contract');
    if (!server || !agent || !contract) {
      this.router.navigate(['login']);
    } else {
      this.personService.setScope(server, agent, contract);
      this.personService.listen();
    }
  }
}
