import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonService } from '../person.service';
import { ContractService } from '../contract.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private contractService: ContractService,
    private personService: PersonService
  ) { }

  ngOnInit(): void {
    let server = decodeURIComponent(this.route.snapshot.paramMap.get('server'));
    let agent = this.route.snapshot.paramMap.get('agent');
    let contract = this.route.snapshot.paramMap.get('contract');
    this.personService.setScope(server, agent, contract);
    this.personService.getUpdates();
    this.contractService.listen(server, agent, contract).addEventListener('message', message => {
      if(message.data=="True") {
        this.personService.getUpdates();
      } else {
        console.log("False");
      }
    });
  }

}
