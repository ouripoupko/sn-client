import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AddFriendPopupComponent } from './components/add-friend-popup/add-friend-popup.component';
import { CreateGroupPopupComponent } from './components/create-group-popup/create-group-popup.component';
import { JoinGroupPopupComponent } from './components/join-group-popup/join-group-popup.component';
import { PersonService } from '../../person.service';

export enum Dialogs{
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
    dialogRef = type == Dialogs.ADD_FRIEND ?
      this.dialog.open(AddFriendPopupComponent, {
        width: '50vw'
      }) : type == Dialogs.CREATE_GROUP ?
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
}
