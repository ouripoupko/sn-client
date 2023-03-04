import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CreateGroupPopupComponent } from './components/create-group-popup/create-group-popup.component';
import { JoinGroupPopupComponent } from './components/join-group-popup/join-group-popup.component';
import { PersonService } from '../../person.service';

export enum Dialogs{
  SET_PROFILE,
  ADD_FRIEND,
  CREATE_GROUP,
  JOIN_GROUP
};

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit, OnDestroy {

  public DialogsEnum = Dialogs
  subs: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    public personService: PersonService
  ) { }

  ngOnInit(): void {
  }

  openDialog(type: Dialogs) {
    let dialogRef;
    dialogRef = type == Dialogs.CREATE_GROUP ?
      this.dialog.open(CreateGroupPopupComponent, {
        width: '50vw'
      }) :
      this.dialog.open(JoinGroupPopupComponent, {
        width: '70vw'
      });

    this.subs.push(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
        }
        else {
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  openFeed() {
    this.personService.showFeed();
  }

  openInviteFriend() {
    this.personService.inviteFriend()
  }

  openAcceptInvitation(event: any) {
    if(event.target.files.length > 0)
    {
      var reader = new FileReader();
      reader.onload = () => {
        var text = reader.result as string;
        var json = JSON.parse(text);
        this.personService.acceptInvitation(json['address'], json['agent'], json['contract']);
      };
      reader.readAsText(event.target.files[0]);
    }
  }
}
